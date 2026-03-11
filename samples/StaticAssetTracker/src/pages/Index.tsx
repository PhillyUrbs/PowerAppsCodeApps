import { useState, useMemo } from 'react';
import { assets as initialAssets } from '@/data/assets';
import AssetCard from '@/components/AssetCard';
import AssetDetail from '@/components/AssetDetail';
import { Asset } from '@/types/asset';
import { Cpu, Bell, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { owners } from '@/data/owners';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
    <div className="min-h-screen p-2" style={{ background: 'var(--win-bg)' }}>
      {/* === Main Window === */}
      <div className="win-window max-w-7xl mx-auto">
        {/* Title Bar */}
        <div className="win-titlebar">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Cpu className="h-4 w-4 shrink-0" />
            <span className="truncate text-lg">Woodgrove Technologies - Asset Tracker</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <ThemeToggle />
            <button className="win-titlebar-btn" title="Minimize">▼</button>
            <button className="win-titlebar-btn" title="Maximize">▲</button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="flex items-center gap-0 px-1 py-0.5 border-b" style={{ borderColor: 'var(--win-dark)', background: 'var(--win-bg)' }}>
          <span className="px-2 py-0.5 hover:bg-[var(--win-highlight)] hover:text-[var(--win-highlight-text)] cursor-pointer text-sm"><u>F</u>ile</span>
          <span className="px-2 py-0.5 hover:bg-[var(--win-highlight)] hover:text-[var(--win-highlight-text)] cursor-pointer text-sm"><u>E</u>dit</span>
          <span className="px-2 py-0.5 hover:bg-[var(--win-highlight)] hover:text-[var(--win-highlight-text)] cursor-pointer text-sm"><u>V</u>iew</span>
          <span className="px-2 py-0.5 hover:bg-[var(--win-highlight)] hover:text-[var(--win-highlight-text)] cursor-pointer text-sm"><u>H</u>elp</span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-2 py-1 border-b" style={{ borderColor: 'var(--win-dark)', background: 'var(--win-bg)' }}>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="win-button text-xs flex items-center gap-1" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="h-3 w-3" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="px-1 text-[var(--win-highlight-text)]" style={{ background: 'var(--win-highlight)' }}>
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent><p>Toggle filter panel</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {activeFilterCount > 0 && (
              <button className="win-button text-xs flex items-center gap-1" onClick={clearFilters}>
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <label className="text-sm" style={{ color: 'var(--win-black)' }}>Search:</label>
            <input
              type="text"
              placeholder="Find assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="win-field w-48 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 ml-2 pl-2 border-l" style={{ borderColor: 'var(--win-dark)' }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="win-titlebar-btn" style={{ width: 24, height: 24 }}>
                    <Bell className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent><p>Notifications</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center cursor-pointer px-1" title="Alex Johnson - IT Administrator">
              <Avatar className="h-6 w-6" style={{ border: '1px solid var(--win-dark)' }}>
                <AvatarImage src="./images/avatar-aj.svg" alt="Alex Johnson" />
                <AvatarFallback className="text-xs" style={{ background: 'var(--win-bg)' }}>AJ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Filter Panel (collapsible) */}
        {showFilters && (
          <div className="p-3 border-b" style={{ borderColor: 'var(--win-dark)', background: 'var(--win-bg)' }}>
            <div className="win-groupbox">
              <span className="absolute -top-2.5 left-3 px-1 text-xs font-bold" style={{ background: 'var(--win-bg)', color: 'var(--win-black)' }}>
                Filter Options
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Status Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold" style={{ color: 'var(--win-black)' }}>Status:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="win-button w-full text-left text-xs flex justify-between items-center">
                        <span className="truncate">
                          {statusFilters.size === 3
                            ? 'All Statuses'
                            : [...statusFilters].map(s => statusLabels[s]).join(', ')}
                        </span>
                        <ChevronDown className="h-3 w-3 shrink-0 ml-1" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0 rounded-none win-window" align="start">
                      {allStatuses.map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleStatus(status)}
                          className="flex w-full items-center gap-2 px-2 py-1 text-sm hover:bg-[var(--win-highlight)] hover:text-[var(--win-highlight-text)] cursor-pointer"
                        >
                          <span className="inline-block w-4 text-center win-sunken bg-[var(--win-field)]" style={{ fontSize: 10, lineHeight: '14px', width: 14, height: 14 }}>
                            {statusFilters.has(status) ? '✓' : ''}
                          </span>
                          <span>{statusLabels[status]}</span>
                          <span className="ml-auto text-xs opacity-60">{statusCounts[status]}</span>
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Owner Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold" style={{ color: 'var(--win-black)' }}>Owner:</label>
                  <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                    <SelectTrigger className="h-7 rounded-none win-field text-xs border-0">
                      <SelectValue placeholder="All Owners" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="all">All Owners</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {owners.map(owner => (
                        <SelectItem key={owner.id} value={owner.id}>{owner.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold" style={{ color: 'var(--win-black)' }}>Type:</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-7 rounded-none win-field text-xs border-0">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold" style={{ color: 'var(--win-black)' }}>Brand:</label>
                  <Select value={brandFilter} onValueChange={(val) => { setBrandFilter(val); setModelFilter('all'); }}>
                    <SelectTrigger className="h-7 rounded-none win-field text-xs border-0">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold" style={{ color: 'var(--win-black)' }}>Model:</label>
                  <Select value={modelFilter} onValueChange={setModelFilter}>
                    <SelectTrigger className="h-7 rounded-none win-field text-xs border-0">
                      <SelectValue placeholder="All Models" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="all">All Models</SelectItem>
                      {models.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value Range */}
                <div className="space-y-1">
                  <label className="text-xs font-bold" style={{ color: 'var(--win-black)' }}>Value Range:</label>
                  <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--win-black)' }}>
                    <span>${valueRange[0].toLocaleString()}</span>
                    <span>${valueRange[1].toLocaleString()}</span>
                  </div>
                  <Slider
                    min={valueExtents.min}
                    max={valueExtents.max}
                    step={50}
                    value={valueRange}
                    onValueChange={(val) => setValueRange(val as [number, number])}
                    className="py-1"
                  />
                </div>

                {/* Purchase Date Range */}
                <div className="space-y-1">
                  <label className="text-xs font-bold" style={{ color: 'var(--win-black)' }}>Purchase Date:</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="win-field text-xs h-7 flex-1"
                    />
                    <span className="text-xs" style={{ color: 'var(--win-black)' }}>to</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="win-field text-xs h-7 flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row" style={{ background: 'var(--win-bg)' }}>
          {/* Left: Asset List */}
          <div className="lg:w-1/3 border-r" style={{ borderColor: 'var(--win-dark)' }}>
            <div className="win-sunken m-2 bg-[var(--win-field)]">
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto win-scroll">
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
                  <div className="text-center p-4 text-sm" style={{ color: 'var(--win-dark)' }}>
                    No assets match your search criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right: Asset Detail */}
          <div className="lg:w-2/3 p-2">
            {selectedAsset && (
              <AssetDetail 
                asset={selectedAsset} 
                onStatusUpdate={(newStatus) => updateAssetStatus(selectedAsset.id, newStatus)}
                onAssignOwner={(assetId, ownerId) => assignOwnerToAsset(assetId, ownerId)}
                className="win-sunken p-3"
                style={{ background: 'var(--win-field)' }}
              />
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="win-statusbar flex items-center justify-between">
          <span className="text-xs">{filteredAssets.length} asset(s) displayed</span>
          <span className="text-xs">Woodgrove Technologies © 1992</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
