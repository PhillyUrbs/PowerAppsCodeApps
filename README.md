# Power Apps code apps (early access preview) 🚀

Power Apps aims to empower developers of all skillsets, including developers building web apps in IDEs like Visual Studio Code, to efficiently build and run business apps in a managed platform. Code apps is a new way for developers to bring Power Apps capabilities in web apps they’re building in an code first IDE. These capabilities are available during local development and when an app runs in Power Platform. Power Apps capabilities available to code apps includes out-of-box Microsoft Entra authentication and authorization, access to 1,500+ Power Platform connectors which can be called directly from JavaScript. Code apps make it so any developer with a command line can publish and host their line of business web app in Power Platform. Also, code apps respect your organization’s Managed Platform policies like app sharing limits, Conditional access policies and Data Loss Prevention. Code apps and the managed platform reinforces accelerated innovation in safe places and, when ready, these apps can be deployed to dedicated production environments. 

## What is a code app? ✨

Code apps allow developers to write custom code (React, Angular, Vue, etc.) that runs seamlessly within Power Platform. This gives you:

- **Full control over your UI and logic** 💻
- **Access to Power Platform data sources** 📊
- **Enterprise-grade authentication** 🔐
- **Simplified deployment and ALM** 🔄

## Prerequisites 📋
Code apps require several developer tools like Visual Studio Code, git, dotnet, node.js, and npm to be available on the command line.  

### Install the following developer tools
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) (LTS version)
- [Git](https://git-scm.com/)
- [Power Apps CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)

### Create a first release Power Platform environment
First release environments are intended for non-production use and they receive Power Platform updates before other environments. For code apps EAP, it's recommended that you use a first release environment. Code app capabilities will eventually be available to all environments. Code apps require dataverse to exist in the environment.  

> [!IMPORTANT] Early access preview participants must inform Microsoft of the first release environment you want code apps enabled.

#### Option 1 – Create a first release environment using Power Platform Admin Center 
If you create an environment in the admin center, be sure to toggle ‘Get new features early’ to ‘Yes’. [Learn more](https://learn.microsoft.com/power-platform/admin/create-environment). 

#### Option 2 - Create a first release environment using command line 
If you create an environment using command line, be sure to set LocationName to “unitedstatesfirstrelease”. [Learn more](https://learn.microsoft.com/power-platform/admin/powerapps-powershell) 

```PowerShell 
New-AdminPowerAppEnvironment -DisplayName "Code App env" -EnvironmentSku Trial -LocationName "unitedstatesfirstrelease" -ProvisionDatabase 
```

## Getting Started 🚀

### 1. Clone this repository

```bash
git clone https://github.com/microsoft/PowerAppsCodeApps.git
cd PowerAppsCodeApps
```

### 2. Install dependencies

```bash
npm install
pac auth create 
pac code init
```

### 3. Run locally

```bash
npm run dev | pac code run
```

### 4. Deploy to Power Apps

```bash
pac code push 
```

## Connecting to Data 🔌

todo: add connection and add-data minimum scenario/info

## Preview disclaimer 
Preview features are features that aren’t complete but are made available on a “preview” basis so customers can get early access and provide feedback. Preview features are not supported by Microsoft Support, may have limited or restricted functionality, aren’t meant for production use, and may be available only in selected geographic areas.  

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
