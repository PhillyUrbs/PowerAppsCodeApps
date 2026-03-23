# CI/CD Deployment Guide

This guide explains how to set up the GitHub Actions workflow that deploys Power Apps code apps from the `apps/` folder to a Power Platform environment.

## Overview

The workflow at `.github/workflows/deploy-code-app.yml` provides:

- **Manual deployment** of any app in the `apps/` directory via GitHub Actions UI
- **Service principal authentication** (no interactive login needed)
- **Automatic app sharing** with a specified admin account
- **Caching** of npm dependencies and Power Platform CLI for faster runs

## Prerequisites

- A Power Platform environment (e.g., a Dev environment)
- An Azure AD (Entra ID) tenant with admin access
- A GitHub repository fork with Actions enabled

## Step 1: Create an Azure AD App Registration

1. Go to [Azure Portal → App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Click **+ New registration**
3. Name it (e.g., `PowerPlatformGitAccess`)
4. Click **Register**
5. Note down:
   - **Application (client) ID** → this becomes `POWER_PLATFORM_CLIENT_ID`
   - **Directory (tenant) ID** → this becomes `POWER_PLATFORM_TENANT_ID`

### Create a Client Secret

1. Go to **Certificates & secrets** → **+ New client secret**
2. Add a description and set an expiration
3. Copy the **Value** column (not the Secret ID) → this becomes `POWER_PLATFORM_CLIENT_SECRET`

> **Important:** The secret value is only shown once. If you lose it, you'll need to create a new one.

## Step 2: Configure API Permissions

Go to **API permissions** → **+ Add a permission** → **APIs my organization uses**, and add:

| API | Permission | Type |
|-----|-----------|------|
| **Dynamics CRM** | `user_impersonation` | Delegated |
| **PowerApps Service** | `User` | Delegated |
| **Power Automate** (Microsoft Flow Service) | `Flows.Read.All` | Delegated |
| **Power Automate** (Microsoft Flow Service) | `Flows.Manage.All` | Delegated |
| **PowerApps-Advisor** | `Analysis.All` | Delegated |

After adding all permissions, click **Grant admin consent for [your tenant]**.

## Step 3: Assign Entra ID Role

1. Go to [Azure Portal → Entra ID → Roles and administrators](https://portal.azure.com/#view/Microsoft_AAD_IAM/RolesManagementMenuBlade/~/AllRoles)
2. Search for **Power Platform Administrator**
3. Click it → **+ Add assignments**
4. Search for your app registration → select it → **Add**

## Step 4: Add Application User in Power Platform

1. Go to [Power Platform Admin Center](https://admin.powerplatform.microsoft.com)
2. **Environments** → select your target environment → **Settings**
3. **Users + permissions** → **Application users**
4. **+ New app user**
5. **+ Add an app** → search for your app registration → select it
6. Select your **Business unit** (typically the root)
7. **Security roles** → add **System Administrator**
8. Click **Create**

## Step 5: Register as Management App

This step is required for the service principal to call the Power Platform Business App Platform API (used by `pac code push`).

Open PowerShell and run:

```powershell
# Install the Power Apps admin module if needed
Install-Module -Name Microsoft.PowerApps.Administration.PowerShell -Force -AllowClobber

# Sign in as a tenant admin
Add-PowerAppsAccount

# Register the service principal
New-PowerAppManagementApp -ApplicationId "<your-client-id>"
```

Replace `<your-client-id>` with the Application (client) ID from Step 1.

## Step 6: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `POWER_PLATFORM_ENVIRONMENT_ID` | `1e49cfde-50fc-...` | Environment GUID from Power Platform Admin Center |
| `POWER_PLATFORM_TENANT_ID` | `xxxxxxxx-xxxx-...` | Directory (tenant) ID from Azure AD |
| `POWER_PLATFORM_CLIENT_ID` | `xxxxxxxx-xxxx-...` | Application (client) ID from Azure AD |
| `POWER_PLATFORM_CLIENT_SECRET` | `V938Q~...` | Client secret **value** (not the secret ID) |
| `POWER_PLATFORM_ADMIN_EMAIL` | `admin@contoso.onmicrosoft.com` | Email of user to share deployed apps with (optional) |

### Finding your Environment ID

1. Go to [Power Platform Admin Center](https://admin.powerplatform.microsoft.com)
2. Click **Environments** → select your environment
3. The **Environment ID** is shown in the environment details

## Step 7: Run the Workflow

1. Go to your repository → **Actions** → **Deploy Code App to Dev**
2. Click **Run workflow**
3. Enter the app folder name (e.g., `roadmap-calendar` for `apps/roadmap-calendar/`)
4. Click **Run workflow**

## Workflow Behavior

### First Deploy (New App)

1. Builds the app (`npm ci` + `npm run build`)
2. Authenticates to Power Platform via service principal
3. Runs `pac code init` to register the app
4. Runs `pac code push` to deploy the built assets
5. Shares the app with the admin email as a co-owner

### Subsequent Deploys (Update)

1. Builds the app
2. Detects the existing app via `pac code list`
3. Generates `power.config.json` with the existing `appId`
4. Runs `pac code push` to update the app
5. Shares the app (idempotent)

### Caching

The workflow caches:

- **npm dependencies** (~69 MB) — keyed on `package-lock.json`
- **Power Platform CLI** (~258 MB) — keyed on OS

Both caches require the `actions: write` permission (configured in the workflow).

## Known Limitations

> **Note:** These limitations were observed as of March 2026 with Power Platform CLI version 2.4.1. They may be resolved in future updates to the platform or CLI.

### Solution Placement

Code apps deployed via service principal (`pac code push`) are **not** automatically placed into Dataverse solutions. The `--solutionName` parameter is accepted but does not function for code apps deployed this way.

Code apps deployed via service principal exist only in the PowerApps platform API, not in the Dataverse `canvasapps` table. This means:

- `AddSolutionComponent` with component type 300 (CanvasApp) cannot find them
- They cannot be added to solutions programmatically via CI/CD

**Workaround:** After the first CI/CD deploy, manually add the app to a solution via the Power Apps portal, or use `pac code init` + `pac code push` interactively (as a user, not a service principal) which properly creates the Dataverse record.

### App Updates

When updating an existing app, the workflow detects it by display name via `pac code list` and injects the `appId` into `power.config.json`. If the app display name changes, a new app will be created instead of updating the existing one.

## Troubleshooting

### `AADSTS7000215: Invalid client secret`

You're using the **Secret ID** (a GUID) instead of the **Secret Value**. Go to Azure Portal → App registrations → Certificates & secrets, create a new secret, and copy the **Value** column.

### `The service principal does not have permission to access the path`

The management app registration is missing. Run `New-PowerAppManagementApp` as described in Step 5.

### `ApplicationDisplayNameIsInUse`

An app with the same display name already exists. The workflow handles this automatically by detecting existing apps and injecting their ID. If this still occurs, delete the duplicate app from Power Platform Admin Center.

### `Linux libsecret keyring is not available`

Expected on CI runners. The workflow uses `--accept-cleartext-caching` to handle this.

### `Environment not found`

The `POWER_PLATFORM_ENVIRONMENT_ID` secret may be incorrect, or the Power Platform Administrator role hasn't propagated yet (can take up to 30 minutes).
