<#
scripts/apply-cline-settings.ps1

Reads Cline-related environment variables and writes a minimal `.vscode/settings.json`
for the workspace containing only the keys that were present as environment variables.

Usage (local machine):
  $env:CLINE_OPENROUTER_KEY = 'sk-...'
  $env:CLINE_ANTHROPIC_KEY = 'ak-...'
  .\scripts\apply-cline-settings.ps1

This script WILL write secrets into the workspace `.vscode/settings.json` if you provide them
via environment variables. Do NOT commit those secrets to git. Prefer adding them to your
OS secure store, your personal VS Code user settings, or GitHub Codespaces secrets.
#>

Param(
    [string]$OutputSettingsPath = ".vscode\settings.json"
)

Write-Host "Applying Cline settings from environment variables..." -ForegroundColor Cyan

# Map environment variables to setting keys used by the Cline extension
$mapping = @{
    "CLINE_PROVIDER" = "cline.provider"
    "CLINE_OPENROUTER_KEY" = "cline.openRouterApiKey"
    "CLINE_ANTHROPIC_KEY" = "cline.anthropicApiKey"
    "CLINE_OPENAI_KEY" = "cline.openaiApiKey"
    "CLINE_MODEL" = "cline.model"
    "CLINE_USE_LOCAL_MODEL" = "cline.useLocalModel"
    "CLINE_PROXY_URL" = "cline.proxyUrl"
    "CLINE_AUTO_APPROVE_TERMINAL" = "cline.autoApproveTerminalCommands"
}

$settings = @{}
foreach ($envName in $mapping.Keys) {
    $value = [Environment]::GetEnvironmentVariable($envName)
    if (![string]::IsNullOrEmpty($value)) {
        $key = $mapping[$envName]
        # Convert boolean-like strings to actual booleans for known keys
        if ($envName -eq 'CLINE_USE_LOCAL_MODEL' -or $envName -eq 'CLINE_AUTO_APPROVE_TERMINAL') {
            $lower = $value.ToLower()
            if ($lower -in @('true','false')) {
                $settings[$key] = [System.Convert]::ToBoolean($lower)
            } else {
                # If user provided non-boolean, write the raw string
                $settings[$key] = $value
            }
        } else {
            $settings[$key] = $value
        }
        # Print the env var name with a leading dollar sign, e.g. "$CLINE_OPENROUTER_KEY"
        Write-Host ("Setting $key from $" + $envName) -ForegroundColor Green
    }
}

if ($settings.Count -eq 0) {
    Write-Host "No Cline-related environment variables found; nothing to write." -ForegroundColor Yellow
    exit 0
}

# Ensure .vscode dir exists
$settingsDir = Split-Path -Parent $OutputSettingsPath
if (-not (Test-Path $settingsDir)) { New-Item -ItemType Directory -Path $settingsDir -Force | Out-Null }

# If there are existing settings, merge them (do not overwrite unrelated keys)
$existing = @{}
if (Test-Path $OutputSettingsPath) {
    try {
        $existingJson = Get-Content $OutputSettingsPath -Raw -ErrorAction Stop
        $existing = ConvertFrom-Json $existingJson -ErrorAction Stop
    } catch {
        Write-Host "Warning: failed to parse existing $OutputSettingsPath - it will be replaced with merged settings." -ForegroundColor Yellow
        $existing = @{}
    }
}

# Merge settings (existing keys preserved unless overwritten by env)
foreach ($k in $settings.Keys) { $existing.$k = $settings[$k] }

# Convert back to JSON and write
$json = $existing | ConvertTo-Json -Depth 5
Set-Content -Path $OutputSettingsPath -Value $json -Encoding UTF8

Write-Host "Wrote workspace settings to $OutputSettingsPath" -ForegroundColor Green
Write-Host "IMPORTANT: Do not commit secrets. Remove the file from source control if it contains keys." -ForegroundColor Yellow

exit 0
