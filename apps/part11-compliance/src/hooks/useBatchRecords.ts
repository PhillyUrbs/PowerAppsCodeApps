import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BatchRecordService } from '../services/batch-record-service';
import { AuditService } from '../services/audit-service';
import { useCurrentUser } from './useCurrentUser';
import type { BatchRecord } from '../types/batch-record';

export function useBatchRecords() {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const query = useQuery({
    queryKey: ['batchRecords'],
    queryFn: () => BatchRecordService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<BatchRecord, 'id' | 'createdOn' | 'modifiedOn' | 'modifiedBy' | 'status'>) =>
      BatchRecordService.create(data),
    onSuccess: async (record) => {
      await AuditService.create({
        recordId: record.id,
        recordLabel: record.batchNumber,
        action: 'Created',
        performedBy: currentUser.displayName,
      });
      queryClient.invalidateQueries({ queryKey: ['batchRecords'] });
      queryClient.invalidateQueries({ queryKey: ['auditEntries'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, changes, field, oldValue, newValue }: {
      id: string;
      changes: Partial<BatchRecord>;
      field: string;
      oldValue: string;
      newValue: string;
    }) => BatchRecordService.update(id, changes, currentUser.displayName).then(async (record) => {
      await AuditService.create({
        recordId: id,
        recordLabel: record.batchNumber,
        action: changes.status ? 'StatusChanged' : 'Updated',
        field,
        oldValue,
        newValue,
        performedBy: currentUser.displayName,
      });
      return record;
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batchRecords'] });
      queryClient.invalidateQueries({ queryKey: ['auditEntries'] });
    },
  });

  return {
    records: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createRecord: createMutation.mutateAsync,
    updateRecord: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
