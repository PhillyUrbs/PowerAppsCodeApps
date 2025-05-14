# Power Apps Code Apps 🚀

This repository demonstrates how to create custom web applications that run within Power Apps using the "Code App" feature. Build your own code while leveraging Power Platform's authentication, data connectivity, and lifecycle management capabilities.

## What is a Code App? ✨

Code Apps allow developers to write custom code (React, Angular, Vue, etc.) that runs seamlessly within Power Apps. This gives you:

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