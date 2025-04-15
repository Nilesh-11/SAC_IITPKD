# Stop all FastAPI service jobs

$serviceNames = @(
    "public-service",
    "auth-service",
    "api-gateway",
    "projects-service",
    "user-service",
    "events-service"
)

foreach ($name in $serviceNames) {
    $job = Get-Job -Name $name -ErrorAction SilentlyContinue
    if ($job) {
        Stop-Job -Name $name
        Remove-Job -Name $name
        Write-Host "Stopped and removed job: $name"
    } else {
        Write-Host "No job found for: $name"
    }
}
