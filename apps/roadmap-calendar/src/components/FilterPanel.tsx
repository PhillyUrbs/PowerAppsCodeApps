import { useState, useMemo } from 'react';
import {
  Checkbox,
  Input,
  Text,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  Button,
  tokens,
} from '@fluentui/react-components';
import { SearchRegular, FilterRegular, FilterDismissRegular } from '@fluentui/react-icons';
import type { FilterState, DataSource } from '../types/index.ts';
import { RING_COLORS } from '../types/index.ts';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableRings: string[];
  availableProducts: string[];
  availableCloudInstances: string[];
  availableProductCategories: string[];
}

export function FilterPanel({
  filters,
  onFiltersChange,
  availableRings,
  availableProducts,
  availableCloudInstances,
  availableProductCategories,
}: FilterPanelProps) {
  const [productSearch, setProductSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = availableProducts;
    if (productSearch) {
      const q = productSearch.toLowerCase();
      list = list.filter((p) => p.toLowerCase().includes(q));
    }
    // Selected items first, then alphabetical within each group
    return [...list].sort((a, b) => {
      const aSelected = filters.products.includes(a) ? 0 : 1;
      const bSelected = filters.products.includes(b) ? 0 : 1;
      if (aSelected !== bSelected) return aSelected - bSelected;
      return a.localeCompare(b);
    });
  }, [availableProducts, productSearch, filters.products]);

  const toggleSource = (source: DataSource) => {
    const sources = filters.sources.includes(source)
      ? filters.sources.filter((s) => s !== source)
      : [...filters.sources, source];
    onFiltersChange({ ...filters, sources });
  };

  const toggleArrayFilter = (key: 'rings' | 'products' | 'cloudInstances' | 'productCategories', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  return (
    <div style={{
      width: collapsed ? '40px' : '260px',
      transition: 'width 0.2s ease',
      borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
      flexShrink: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? `${tokens.spacingVerticalM} 0` : tokens.spacingVerticalM,
      }}>
        {!collapsed && (
          <Text weight="semibold" size={400}>
            Filters
          </Text>
        )}
        <Button
          appearance="subtle"
          icon={collapsed ? <FilterRegular /> : <FilterDismissRegular />}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Show filters' : 'Hide filters'}
          size="small"
        />
      </div>
      {!collapsed && (
      <div style={{ padding: `0 ${tokens.spacingVerticalM} ${tokens.spacingVerticalM}`, overflowY: 'auto', flex: 1 }}>

      <Input
        placeholder="Search features..."
        contentBefore={<SearchRegular />}
        value={filters.search}
        onChange={(_e, data) => onFiltersChange({ ...filters, search: data.value })}
        style={{ width: '100%', marginBottom: tokens.spacingVerticalM }}
      />

      <Accordion multiple defaultOpenItems={['source', 'rings']}>
        <AccordionItem value="source">
          <AccordionHeader>Source</AccordionHeader>
          <AccordionPanel>
            <Checkbox
              label="M365"
              checked={filters.sources.includes('M365')}
              onChange={() => toggleSource('M365')}
            />
            <Checkbox
              label="Azure"
              checked={filters.sources.includes('Azure')}
              onChange={() => toggleSource('Azure')}
            />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="rings">
          <AccordionHeader>Ring / Status</AccordionHeader>
          <AccordionPanel>
            {availableRings.map((ring) => (
              <Checkbox
                key={ring}
                label={
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: RING_COLORS[ring] ?? tokens.colorBrandBackground,
                        display: 'inline-block',
                      }}
                    />
                    {ring}
                  </span>
                }
                checked={filters.rings.includes(ring)}
                onChange={() => toggleArrayFilter('rings', ring)}
              />
            ))}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="products">
          <AccordionHeader>Products ({availableProducts.length})</AccordionHeader>
          <AccordionPanel>
            <Input
              placeholder="Filter products..."
              size="medium"
              value={productSearch}
              onChange={(_e, data) => setProductSearch(data.value)}
              style={{ width: '100%', marginBottom: tokens.spacingVerticalXS }}
            />
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredProducts.map((product) => (
                <Checkbox
                  key={product}
                  label={product}
                  checked={filters.products.includes(product)}
                  onChange={() => toggleArrayFilter('products', product)}
                  size="medium"
                />
              ))}
            </div>
          </AccordionPanel>
        </AccordionItem>

        {availableCloudInstances.length > 0 && (
          <AccordionItem value="cloudInstances">
            <AccordionHeader>Cloud Instance (M365)</AccordionHeader>
            <AccordionPanel>
              {availableCloudInstances.map((ci) => (
                <Checkbox
                  key={ci}
                  label={ci}
                  checked={filters.cloudInstances.includes(ci)}
                  onChange={() => toggleArrayFilter('cloudInstances', ci)}
                  size="medium"
                />
              ))}
            </AccordionPanel>
          </AccordionItem>
        )}

        {availableProductCategories.length > 0 && (
          <AccordionItem value="productCategories">
            <AccordionHeader>Category (Azure)</AccordionHeader>
            <AccordionPanel>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {availableProductCategories.map((cat) => (
                  <Checkbox
                    key={cat}
                    label={cat}
                    checked={filters.productCategories.includes(cat)}
                    onChange={() => toggleArrayFilter('productCategories', cat)}
                    size="medium"
                  />
                ))}
              </div>
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
      </div>
      )}
    </div>
  );
}
