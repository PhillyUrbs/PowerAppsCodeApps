import { useQuery } from '@tanstack/react-query';
import { AuditService } from '../services/audit-service';

export function useAuditTrail(recordId?: string) {
  const query = useQuery({
    queryKey: recordId ? ['auditEntries', recordId] : ['auditEntries'],
    queryFn: () =>
      recordId ? AuditService.getByRecord(recordId) : AuditService.getAll(),
  });

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
