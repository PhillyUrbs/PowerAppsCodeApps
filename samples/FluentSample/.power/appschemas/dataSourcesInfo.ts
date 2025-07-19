/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * This file is auto-generated. Do not modify it manually.
 * Changes to this file may be overwritten.
 */

export const dataSourcesInfo = {
  "asset-20management-20test-20api-5f39671246a0d64-c6fc231539dd189f": {
    "tableId": "",
    "version": "",
    "primaryKey": "",
    "dataSourceType": "Connector",
    "apis": {
      "GetAssets": {
        "path": "/{connectionId}/GetAssets",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array",
            "format": null
          },
          "500": {
            "type": "object",
            "format": null
          }
        }
      }
    }
  },
  "projects": {
    "tableId": "Projects",
    "version": "v2",
    "primaryKey": "ProjectId",
    "dataSourceType": "Connector",
    "apis": {}
  }
};