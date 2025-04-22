# Start all FastAPI services as background jobs

function Start-ServiceJob($name, $path, $port) {
    Start-Job -Name $name -ScriptBlock {
        param($path, $port)
        cd $path
        & "$path\.venv\Scripts\Activate.ps1"
        uvicorn src.main:app --host 0.0.0.0 --port $port
    } -ArgumentList $path, $port
}

Write-Host "Starting services..."

Start-ServiceJob "public-service"   "D:\YACC\SAC_IITPKD\Backend\services\public-service"    8005
Start-ServiceJob "auth-service"     "D:\YACC\SAC_IITPKD\Backend\services\auth-service"      8001
Start-ServiceJob "api-gateway"      "D:\YACC\SAC_IITPKD\Backend\api-gateway"                8000
Start-ServiceJob "projects-service" "D:\YACC\SAC_IITPKD\Backend\services\projects-service"  8003
Start-ServiceJob "user-service"     "D:\YACC\SAC_IITPKD\Backend\services\user-service"      8004
Start-ServiceJob "events-service"   "D:\YACC\SAC_IITPKD\Backend\services\events-service"    8002

Write-Host "All services started in background jobs!"
