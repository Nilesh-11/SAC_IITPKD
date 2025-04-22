import psycopg2
from psycopg2 import sql

# List of PostgreSQL database connection configs
databases = [
    {"dbname": "auth", "user": "postgres", "password": "acoolpassword", "host": "localhost", "port": "5432"},
    # {"dbname": "events", "user": "postgres", "password": "acoolpassword", "host": "localhost", "port": "5432"},
    # {"dbname": "projects", "user": "postgres", "password": "acoolpassword", "host": "localhost", "port": "5432"},
    # {"dbname": "public", "user": "postgres", "password": "acoolpassword", "host": "localhost", "port": "5432"},
    # {"dbname": "users", "user": "postgres", "password": "acoolpassword", "host": "localhost", "port": "5432"},
    # Add more databases as needed
]

def drop_all_tables(conn):
    with conn.cursor() as cur:
        # Get all table names from current schema
        cur.execute("""
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public';
        """)
        tables = cur.fetchall()
        
        # Drop all tables
        for table in tables:
            table_name = table[0]
            print(f"Dropping table: {table_name}")
            cur.execute(sql.SQL("DROP TABLE IF EXISTS {} CASCADE").format(sql.Identifier(table_name)))
        
        conn.commit()

for db in databases:
    print(f"\nConnecting to database: {db['dbname']}")
    try:
        conn = psycopg2.connect(**db)
        drop_all_tables(conn)
        print(f"All tables dropped from {db['dbname']}")
    except Exception as e:
        print(f"Error with database {db['dbname']}: {e}")
    finally:
        if 'conn' in locals():
            conn.close()
