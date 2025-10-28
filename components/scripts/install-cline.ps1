# scripts/install-cline.ps1
# Installs the Cline (Claude Dev) VS Code extension if missing and creates an example settings file.
# Usage: Open PowerShell in the repo root and run: .\scripts\install-cline.ps1

Write-Host 'Checking for VS Code "code" CLI...' -ForegroundColor Cyan
try {
    $codeVersion = & code --version 2>$null
} catch {
    Write-Host 'ERROR: VS Code "code" CLI not found in PATH.' -ForegroundColor Red
    Write-Host 'On Windows, add the Code binary to PATH or use the full path to code.exe (usually in "C:\\Users\\<you>\\AppData\\Local\\Programs\\Microsoft VS Code\\bin\").' -ForegroundColor Yellow
    exit 1
}
# Safely pick the first non-empty line of the code version output
$firstLine = ($codeVersion -split [System.Environment]::NewLine | Where-Object { $_ -ne '' })[0]
Write-Host "code CLI detected: $firstLine" -ForegroundColor Green

$extId = 'saoudrizwan.claude-dev'
$installed = & code --list-extensions | Select-String -Pattern $extId -SimpleMatch
if ($installed) {
    Write-Host "Extension '$extId' is already installed." -ForegroundColor Green
} else {
    Write-Host "Installing extension '$extId' from the Marketplace..." -ForegroundColor Cyan
    & code --install-extension $extId
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Installed '$extId' successfully." -ForegroundColor Green
    } else {
        Write-Host "Failed to install '$extId' (exit code $LASTEXITCODE)." -ForegroundColor Red
    }
}

# Create .vscode example settings file with placeholders (DO NOT COMMIT SECRETS)
$exampleDir = Join-Path (Get-Location) ".vscode"
if (-not (Test-Path $exampleDir)) { New-Item -ItemType Directory -Path $exampleDir -Force | Out-Null }
$exampleFile = Join-Path $exampleDir "cline.settings.example.json"
if (-not (Test-Path $exampleFile)) {
    $json = @'
{
  "cline.provider": "openrouter",
  "cline.openRouterApiKey": "REPLACE_WITH_YOUR_OPENROUTER_KEY",
  "cline.anthropicApiKey": "REPLACE_WITH_YOUR_ANTHROPIC_KEY",
  "cline.model": "claude-3.5-sonnet",
  "cline.useLocalModel": false,
  "cline.proxyUrl": "",
  "cline.autoApproveTerminalCommands": false
}
'@
    $json | Out-File -FilePath $exampleFile -Encoding UTF8 -Force
    Write-Host "Wrote example settings to $exampleFile" -ForegroundColor Green
} else {
    Write-Host "$exampleFile already exists - not overwriting." -ForegroundColor Yellow
}

Write-Host "Done. Next steps:" -ForegroundColor Cyan
Write-Host "  1) Open VS Code and review .vscode/cline.settings.example.json" -ForegroundColor Cyan
Write-Host "  2) Copy keys into your user or workspace settings (Preferences: Open Settings (JSON)) - DO NOT COMMIT SECRETS to Git." -ForegroundColor Yellow
Write-Host "  3) Open the Command Palette (Ctrl+Shift+P) and run 'Cline: Open In New Tab' to start." -ForegroundColor Cyan

exit 0
