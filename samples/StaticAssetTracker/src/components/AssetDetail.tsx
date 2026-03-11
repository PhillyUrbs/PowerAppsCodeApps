import { Asset, Owner } from '@/types/asset';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { owners } from '@/data/owners';

interface AssetDetailProps {
  asset: Asset;
  onStatusUpdate: (newStatus: Asset['status']) => void;
  onAssignOwner?: (assetId: string, ownerId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const AssetDetail = ({ asset, onStatusUpdate, onAssignOwner, className, style }: AssetDetailProps) => {
  const [selectedStatus, setSelectedStatus] = useState<Asset['status']>(asset.status);
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    setSelectedStatus(asset.status);
    setHasChanges(false);
  }, [asset.id, asset.status]);

  const handleStatusChange = (newStatus: Asset['status']) => {
    setSelectedStatus(newStatus);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (selectedStatus === 'in-use' && asset.status !== 'in-use') {
      setIsReserveDialogOpen(true);
    } else {
      onStatusUpdate(selectedStatus);
      setHasChanges(false);
    }
  };

  const handleReserve = () => {
    if (selectedOwnerId && onAssignOwner) {
      onAssignOwner(asset.id, selectedOwnerId);
      onStatusUpdate('in-use');
      setIsReserveDialogOpen(false);
      setSelectedOwnerId('');
      setHasChanges(false);
    }
  };

  return (
    <>
      <div className={cn("h-full", className)} style={style}>
        {/* Asset Header */}
        <div className="flex items-center gap-4 mb-4 pb-3" style={{ borderBottom: '1px solid var(--win-dark)' }}>
          <Avatar className="w-20 h-20 shrink-0" style={{ border: '2px solid var(--win-dark)' }}>
            <AvatarImage src={asset.image} alt={asset.name} />
            <AvatarFallback style={{ background: 'var(--win-bg)' }}>{(asset.name).charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--win-black)' }}>{asset.name}</h2>
            <p className="text-sm" style={{ color: 'var(--win-dark)' }}>{asset.type}</p>
          </div>
        </div>
        
        {/* Asset Information Group Box */}
        <div className="win-groupbox mb-4" style={{ background: 'var(--win-bg)' }}>
          <span className="absolute -top-2.5 left-3 px-1 text-xs font-bold" style={{ background: 'var(--win-bg)', color: 'var(--win-black)' }}>
            Asset Information
          </span>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <span className="text-xs font-bold" style={{ color: 'var(--win-dark)' }}>Current Status:</span>
              <span className={cn(
                "ml-2 text-xs px-1.5 py-0.5 win-raised inline-block",
              )} style={{
                background: asset.status === 'available' ? '#00aa00' : asset.status === 'in-repair' ? '#aaaa00' : 'var(--win-bg)',
                color: asset.status === 'available' || asset.status === 'in-repair' ? '#ffffff' : 'var(--win-black)'
              }}>
                {asset.status === 'in-use' ? 'In Use' : asset.status === 'in-repair' ? 'In Repair' : 'Available'}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold" style={{ color: 'var(--win-dark)' }}>Value:</span>
              <span className="ml-2 text-sm" style={{ color: 'var(--win-black)' }}>${asset.value.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs font-bold" style={{ color: 'var(--win-dark)' }}>Purchase Date:</span>
              <span className="ml-2 text-sm" style={{ color: 'var(--win-black)' }}>{asset.purchaseDate}</span>
            </div>
            <div>
              <span className="text-xs font-bold" style={{ color: 'var(--win-dark)' }}>Brand:</span>
              <span className="ml-2 text-sm" style={{ color: 'var(--win-black)' }}>{asset.brand}</span>
            </div>
            <div>
              <span className="text-xs font-bold" style={{ color: 'var(--win-dark)' }}>Model:</span>
              <span className="ml-2 text-sm" style={{ color: 'var(--win-black)' }}>{asset.model}</span>
            </div>
            <div>
              <span className="text-xs font-bold" style={{ color: 'var(--win-dark)' }}>Serial Number:</span>
              <span className="ml-2 text-sm" style={{ color: 'var(--win-black)' }}>{asset.serialNumber}</span>
            </div>
            <div>
              <span className="text-xs font-bold" style={{ color: 'var(--win-dark)' }}>Asset ID:</span>
              <span className="ml-2 text-sm" style={{ color: 'var(--win-black)' }}>{asset.deviceId}</span>
            </div>
          </div>
        </div>
        
        {/* Owner Information Group Box */}
        {asset.status === 'in-use' && asset.owner && (
          <div className="win-groupbox mb-4" style={{ background: 'var(--win-bg)' }}>
            <span className="absolute -top-2.5 left-3 px-1 text-xs font-bold" style={{ background: 'var(--win-bg)', color: 'var(--win-black)' }}>
              Owner Information
            </span>
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-12 w-12" style={{ border: '2px solid var(--win-dark)' }}>
                <AvatarImage src={asset.owner.image} alt={asset.owner.name} />
                <AvatarFallback style={{ background: 'var(--win-bg)' }}>{asset.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold" style={{ color: 'var(--win-black)' }}>{asset.owner.name}</div>
                <div className="text-xs" style={{ color: 'var(--win-dark)' }}>{asset.owner.title}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <div>
                <span className="text-xs font-bold" style={{ color: 'var(--win-dark)' }}>Email:</span>
                <span className="ml-2 text-sm" style={{ color: 'var(--win-black)' }}>{asset.owner.email}</span>
              </div>
              <div>
                <span className="text-xs font-bold" style={{ color: 'var(--win-dark)' }}>Phone:</span>
                <span className="ml-2 text-sm" style={{ color: 'var(--win-black)' }}>{asset.owner.phone}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Status Update Group Box */}
        <div className="win-groupbox" style={{ background: 'var(--win-bg)' }}>
          <span className="absolute -top-2.5 left-3 px-1 text-xs font-bold" style={{ background: 'var(--win-bg)', color: 'var(--win-black)' }}>
            Update Status
          </span>
          <div className="flex items-center gap-2">
            <Select
              value={selectedStatus}
              onValueChange={(value: Asset['status']) => handleStatusChange(value)}
            >
              <SelectTrigger className="flex-1 h-7 rounded-none win-field text-xs border-0">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in-repair">In Repair</SelectItem>
                <SelectItem value="in-use">In Use</SelectItem>
              </SelectContent>
            </Select>
            <button 
              className="win-button text-xs disabled:opacity-50"
              onClick={handleSaveChanges}
              disabled={!hasChanges || selectedStatus === asset.status}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Reserve Dialog */}
      <Dialog open={isReserveDialogOpen} onOpenChange={setIsReserveDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none win-window p-0">
          <div className="win-titlebar">
            <span className="text-sm">Reserve {asset.name}</span>
          </div>
          <div className="p-4" style={{ background: 'var(--win-bg)' }}>
            <DialogHeader className="mb-3">
              <DialogTitle className="text-sm font-bold" style={{ color: 'var(--win-black)' }}>Assign Owner</DialogTitle>
              <DialogDescription className="text-xs" style={{ color: 'var(--win-dark)' }}>
                Select an owner to assign this device to.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <Select
                value={selectedOwnerId}
                onValueChange={setSelectedOwnerId}
              >
                <SelectTrigger className="w-full h-7 rounded-none win-field text-xs border-0">
                  <SelectValue placeholder="Select an owner" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {owners.map((owner) => (
                    <SelectItem 
                      key={owner.id} 
                      value={owner.id}
                    >
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-2" style={{ border: '1px solid var(--win-dark)' }}>
                          <AvatarImage src={owner.image} alt={owner.name} />
                          <AvatarFallback className="text-[8px]">{owner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{owner.name} - {owner.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="flex gap-2 justify-end mt-3">
              <button 
                className="win-button text-xs"
                onClick={() => {
                  setIsReserveDialogOpen(false);
                  setSelectedStatus(asset.status);
                  setHasChanges(false);
                }}
              >
                Cancel
              </button>
              <button 
                className="win-button text-xs disabled:opacity-50"
                onClick={handleReserve}
                disabled={!selectedOwnerId}
              >
                OK
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssetDetail;
