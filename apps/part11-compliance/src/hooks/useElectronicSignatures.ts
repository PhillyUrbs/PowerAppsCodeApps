import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SignatureService } from '../services/signature-service';
import { AuditService } from '../services/audit-service';
import { BatchRecordService } from '../services/batch-record-service';
import { useCurrentUser } from './useCurrentUser';
import type { SignatureMeaning } from '../types/electronic-signature';
import type { SignatureType } from '../types/electronic-signature';
import type { BatchStatus } from '../types/batch-record';

/** Determines the new status when all steps are fully signed */
function statusAfterSignature(meaning: SignatureMeaning, currentStatus: BatchStatus): BatchStatus {
  switch (meaning) {
    case 'Reviewed':
      return currentStatus === 'Draft' ? 'InReview' : currentStatus;
    case 'Approved':
      return currentStatus === 'InReview' ? 'Approved' : currentStatus;
    case 'Rejected':
      return 'Rejected';
    case 'Verified':
      return currentStatus === 'Approved' ? 'Released' : currentStatus;
    default:
      return currentStatus;
  }
}

export function useElectronicSignatures(recordId?: string) {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const query = useQuery({
    queryKey: ['signatures', recordId],
    queryFn: () =>
      recordId
        ? SignatureService.getByRecord(recordId)
        : SignatureService.getAll(),
    enabled: !!recordId,
  });

  const signMutation = useMutation({
    mutationFn: async ({
      targetRecordId,
      stepNumber,
      signatureType,
      meaning,
      reason,
    }: {
      targetRecordId: string;
      stepNumber: number;
      signatureType: SignatureType;
      meaning: SignatureMeaning;
      reason: string;
    }) => {
      const record = await BatchRecordService.get(targetRecordId);
      if (!record) throw new Error('Record not found');

      // Get existing signatures for this record
      const existingSigs = await SignatureService.getByRecord(targetRecordId);

      // Validation: Doer must sign before Witness on the same step
      if (signatureType === 'Witness') {
        const doerSig = existingSigs.find(
          (s) => s.recordId === targetRecordId && s.stepNumber === stepNumber && s.signatureType === 'Doer'
        );
        if (!doerSig) {
          throw new Error(`Step ${stepNumber}: The Doer must sign before the Witness.`);
        }
      }

      // Validation: Unique user per step — the same person cannot be both Doer and Witness
      const otherSigOnStep = existingSigs.find(
        (s) =>
          s.recordId === targetRecordId &&
          s.stepNumber === stepNumber &&
          s.signatureType !== signatureType &&
          s.signerName === currentUser.displayName
      );
      if (otherSigOnStep) {
        throw new Error(
          `Step ${stepNumber}: You already signed as ${otherSigOnStep.signatureType}. The Doer and Witness must be different people.`
        );
      }

      // Validation: Can't sign the same role twice on the same step
      const duplicateSig = existingSigs.find(
        (s) =>
          s.recordId === targetRecordId &&
          s.stepNumber === stepNumber &&
          s.signatureType === signatureType
      );
      if (duplicateSig) {
        throw new Error(
          `Step ${stepNumber}: The ${signatureType} signature has already been applied by ${duplicateSig.signerName}.`
        );
      }

      const sig = await SignatureService.create({
        recordId: targetRecordId,
        stepNumber,
        signatureType,
        signerName: currentUser.displayName,
        signerRole: currentUser.role,
        meaning,
        reason,
      });

      // Log the signature in the audit trail
      await AuditService.create({
        recordId: targetRecordId,
        recordLabel: record.batchNumber,
        action: 'Signed',
        field: `Step ${stepNumber} (${signatureType})`,
        newValue: `${meaning} by ${currentUser.displayName}`,
        performedBy: currentUser.displayName,
      });

      // Transition status if applicable
      const newStatus = statusAfterSignature(meaning, record.status);
      if (newStatus !== record.status) {
        await BatchRecordService.update(
          targetRecordId,
          { status: newStatus },
          currentUser.displayName
        );
        await AuditService.create({
          recordId: targetRecordId,
          recordLabel: record.batchNumber,
          action: 'StatusChanged',
          field: 'status',
          oldValue: record.status,
          newValue: newStatus,
          performedBy: currentUser.displayName,
        });
      }

      return sig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signatures'] });
      queryClient.invalidateQueries({ queryKey: ['batchRecords'] });
      queryClient.invalidateQueries({ queryKey: ['auditEntries'] });
    },
  });

  return {
    signatures: query.data ?? [],
    isLoading: query.isLoading,
    sign: signMutation.mutateAsync,
    isSigning: signMutation.isPending,
  };
}
