#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SERVICES=(
    "api-gateway"
    "services/auth-service"
    "services/events-services"
    "services/project-services"
    "services/public-service"
    "services/user-services"
)

SERVICE_PORTS=(
    "api-gateway:8000"
    "services/auth-service:8001"
    "services/events-services:8002"
    "services/project-services:8003"
    "services/public-service:8005"
    "services/user-services:8004"
)

DATABASES=(
    "events"
    "users"
    "projects"
    "public"
    "auth"
)

KEY_SERVICES=(
    "api-gateway"
    "services/auth-service"
)

generate_key_pairs() {
    echo -e "${YELLOW}Generating RSA key pairs...${NC}"
    
    temp_dir=$(mktemp -d)
    
    openssl genrsa -out "$temp_dir/private.pem" 2048
    
    openssl rsa -in "$temp_dir/private.pem" -outform PEM -pubout -out "$temp_dir/public.pem"
    
    for service in "${KEY_SERVICES[@]}"; do
        echo -e "${YELLOW}Copying keys to $service...${NC}"
        mkdir -p "$service/secrets"
        cp "$temp_dir/private.pem" "$service/secrets/"
        cp "$temp_dir/public.pem" "$service/secrets/"
        chmod 600 "$service/secrets/private.pem"
        chmod 644 "$service/secrets/public.pem"
    done
    
    rm -rf "$temp_dir"
    
    echo -e "${GREEN}RSA key pairs generated and distributed successfully!${NC}"
}

install_postgres() {
    echo -e "${YELLOW}Installing PostgreSQL...${NC}"
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    echo -e "${GREEN}PostgreSQL installed successfully!${NC}"
    echo -e "PostgreSQL version: $(psql --version)"
}

create_databases() {
    echo -e "${YELLOW}Creating PostgreSQL databases...${NC}"
    read -p "Enter PostgreSQL username: " pg_user
    read -s -p "Enter PostgreSQL password: " pg_password
    echo
    
    sudo -u postgres psql -c "DO \$\$ BEGIN CREATE ROLE $pg_user WITH LOGIN PASSWORD '$pg_password' CREATEDB; EXCEPTION WHEN duplicate_object THEN RAISE NOTICE 'User already exists'; END \$\$;"
    sudo -u postgres psql -c "ALTER USER $pg_user CREATEDB;"
    
    for db in "${DATABASES[@]}"; do
        echo -e "${YELLOW}Creating database: $db${NC}"
        sudo -u postgres psql -c "CREATE DATABASE $db OWNER $pg_user;"
    done

    update_env_file "$pg_user" "$pg_password"

    echo -e "${GREEN}Databases created successfully!${NC}"
}

update_env_file() {
    local pg_user=$1
    local pg_password=$2

    echo -e "${YELLOW}Updating .env file...${NC}"
    
    read -p "Enter your email address: " email
    read -s -p "Enter your email password: " email_pass
    echo

    cat > .env <<EOF
AUTH_SERVICE_URL=http://localhost:8001
EVENTS_SERVICE_URL=http://localhost:8002
PROJECTS_SERVICE_URL=http://localhost:8003
USERS_SERVICE_URL=http://localhost:8004
PUBLIC_SERVICE_URL=http://localhost:8005
EVENTS_DATABASE_URL=postgresql://${pg_user}:${pg_password}@localhost:5432/events
USERS_DATABASE_URL=postgresql://${pg_user}:${pg_password}@localhost:5432/users
PROJECTS_DATABASE_URL=postgresql://${pg_user}:${pg_password}@localhost:5432/projects
PUBLIC_DATABASE_URL=postgresql://${pg_user}:${pg_password}@localhost:5432/public
AUTH_DATABASE_URL=postgresql://${pg_user}:${pg_password}@localhost:5432/auth
MY_MAIL=${email}
MY_MAIL_PASS=${email_pass}
JWT_PRIVATE_KEY_PATH=secrets/private.pem
JWT_PUBLIC_KEY_PATH=secrets/public.pem
EOF

    echo -e "${GREEN}.env file updated successfully!${NC}"
}

install_virtualenv() {
    echo -e "${YELLOW}Installing Python virtualenv...${NC}"
    sudo apt update
    sudo apt install -y python3 python3-pip python3-venv
    
    python3 -m pip install --upgrade pip
    python3 -m pip install virtualenv
    
    echo -e "${GREEN}Python virtualenv installed successfully!${NC}"
    echo -e "Python version: $(python3 --version)"
    echo -e "Pip version: $(python3 -m pip --version)"
    echo -e "Virtualenv version: $(virtualenv --version)"
}

configure_psycopg2() {
    echo -e "${YELLOW}Installing PostgreSQL Python adapter (psycopg2)...${NC}"
    sudo apt install -y libpq-dev python3-dev
    python3 -m pip install psycopg2-binary
    
    echo -e "${GREEN}psycopg2 installed successfully!${NC}"
}

setup_environment() {
    echo -e "${GREEN}Starting environment setup...${NC}"
    install_postgres
    create_databases
    install_virtualenv
    configure_psycopg2
    generate_key_pairs
    echo -e "${GREEN}Environment setup completed successfully!${NC}"
}

setup_services() {
    echo "Starting service setup process..."

    if [ ! -f ./.env ]; then
        echo -e "${RED}Error: .env file not found in the current directory.${NC}"
        exit 1
    fi

    if ! command -v virtualenv &> /dev/null; then
        echo -e "${RED}Error: virtualenv is not installed. Please run './manage.sh env' first.${NC}"
        exit 1
    fi

    for service in "${SERVICES[@]}"; do
        echo -e "${YELLOW}Copying .env to $service...${NC}"
        cp ./.env "$service/"
    done

    for service in "${SERVICES[@]}"; do
        echo -e "${YELLOW}Setting up $service...${NC}"
        (cd "$service" &&
            virtualenv .venv &&
            source .venv/bin/activate &&
            pip install -r requirements.txt &&
            mkdir -p logs)
    done

    echo -e "${GREEN}Service setup completed successfully.${NC}"
}

run_services() {
    echo -e "${YELLOW}Starting all services...${NC}"

    for entry in "${SERVICE_PORTS[@]}"; do
        IFS=':' read -ra parts <<< "$entry"
        service="${parts[0]}"
        port="${parts[1]}"
        
        echo -e "${GREEN}Starting $service on port $port...${NC}"
        (cd "$service" &&
            source .venv/bin/activate &&
            nohup uvicorn src.main:app --host 0.0.0.0 --port "$port" > logs/output.log 2>&1 &)
    done

    echo -e "${GREEN}All services started. Check logs in each service's logs directory.${NC}"
    echo -e "To stop all services, run: pkill -f uvicorn"
}

stop_services() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    pkill -f uvicorn || echo -e "${YELLOW}No services were running.${NC}"
    echo -e "${GREEN}All services stopped.${NC}"
}

case "$1" in
    env)
        setup_environment
        ;;
    setup)
        setup_services
        ;;
    run)
        run_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        run_services
        ;;
    *)
        echo -e "${RED}Usage: $0 {env|setup|run|stop|restart}${NC}"
        echo -e "  env     - Set up PostgreSQL, Python environment, and generate key pairs"
        echo -e "  setup   - Set up all services (virtualenvs, dependencies)"
        echo -e "  run     - Start all services"
        echo -e "  stop    - Stop all running services"
        echo -e "  restart - Restart all services"
        exit 1
        ;;
esac