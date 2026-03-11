import { Asset } from '@/types/asset';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onClick: () => void;
}

const AssetCard = ({ asset, isSelected, onClick }: AssetCardProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-2 py-1.5 cursor-pointer border-b text-sm',
        isSelected 
          ? 'win-selected' 
          : 'hover:bg-[var(--win-highlight)] hover:text-[var(--win-highlight-text)]'
      )}
      style={{ borderColor: 'var(--win-bg)' }}
      onClick={onClick}
    >
      <Avatar className="h-8 w-8 shrink-0" style={{ border: '1px solid var(--win-dark)' }}>
        <AvatarImage src={asset.image} alt={asset.name} />
        <AvatarFallback className="text-xs" style={{ background: 'var(--win-bg)' }}>
          {asset.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-bold truncate">{asset.name}</div>
        <div className="text-xs opacity-75 truncate">{asset.type} · {asset.deviceId}</div>
      </div>
      <div
        className={cn(
          'text-xs px-1.5 py-0.5 shrink-0',
          !isSelected && 'win-raised',
          isSelected && 'font-bold'
        )}
        style={!isSelected ? { 
          background: asset.status === 'available' ? '#00aa00' : asset.status === 'in-repair' ? '#aaaa00' : 'var(--win-bg)',
          color: asset.status === 'available' || asset.status === 'in-repair' ? '#ffffff' : 'var(--win-black)'
        } : undefined}
      >
        {asset.status === 'in-use' ? 'In Use' : 
         asset.status === 'in-repair' ? 'Repair' : 
         'Avail'}
      </div>
    </div>
  );
};

export default AssetCard;
