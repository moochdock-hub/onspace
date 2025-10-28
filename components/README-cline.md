# Cline — install & configuration (quick reference)

This file contains quick, copy-pasteable steps to install, configure and launch the Cline (Claude Dev) VS Code extension, plus a small bootstrap script included at `scripts/install-cline.ps1`.

---

## 1) Install via CLI (PowerShell)

Open PowerShell at the repository root and run:

```powershell
# Installs the extension if missing and creates an example settings file
.\scripts\install-cline.ps1
```

Or install directly:

```powershell
code --install-extension saoudrizwan.claude-dev
```

Verify installation:

```powershell
code --list-extensions | Select-String 'saoudrizwan.claude-dev'
```

---

## 2) Example settings (DO NOT COMMIT SECRETS)

An example settings file was created at `.vscode/cline.settings.example.json`. Copy relevant keys into your user or workspace settings. Example keys you may need to set:

- `cline.provider` — e.g. `openrouter`, `anthropic`, `openai`
- `cline.openRouterApiKey` — OpenRouter API key
- `cline.anthropicApiKey` — Anthropic API key
- `cline.model` — model id (e.g. `claude-3.5-sonnet`)
- `cline.useLocalModel` — boolean
- `cline.proxyUrl` — optional proxy for API requests
- `cline.autoApproveTerminalCommands` — boolean (default `false` for safety)

Add your secrets to your *user* settings or a secure location like the OS keyring — do not commit them to source control.

To open user settings JSON in VS Code: Ctrl+Shift+P → `Preferences: Open Settings (JSON)`.

Example (paste to your settings JSON, replacing placeholders):

```json
{
  "cline.provider": "openrouter",
  "cline.openRouterApiKey": "sk-xxxx",
  "cline.model": "claude-3.5-sonnet"
}
```

---

## 3) Launching Cline

- Open Command Palette (Ctrl+Shift+P) → type `Cline: Open In New Tab` or `Cline: Open`.
- The extension UI will ask for permission to read files and run terminal commands. Approve actions you trust.
- Use the built-in UI to type a task, add `@file` / `@folder` / `@url` context tokens, and approve edits before they're applied.

---

## 4) Devcontainer / Codespaces

`/.devcontainer/devcontainer.json` in this repo includes the Cline extension in `customizations.vscode.extensions`, so Codespaces or a devcontainer will automatically install the extension for you.

---

## 5) Automation / bootstrap

- Add `scripts/install-cline.ps1` to your machine-setup script or dotfiles.
- For CI or reproducible environments, add the extension id `saoudrizwan.claude-dev` to your devcontainer or Codespaces config (already added here).

---

## 6) Security notes

- Never store API keys in repositories. Use environment variables, the OS secure store, or secret managers.
- Keep `cline.autoApproveTerminalCommands` set to `false` unless you understand and trust automated commands.

---

If you'd like, I can:

- Add an example GitHub Actions workflow that sets up the extension in Codespaces for new contributors.
- Add a small helper that writes settings from environment variables for CI (no secrets committed).
- Walk you through setting a specific provider (OpenRouter/Anthropic) with the exact setting names used by the extension README.

Tell me which of these you'd like next.