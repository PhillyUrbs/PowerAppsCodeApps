// Mock data for Custom API connector examples
// This file demonstrates the data structure expected from custom API connectors
// Replace this mock data with real custom connector calls in your implementation

export interface MockAsset {
  id: string;
  name: string;
  type: 'Hardware' | 'Software' | 'License' | 'Equipment';
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Retired';
  location: string;
  assignedTo?: string;
  purchaseDate: string;
  purchasePrice: number;
  vendor: string;
  warrantyExpiration?: string;
  notes?: string;
  lastUpdated: string;
}

export interface MockApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  timestamp: string;
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface MockApiError {
  error: string;
  code: number;
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Mock assets for API responses
export const mockAssets: MockAsset[] = [
  {
    id: "ASSET-001",
    name: "Dell Laptop XPS 13",
    type: "Hardware",
    status: "Active",
    location: "Seattle Office",
    assignedTo: "john.doe@company.com",
    purchaseDate: "2024-01-15",
    purchasePrice: 1299.99,
    vendor: "Dell Technologies",
    warrantyExpiration: "2027-01-15",
    notes: "Assigned to new hire in Engineering",
    lastUpdated: "2025-07-17T10:30:00Z"
  },
  {
    id: "ASSET-002",
    name: "Microsoft Office 365 License",
    type: "Software",
    status: "Active",
    location: "Cloud",
    assignedTo: "sarah.smith@company.com",
    purchaseDate: "2024-03-01",
    purchasePrice: 149.99,
    vendor: "Microsoft Corporation",
    notes: "Annual subscription",
    lastUpdated: "2025-07-17T09:15:00Z"
  },
  {
    id: "ASSET-003",
    name: "Conference Room Projector",
    type: "Equipment",
    status: "Maintenance",
    location: "Meeting Room A",
    purchaseDate: "2023-06-10",
    purchasePrice: 899.99,
    vendor: "Epson",
    warrantyExpiration: "2025-06-10",
    notes: "Scheduled for bulb replacement",
    lastUpdated: "2025-07-16T14:20:00Z"
  },
  // Generate more assets for pagination
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `ASSET-${(i + 4).toString().padStart(3, '0')}`,
    name: `Asset ${i + 4}`,
    type: ['Hardware', 'Software', 'License', 'Equipment'][i % 4] as MockAsset['type'],
    status: ['Active', 'Inactive', 'Maintenance', 'Retired'][i % 4] as MockAsset['status'],
    location: ['Seattle Office', 'New York Office', 'Remote', 'Warehouse'][i % 4],
    assignedTo: i % 3 === 0 ? `user${i + 4}@company.com` : undefined,
    purchaseDate: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    purchasePrice: Math.floor(Math.random() * 5000) + 100,
    vendor: ['Dell', 'Microsoft', 'Apple', 'HP', 'Lenovo'][i % 5],
    warrantyExpiration: i % 2 === 0 ? new Date(2026, i % 12, (i % 28) + 1).toISOString().split('T')[0] : undefined,
    notes: i % 4 === 0 ? `Notes for asset ${i + 4}` : undefined,
    lastUpdated: new Date(2025, 6, 17 - (i % 7)).toISOString()
  }))
];

// Mock API responses for different HTTP methods
export const mockApiResponses = {
  // GET /api/assets
  getAssets: (page = 1, pageSize = 10): MockApiResponse<MockAsset[]> => ({
    data: mockAssets.slice((page - 1) * pageSize, page * pageSize),
    success: true,
    message: "Assets retrieved successfully",
    timestamp: new Date().toISOString(),
    totalCount: mockAssets.length,
    page,
    pageSize
  }),

  // GET /api/assets/:id
  getAssetById: (id: string): MockApiResponse<MockAsset> | MockApiError => {
    const asset = mockAssets.find(a => a.id === id);
    if (!asset) {
      return {
        error: "Not Found",
        code: 404,
        message: `Asset with ID ${id} not found`,
        timestamp: new Date().toISOString()
      };
    }
    return {
      data: asset,
      success: true,
      message: "Asset retrieved successfully",
      timestamp: new Date().toISOString()
    };
  },

  // POST /api/assets
  createAsset: (assetData: Omit<MockAsset, 'id' | 'lastUpdated'>): MockApiResponse<MockAsset> => {
    const newId = `ASSET-${(mockAssets.length + 1).toString().padStart(3, '0')}`;
    const newAsset: MockAsset = {
      ...assetData,
      id: newId,
      lastUpdated: new Date().toISOString()
    };
    mockAssets.push(newAsset);
    return {
      data: newAsset,
      success: true,
      message: "Asset created successfully",
      timestamp: new Date().toISOString()
    };
  },

  // PUT /api/assets/:id
  updateAsset: (id: string, updates: Partial<MockAsset>): MockApiResponse<MockAsset> | MockApiError => {
    const assetIndex = mockAssets.findIndex(a => a.id === id);
    if (assetIndex === -1) {
      return {
        error: "Not Found",
        code: 404,
        message: `Asset with ID ${id} not found`,
        timestamp: new Date().toISOString()
      };
    }
    
    mockAssets[assetIndex] = {
      ...mockAssets[assetIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    return {
      data: mockAssets[assetIndex],
      success: true,
      message: "Asset updated successfully",
      timestamp: new Date().toISOString()
    };
  },

  // DELETE /api/assets/:id
  deleteAsset: (id: string): MockApiResponse<{ id: string }> | MockApiError => {
    const assetIndex = mockAssets.findIndex(a => a.id === id);
    if (assetIndex === -1) {
      return {
        error: "Not Found",
        code: 404,
        message: `Asset with ID ${id} not found`,
        timestamp: new Date().toISOString()
      };
    }
    
    mockAssets.splice(assetIndex, 1);
    return {
      data: { id },
      success: true,
      message: "Asset deleted successfully",
      timestamp: new Date().toISOString()
    };
  },

  // GET /api/assets/search?q=query
  searchAssets: (query: string): MockApiResponse<MockAsset[]> => {
    const lowercaseQuery = query.toLowerCase();
    const filteredAssets = mockAssets.filter(asset =>
      asset.name.toLowerCase().includes(lowercaseQuery) ||
      asset.type.toLowerCase().includes(lowercaseQuery) ||
      asset.vendor.toLowerCase().includes(lowercaseQuery) ||
      asset.location.toLowerCase().includes(lowercaseQuery)
    );
    
    return {
      data: filteredAssets,
      success: true,
      message: `Found ${filteredAssets.length} assets matching "${query}"`,
      timestamp: new Date().toISOString(),
      totalCount: filteredAssets.length
    };
  }
};

// Mock error responses for testing error handling
export const mockApiErrors = {
  unauthorized: (): MockApiError => ({
    error: "Unauthorized",
    code: 401,
    message: "Invalid or missing authentication token",
    timestamp: new Date().toISOString(),
    details: { requiresAuth: true }
  }),

  forbidden: (): MockApiError => ({
    error: "Forbidden",
    code: 403,
    message: "Insufficient permissions to access this resource",
    timestamp: new Date().toISOString(),
    details: { requiredPermission: "assets:read" }
  }),

  rateLimited: (): MockApiError => ({
    error: "Too Many Requests",
    code: 429,
    message: "Rate limit exceeded. Please try again later.",
    timestamp: new Date().toISOString(),
    details: { retryAfter: 60 }
  }),

  serverError: (): MockApiError => ({
    error: "Internal Server Error",
    code: 500,
    message: "An unexpected error occurred. Please try again later.",
    timestamp: new Date().toISOString(),
    details: { correlationId: "abc-123-def-456" }
  })
};

// Helper functions for API simulation
export const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const simulateRandomError = (errorRate: number = 0.1): boolean => {
  return Math.random() < errorRate;
};

// API client simulation functions
export const mockApiClient = {
  async get<T>(endpoint: string): Promise<MockApiResponse<T> | MockApiError> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      return mockApiErrors.serverError();
    }
    
    // Simulate different endpoints
    if (endpoint === '/api/assets') {
      return mockApiResponses.getAssets() as MockApiResponse<T>;
    }
    
    if (endpoint.startsWith('/api/assets/')) {
      const id = endpoint.split('/').pop();
      return mockApiResponses.getAssetById(id!) as MockApiResponse<T> | MockApiError;
    }
    
    throw new Error(`Unknown endpoint: ${endpoint}`);
  },

  async post<T>(endpoint: string, data: any): Promise<MockApiResponse<T> | MockApiError> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      return mockApiErrors.serverError();
    }
    
    if (endpoint === '/api/assets') {
      return mockApiResponses.createAsset(data) as MockApiResponse<T>;
    }
    
    throw new Error(`Unknown endpoint: ${endpoint}`);
  },

  async put<T>(endpoint: string, data: any): Promise<MockApiResponse<T> | MockApiError> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      return mockApiErrors.serverError();
    }
    
    if (endpoint.startsWith('/api/assets/')) {
      const id = endpoint.split('/').pop();
      return mockApiResponses.updateAsset(id!, data) as MockApiResponse<T> | MockApiError;
    }
    
    throw new Error(`Unknown endpoint: ${endpoint}`);
  },

  async delete<T>(endpoint: string): Promise<MockApiResponse<T> | MockApiError> {
    await simulateNetworkDelay();
    
    if (simulateRandomError()) {
      return mockApiErrors.serverError();
    }
    
    if (endpoint.startsWith('/api/assets/')) {
      const id = endpoint.split('/').pop();
      return mockApiResponses.deleteAsset(id!) as MockApiResponse<T> | MockApiError;
    }
    
    throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};
