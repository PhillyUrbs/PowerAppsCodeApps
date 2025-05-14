# Power Apps By Your Own Code (PABYOC) 🚀

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
git clone https://github.com/microsoft/PABYOC.git
cd PABYOC
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

### 4. Deploy to Power Apps

```bash
pac auth create --url https://orgname.crm.dynamics.com
pac code push --description "Initial deployment"
```

## Connecting to Data 🔌

Code Apps can connect to any data source supported by Power Platform:

- Dataverse
- SharePoint
- SQL Server
- Microsoft 365
- And hundreds more!

## Learn More 📚

- [Official documentation](https://learn.microsoft.com/power-apps/developer/code-app-overview)
- [Sample applications](https://github.com/microsoft/PABYOC/samples)
- [Community forum](https://powerusers.microsoft.com/t5/Developer-Forum/bd-p/PowerAppsDeveloperForum)

## Contributing 🤝

Contributions are welcome! Please see our [contribution guidelines](CONTRIBUTING.md) for details.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
