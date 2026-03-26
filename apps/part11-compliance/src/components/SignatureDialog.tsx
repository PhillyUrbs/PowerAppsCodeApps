import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Field,
  Input,
  Select,
  Textarea,
  Text,
  tokens,
  makeStyles,
  shorthands,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import { ShieldCheckmarkRegular } from '@fluentui/react-icons';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { SIGNATURE_AUTHORITY, type SignatureMeaning, type SignatureType } from '../types/electronic-signature';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: tokens.colorBrandForeground1,
  },
  manifestation: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
});

interface SignatureDialogProps {
  open: boolean;
  onClose: () => void;
  onSign: (meaning: SignatureMeaning, reason: string) => Promise<void>;
  recordLabel: string;
  stepName?: string;
  stepNumber?: number;
  signatureType?: SignatureType;
}

export function SignatureDialog({ open, onClose, onSign, recordLabel, stepName, stepNumber, signatureType }: SignatureDialogProps) {
  const styles = useStyles();
  const { currentUser } = useCurrentUser();
  const allowedMeanings = SIGNATURE_AUTHORITY[currentUser.role] ?? [];

  const [nameConfirmation, setNameConfirmation] = useState('');
  const [meaning, setMeaning] = useState<SignatureMeaning | ''>('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const nameMatch = nameConfirmation.trim().toLowerCase() === currentUser.displayName.toLowerCase();
  const canSubmit = nameMatch && meaning !== '' && reason.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !meaning) return;
    setSubmitting(true);
    setError('');
    try {
      await onSign(meaning, reason.trim());
      setNameConfirmation('');
      setMeaning('');
      setReason('');
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Signature failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setNameConfirmation('');
    setMeaning('');
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => { if (!data.open) handleClose(); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            <div className={styles.header}>
              <ShieldCheckmarkRegular fontSize={24} />
              Electronic Signature — {recordLabel}
              {stepNumber !== undefined && signatureType && (
                <Text size={200} style={{ fontWeight: 'normal', color: tokens.colorNeutralForeground3 }}>
                  Step {stepNumber}: {stepName} ({signatureType})
                </Text>
              )}
            </div>
          </DialogTitle>
          <DialogContent>
            {error && (
              <MessageBar intent="error" style={{ marginBottom: 12 }}>
                <MessageBarBody>{error}</MessageBarBody>
              </MessageBar>
            )}

            <Text size={200} style={{ color: tokens.colorNeutralForeground3, display: 'block', marginBottom: 16 }}>
              Per 21 CFR Part 11 § 11.50 & § 11.100, re-enter your full name to confirm your identity. Your signature will include your printed name, role, the date/time, and the meaning of the signature.
            </Text>

            <Field label="Signer identity (re-enter your full name)" required>
              <Input
                value={nameConfirmation}
                onChange={(_, data) => setNameConfirmation(data.value)}
                placeholder={currentUser.displayName}
              />
            </Field>

            <Field label="Signature meaning" required style={{ marginTop: 12 }}>
              <Select
                value={meaning}
                onChange={(_, data) => setMeaning(data.value as SignatureMeaning)}
              >
                <option value="">— Select —</option>
                {allowedMeanings.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Select>
            </Field>

            <Field label="Reason / justification" required style={{ marginTop: 12 }}>
              <Textarea
                value={reason}
                onChange={(_, data) => setReason(data.value)}
                placeholder="Describe the reason for this signature..."
                rows={3}
              />
            </Field>

            {/* Signature manifestation preview per §11.50 */}
            {meaning && nameMatch && (
              <div className={styles.manifestation}>
                <Text size={200} weight="semibold">Signature Preview (§ 11.50)</Text>
                <Text size={200}>Signed by: {currentUser.displayName}</Text>
                <Text size={200}>Role: {currentUser.role}</Text>
                {signatureType && <Text size={200}>Signing as: {signatureType}</Text>}
                {stepNumber !== undefined && <Text size={200}>Step: {stepNumber} — {stepName}</Text>}
                <Text size={200}>Meaning: {meaning}</Text>
                <Text size={200}>Date/Time: {new Date().toLocaleString()}</Text>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={handleClose}>Cancel</Button>
            <Button appearance="primary" onClick={handleSubmit} disabled={!canSubmit}>
              {submitting ? 'Signing...' : 'Apply Signature'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
