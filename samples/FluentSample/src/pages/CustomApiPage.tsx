import { Text, Card, makeStyles, shorthands, tokens, Button, Input, Badge, Textarea, Dropdown, Option } from '@fluentui/react-components';
import { CloudRegular, SendRegular, CopyRegular } from '@fluentui/react-icons';
import PageHeader from '../components/PageHeader';
import { mockAssets } from '../mockData/customApiData';
import { useState } from 'react';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '16px',
  },
  apiTester: {
    ...shorthands.padding('24px'),
    marginBottom: '24px',
  },
  formRow: {
    display: 'flex',
    ...shorthands.gap('16px'),
    marginBottom: '16px',
    alignItems: 'flex-end',
  },
  methodSelect: {
    minWidth: '120px',
  },
  urlInput: {
    flex: 1,
  },
  sendButton: {
    minWidth: '100px',
  },
  requestBody: {
    marginBottom: '16px',
  },
  responseContainer: {
    marginTop: '16px',
  },
  responseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  responseContent: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontFamily: 'monospace',
    fontSize: tokens.fontSizeBase200,
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  assetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    ...shorthands.gap('16px'),
  },
  assetCard: {
    ...shorthands.padding('16px'),
    height: 'fit-content',
  },
  assetName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  assetDetails: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  assetField: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  statusBadge: {
    marginTop: '8px',
  },
  mockDataBadge: {
    marginBottom: '16px',
  },
  examplesList: {
    listStyle: 'none',
    ...shorthands.padding(0),
    ...shorthands.margin(0),
  },
  exampleItem: {
    ...shorthands.padding('12px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  httpMethod: {
    fontWeight: tokens.fontWeightSemibold,
    marginRight: '12px',
  },
});

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

const API_EXAMPLES = [
  { method: 'GET', url: '/api/assets', description: 'Get all assets' },
  { method: 'GET', url: '/api/assets/ASSET-001', description: 'Get specific asset' },
  { method: 'POST', url: '/api/assets', description: 'Create new asset' },
  { method: 'PUT', url: '/api/assets/ASSET-001', description: 'Update asset' },
  { method: 'DELETE', url: '/api/assets/ASSET-001', description: 'Delete asset' },
];

export default function CustomApiPage() {
  const styles = useStyles();
  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [apiUrl, setApiUrl] = useState('/api/assets');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Maintenance': return 'warning';
      case 'Inactive': case 'Retired': return 'danger';
      default: return 'subtle';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'success';
      case 'POST': return 'brand';
      case 'PUT': return 'warning';
      case 'DELETE': return 'danger';
      case 'PATCH': return 'important';
      default: return 'subtle';
    }
  };

  const simulateApiCall = async () => {
    setIsLoading(true);
    setResponse('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let mockResponse;

    try {
      if (apiUrl.includes('/api/assets')) {
        if (selectedMethod === 'GET') {
          if (apiUrl.includes('ASSET-')) {
            // Get single asset
            const assetId = apiUrl.split('/').pop();
            const asset = mockAssets.find(a => a.id === assetId);
            mockResponse = asset 
              ? { data: asset, success: true, message: 'Asset retrieved successfully', timestamp: new Date().toISOString() }
              : { error: 'Asset not found', code: 404, message: 'Asset with the specified ID was not found', timestamp: new Date().toISOString() };
          } else {
            // Get all assets
            mockResponse = {
              data: mockAssets.slice(0, 10),
              success: true,
              message: 'Assets retrieved successfully',
              timestamp: new Date().toISOString(),
              totalCount: mockAssets.length,
              page: 1,
              pageSize: 10
            };
          }
        } else if (selectedMethod === 'POST') {
          mockResponse = {
            data: { id: 'ASSET-' + Math.random().toString(36).substr(2, 3).toUpperCase(), ...JSON.parse(requestBody || '{}') },
            success: true,
            message: 'Asset created successfully',
            timestamp: new Date().toISOString()
          };
        } else if (selectedMethod === 'PUT') {
          mockResponse = {
            data: { id: apiUrl.split('/').pop(), ...JSON.parse(requestBody || '{}'), lastUpdated: new Date().toISOString() },
            success: true,
            message: 'Asset updated successfully',
            timestamp: new Date().toISOString()
          };
        } else if (selectedMethod === 'DELETE') {
          mockResponse = {
            data: null,
            success: true,
            message: 'Asset deleted successfully',
            timestamp: new Date().toISOString()
          };
        }
      } else {
        mockResponse = {
          error: 'Endpoint not found',
          code: 404,
          message: 'The requested API endpoint was not found',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      mockResponse = {
        error: 'Invalid JSON',
        code: 400,
        message: 'Request body contains invalid JSON',
        timestamp: new Date().toISOString(),
        details: { originalError: error }
      };
    }

    setResponse(JSON.stringify(mockResponse, null, 2));
    setIsLoading(false);
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
    }
  };

  const loadExample = (example: typeof API_EXAMPLES[0]) => {
    setSelectedMethod(example.method);
    setApiUrl(example.url);
    
    if (example.method === 'POST') {
      setRequestBody(JSON.stringify({
        name: "New Asset",
        type: "Hardware",
        status: "Active",
        location: "Office",
        purchaseDate: new Date().toISOString().split('T')[0],
        purchasePrice: 999.99,
        vendor: "Example Vendor"
      }, null, 2));
    } else if (example.method === 'PUT') {
      setRequestBody(JSON.stringify({
        name: "Updated Asset Name",
        status: "Maintenance",
        notes: "Updated via API"
      }, null, 2));
    } else {
      setRequestBody('');
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Custom API Connector Example"
        subtitle="This page demonstrates custom API connector patterns with REST API calls, HTTP methods, error handling, and response parsing using comprehensive mock data."
        icon={<CloudRegular />}
      />

      <Badge className={styles.mockDataBadge} appearance="tint" color="brand">
        🎭 Using Mock Data - Replace with real API connectors
      </Badge>

      {/* API Tester Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>🔧 API Testing Interface</h3>
        
        <Card className={styles.apiTester}>
          <div className={styles.formRow}>
            <Dropdown
              className={styles.methodSelect}
              placeholder="Method"
              value={selectedMethod}
              onOptionSelect={(_, data) => setSelectedMethod(data.optionValue as string)}
            >
              {HTTP_METHODS.map((method) => (
                <Option key={method} text={method} value={method}>
                  <Badge appearance="tint" color={getMethodColor(method)}>{method}</Badge>
                </Option>
              ))}
            </Dropdown>
            
            <Input
              className={styles.urlInput}
              placeholder="API Endpoint URL"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
            
            <Button
              className={styles.sendButton}
              appearance="primary"
              icon={<SendRegular />}
              onClick={simulateApiCall}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>

          {(selectedMethod === 'POST' || selectedMethod === 'PUT' || selectedMethod === 'PATCH') && (
            <div className={styles.requestBody}>
              <Text weight="semibold" style={{ display: 'block', marginBottom: '8px' }}>
                Request Body (JSON)
              </Text>
              <Textarea
                resize="vertical"
                placeholder="Enter JSON request body..."
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={6}
              />
            </div>
          )}

          {response && (
            <div className={styles.responseContainer}>
              <div className={styles.responseHeader}>
                <Text weight="semibold">Response</Text>
                <Button
                  size="small"
                  icon={<CopyRegular />}
                  onClick={copyResponse}
                  title="Copy response"
                />
              </div>
              <div className={styles.responseContent}>
                {response}
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* API Examples */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>📋 API Examples</h3>
        
        <Card style={{ padding: '16px' }}>
          <Text style={{ marginBottom: '16px', display: 'block', color: tokens.colorNeutralForeground2 }}>
            Click on any example below to load it into the API tester above:
          </Text>
          
          <ul className={styles.examplesList}>
            {API_EXAMPLES.map((example, index) => (
              <li
                key={index}
                className={styles.exampleItem}
                onClick={() => loadExample(example)}
              >
                <span className={styles.httpMethod}>
                  <Badge appearance="tint" color={getMethodColor(example.method)}>
                    {example.method}
                  </Badge>
                </span>
                <code>{example.url}</code> - {example.description}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Sample Data */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>📦 Sample Assets Data</h3>
        
        <div className={styles.assetsGrid}>
          {mockAssets.slice(0, 6).map((asset) => (
            <Card key={asset.id} className={styles.assetCard}>
              <div className={styles.assetName}>{asset.name}</div>
              <div className={styles.assetDetails}>
                <div className={styles.assetField}>
                  <Text>ID:</Text>
                  <code>{asset.id}</code>
                </div>
                <div className={styles.assetField}>
                  <Text>Type:</Text>
                  <Text>{asset.type}</Text>
                </div>
                <div className={styles.assetField}>
                  <Text>Location:</Text>
                  <Text>{asset.location}</Text>
                </div>
                <div className={styles.assetField}>
                  <Text>Vendor:</Text>
                  <Text>{asset.vendor}</Text>
                </div>
                <div className={styles.assetField}>
                  <Text>Price:</Text>
                  <Text>${asset.purchasePrice.toLocaleString()}</Text>
                </div>
                <Badge className={styles.statusBadge} appearance="filled" color={getStatusColor(asset.status)}>
                  {asset.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
        
        <Text style={{ marginTop: '16px', color: tokens.colorNeutralForeground2, textAlign: 'center', display: 'block' }}>
          Showing 6 of {mockAssets.length} assets. Use the API tester to retrieve more data.
        </Text>
      </section>

      {/* Integration Note */}
      <Card style={{ padding: '24px', backgroundColor: tokens.colorNeutralBackground2, marginTop: '32px' }}>
        <Text weight="semibold" style={{ display: 'block', marginBottom: '12px', color: tokens.colorNeutralForeground1 }}>
          🔗 Integration Points
        </Text>
        <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300 }}>
          To connect real APIs, replace the mock simulation with actual HTTP calls using fetch, axios, or Power Apps connectors. 
          Key integration points: Authentication, error handling, request/response transformation, and real-time data updates. 
          The API tester interface demonstrates common REST patterns you'll use with real services.
        </Text>
      </Card>
    </div>
  );
}
