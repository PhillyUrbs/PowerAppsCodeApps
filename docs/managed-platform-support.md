# Managed Platform capability support
This article enumerates Power Platform management capabilities that work for code apps. 

|                                                         Capability                                    |                                                Notes                                 |
|-----------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| End-users see consent dialog for connector permissions | [Learn more](https://learn.microsoft.com/power-apps/maker/canvas-apps/add-manage-connections#consent-dialog-fine-grained-permssions)|
| Sharing limits | Code apps respect canvas app sharing limits. [Learn more](https://learn.microsoft.com/power-platform/admin/managed-environment-sharing-limits)  |
| App Quarantine | [Learn more](https://learn.microsoft.com/power-platform/admin/admin-manage-apps?tabs=new#manage-app-quarantine-state) |
| Data Loss policy enforcement during app launch | [Learn more](https://learn.microsoft.com/power-platform/admin/wp-data-loss-prevention) |
| Conditional Access on an individual app | [Learn more](https://learn.microsoft.com/power-platform/admin/admin-manage-apps?tabs=new#managed-environments-conditional-access-on-individual-apps) |
| Admin consent dialog suppression | Consent suppression is supported for both Microsoft connecters that use OAuth as well as custom connectors that use OAuth. [Learn more](https://learn.microsoft.com/power-apps/maker/canvas-apps/add-manage-connections#suppress-consent-dialog-for-apps-that-use-custom-connectors-using-microsoft-entra-id-oauth)  |
| Tenant isolation | [Learn more](https://learn.microsoft.com/power-platform/admin/cross-tenant-restrictions) |
| Azure B2B (external user access) | Code apps may be shared with and access by end-users using Azure B2B to access resources in a tenant, similar to canvas apps. [Learn more](https://learn.microsoft.com/power-apps/maker/canvas-apps/share-app-guests) |
