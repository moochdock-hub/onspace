# scripts/bootstrap-cline-dotfiles.ps1
# Bootstraps Cline extension + settings for a developer machine.
# Usage:
#   - Set env vars listed below (locally or in your shell) then run this script from repo root.
# Example (PowerShell):
#   $env:CLINE_OPENROUTER_KEY = 'sk-xxx'
#   $env:CLINE_MODEL = 'claude-3.5-sonnet'
#   .\scripts\bootstrap-cline-dotfiles.ps1

Write-Host 'Bootstrapping Cline extension and settings...' -ForegroundColor Cyan

# 1) Install the VS Code extension (if code CLI is available)
$extId = 'saoudrizwan.claude-dev'
$codeExists = $false
try { $null = & code --version; $codeExists = $true } catch { $codeExists = $false }

if ($codeExists) {
    Write-Host "Installing VS Code extension $extId (if not present)..." -ForegroundColor Cyan
    $installed = & code --list-extensions | Select-String -Pattern $extId -SimpleMatch
    if ($installed) {
        Write-Host "$extId already installed." -ForegroundColor Green
    } else {
        & code --install-extension $extId
        if ($LASTEXITCODE -eq 0) { Write-Host "$extId installed." -ForegroundColor Green } else { Write-Host "Failed to install $extId (exit $LASTEXITCODE)" -ForegroundColor Red }
    }
} else {
    Write-Host 'VS Code "code" CLI not found; skipping extension install. You can install manually:' -ForegroundColor Yellow
    Write-Host "  code --install-extension $extId" -ForegroundColor Yellow
}

# 2) Apply settings from environment variables
$applyScript = Join-Path (Get-Location) 'scripts\apply-cline-settings.ps1'
if (Test-Path $applyScript) {
    Write-Host 'Applying settings from environment variables...' -ForegroundColor Cyan
    & $applyScript
} else {
    Write-Host "Missing $applyScript - cannot apply settings." -ForegroundColor Red
}

Write-Host 'Bootstrap complete.' -ForegroundColor Cyan
exit 0
