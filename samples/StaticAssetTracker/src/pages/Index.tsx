import { useState, useMemo } from 'react';
import { assets as initialAssets } from '@/data/assets';
import AssetCard from '@/components/AssetCard';
import AssetDetail from '@/components/AssetDetail';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Asset } from '@/types/asset';
import { Cpu, Bell, SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { owners } from '@/data/owners';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<Set<Asset['status']>>(new Set(['in-use', 'in-repair', 'available']));

  const allStatuses: Asset['status'][] = ['available', 'in-use', 'in-repair'];
  const statusLabels: Record<Asset['status'], string> = {
    'available': 'Available',
    'in-use': 'In Use',
    'in-repair': 'In Repair'
  };

  const toggleStatus = (status: Asset['status']) => {
    setStatusFilters(prev => {
      const next = new Set(prev);
      if (next.has(status)) {
        if (next.size > 1) next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };
  const [showFilters, setShowFilters] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');
  // Compute global min/max asset values for the slider bounds
  const valueExtents = useMemo(() => {
    const values = assets.map(a => a.value);
    return { min: Math.floor(Math.min(...values)), max: Math.ceil(Math.max(...values)) };
  }, [assets]);
  const [valueRange, setValueRange] = useState<[number, number]>([valueExtents.min, valueExtents.max]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Derive unique values for filter dropdowns
  const brands = useMemo(() => [...new Set(assets.map(a => a.brand))].sort(), [assets]);
  const types = useMemo(() => [...new Set(assets.map(a => a.type))].sort(), [assets]);
  const models = useMemo(() => {
    const filtered = brandFilter !== 'all' ? assets.filter(a => a.brand === brandFilter) : assets;
    return [...new Set(filtered.map(a => a.model))].sort();
  }, [assets, brandFilter]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (brandFilter !== 'all') count++;
    if (modelFilter !== 'all') count++;
    if (valueRange[0] !== valueExtents.min || valueRange[1] !== valueExtents.max) count++;
    if (dateFrom || dateTo) count++;
    if (ownerFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    if (statusFilters.size < 3) count++;
    return count;
  }, [brandFilter, modelFilter, valueRange, valueExtents, dateFrom, dateTo, ownerFilter, typeFilter, statusFilters]);

  const clearFilters = () => {
    setBrandFilter('all');
    setModelFilter('all');
    setValueRange([valueExtents.min, valueExtents.max]);
    setDateFrom('');
    setDateTo('');
    setOwnerFilter('all');
    setTypeFilter('all');
    setStatusFilters(new Set(['in-use', 'in-repair', 'available']));
  };

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    const counts = {
      all: assets.length,
      'in-use': 0,
      'in-repair': 0,
      'available': 0
    };
    
    assets.forEach(asset => {
      counts[asset.status] += 1;
    });
    
    return counts;
  }, [assets]);

  // Update asset status
  const updateAssetStatus = (assetId: string, newStatus: Asset['status']) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId 
          ? { ...asset, status: newStatus } 
          : asset
      )
    );
  };

  // Assign owner to asset
  const assignOwnerToAsset = (assetId: string, ownerId: string) => {
    // Find the owner from the owners data
    const owner = owners.find((owner) => owner.id === ownerId);
    
    if (owner) {
      setAssets(prevAssets => 
        prevAssets.map(asset => 
          asset.id === assetId 
            ? { ...asset, owner } 
            : asset
        )
      );
    }
  };

  // Filter assets based on search query, status filter, and advanced filters
  const filteredAssets = useMemo(() => {
    return assets
      .filter(asset => {
        // Filter by search query (name or type)
        const matchesSearch = 
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.type.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Filter by status
        const matchesStatus = statusFilters.has(asset.status);

        // Filter by brand
        const matchesBrand = brandFilter === 'all' || asset.brand === brandFilter;

        // Filter by model
        const matchesModel = modelFilter === 'all' || asset.model === modelFilter;

        // Filter by value range
        const matchesValue = asset.value >= valueRange[0] && asset.value <= valueRange[1];

        // Filter by purchase date range
        const matchesDate = 
          (!dateFrom || asset.purchaseDate >= dateFrom) &&
          (!dateTo || asset.purchaseDate <= dateTo);

        // Filter by owner
        const matchesOwner = ownerFilter === 'all' ||
          (ownerFilter === 'unassigned' ? !asset.owner : asset.owner?.id === ownerFilter);

        // Filter by type
        const matchesType = typeFilter === 'all' || asset.type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesBrand && matchesModel && matchesValue && matchesDate && matchesOwner && matchesType;
      })
      .sort((a, b) => {
        // Sort by status: 'available', 'in-repair', 'in-use'
        const statusOrder = {
          'available': 1,
          'in-repair': 2,
          'in-use': 3
        };
        
        return statusOrder[a.status] - statusOrder[b.status];
      });
  }, [searchQuery, statusFilters, assets, brandFilter, modelFilter, valueRange, dateFrom, dateTo, ownerFilter, typeFilter]);

  // If the selected asset is not in filtered results, select the first one
  useMemo(() => {
    if (filteredAssets.length > 0 && !filteredAssets.some(asset => asset.id === selectedAssetId)) {
      setSelectedAssetId(filteredAssets[0].id);
    }
  }, [filteredAssets, selectedAssetId]);

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

  return (
    <div className="min-h-screen bg-white">
      <div className="py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
              <Cpu className="h-8 w-8" /> Woodgrove Technologies
            </h1>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="rounded-md bg-white">
                      <Bell className="h-8 w-8 text-gray-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Card className="px-4 py-2 flex items-center space-x-3 shadow-sm rounded-lg border-0 hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer">
                <div className="text-right mr-2">
                  <p className="font-medium">Alex Johnson</p>
                  <p className="text-sm text-gray-500">IT Administrator</p>
                </div>
                <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                  <AvatarImage src="./images/avatar-aj.svg" alt="Alex Johnson" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Unified card containing all components */}
        <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
          {/* Asset Tracker Header */}
          <div className="p-4 border-b bg-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-green-800">Asset Tracker</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-8 gap-1.5 text-sm border-green-200 hover:bg-green-50"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 bg-green-600 text-white text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-gray-500 hover:text-gray-700">
                    <X className="h-3 w-3 mr-1" /> Clear
                  </Button>
                )}
              </div>
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 border-green-200 focus-visible:ring-green-500"
              />
            </div>
          </div>
          {showFilters && (
            <div className="p-4 border-b bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status Filter (multi-select) */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Status</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-9 w-full justify-between font-normal">
                        <span className="truncate">
                          {statusFilters.size === 3
                            ? 'All Statuses'
                            : [...statusFilters].map(s => statusLabels[s]).join(', ')}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-1" align="start">
                      {allStatuses.map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleStatus(status)}
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                        >
                          <div className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                            statusFilters.has(status) ? 'bg-primary border-primary text-primary-foreground' : 'border-gray-300'
                          }`}>
                            {statusFilters.has(status) && <Check className="h-3 w-3" />}
                          </div>
                          <span>{statusLabels[status]}</span>
                          <span className="ml-auto text-xs text-gray-400">{statusCounts[status]}</span>
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Owner Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Owner</Label>
                  <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Owners" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Owners</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {owners.map(owner => (
                        <SelectItem key={owner.id} value={owner.id}>{owner.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Brand</Label>
                  <Select value={brandFilter} onValueChange={(val) => { setBrandFilter(val); setModelFilter('all'); }}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model Filter */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Model</Label>
                  <Select value={modelFilter} onValueChange={setModelFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Models" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Models</SelectItem>
                      {models.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value Range */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Value Range</Label>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>${valueRange[0].toLocaleString()}</span>
                    <span>${valueRange[1].toLocaleString()}</span>
                  </div>
                  <Slider
                    min={valueExtents.min}
                    max={valueExtents.max}
                    step={50}
                    value={valueRange}
                    onValueChange={(val) => setValueRange(val as [number, number])}
                    className="py-2"
                  />
                </div>

                {/* Purchase Date Range */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Purchase Date</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="h-9"
                    />
                    <span className="text-gray-400 text-sm">–</span>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content area with search, asset cards and details */}
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                {/* Asset Cards */}
                <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <AssetCard
                        key={asset.id}
                        asset={asset}
                        isSelected={asset.id === selectedAssetId}
                        onClick={() => setSelectedAssetId(asset.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-white/80">
                      <p className="text-gray-500">No assets match your search criteria</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-2">
                {selectedAsset && (
                  <AssetDetail 
                    asset={selectedAsset} 
                    onStatusUpdate={(newStatus) => updateAssetStatus(selectedAsset.id, newStatus)}
                    onAssignOwner={(assetId, ownerId) => assignOwnerToAsset(assetId, ownerId)}
                    className="bg-white backdrop-blur-sm rounded-xl border border-gray-100" 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
