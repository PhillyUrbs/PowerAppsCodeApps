# System configuration

This article contains information on the configuration for Power Apps code apps.

## Hosted app assets
When a code app is published to Power Platform (e.g. when using pac code push) app assets are hosted on a publicly accessible endpoint. Sensitive user or organizational data should not be stored in the app and they should be stored in a data source so the content is retrieved after end-users playing the app go through authentication and authorization checks. 
