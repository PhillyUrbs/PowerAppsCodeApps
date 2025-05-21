# Power Apps code apps 🚀

Power Apps aims to empower developers of all skillsets, including developers building web apps in IDEs like Visual Studio Code, to efficiently build and run business apps in a managed platform. Code apps is a new way for developers to bring Power Apps capabilities in web apps they’re building in an code first IDE. These capabilities are available during local development and when an app runs in Power Platform. Power Apps capabilities available to code apps includes out-of-box Microsoft Entra authentication and authorization, access to 1,500+ Power Platform connectors which can be called directly from JavaScript. Code apps make it so any developer with a command line can publish and host their line of business web app in Power Platform. Also, code apps respect your organization’s Managed Platform policies like app sharing limits, Conditional access policies and Data Loss Prevention. Code apps and the managed platform reinforces accelerated innovation in safe places and, when ready, these apps can be deployed to dedicated production environments. 

## What is a Code App? ✨

Code Apps allow developers to write custom code (React, Angular, Vue, etc.) that runs seamlessly within Power Platform. This gives you:

- **Full control over your UI and logic** 💻
- **Access to Power Platform data sources** 📊
- **Enterprise-grade authentication** 🔐
- **Simplified deployment and ALM** 🔄

## Prerequisites 📋

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) (LTS version)
- [Git](https://git-scm.com/)
- [Power Apps CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)

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

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
