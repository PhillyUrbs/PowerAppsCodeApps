import { useState } from 'react';
import {
  makeStyles,
  shorthands,
  Text,
  Card,
  Button,
  tokens,
  Input,
  Select,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Field,
  Textarea,
  Spinner,
  Divider,
  Badge,
} from '@fluentui/react-components';
import {
  AddRegular,
  SearchRegular,
  DismissRegular,
  PersonRegular,
  CheckmarkCircleRegular,
  CircleRegular,
  LockClosedRegular,
} from '@fluentui/react-icons';
import { useBatchRecords } from '../hooks/useBatchRecords';
import { useElectronicSignatures } from '../hooks/useElectronicSignatures';
import { useAuditTrail } from '../hooks/useAuditTrail';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { StatusBadge } from '../components/StatusBadge';
import { SignatureDialog } from '../components/SignatureDialog';
import { AuditTimeline } from '../components/AuditTimeline';
import { SIGNATURE_AUTHORITY } from '../types/electronic-signature';
import type { SignatureType } from '../types/electronic-signature';
import type { BatchRecord } from '../types/batch-record';
import { BATCH_CLASSIFICATIONS } from '../data/mock-data';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toolbar: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchBox: {
    minWidth: '240px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    '& th, & td': {
      ...shorthands.padding('10px', '14px'),
      textAlign: 'left',
      ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    },
    '& th': {
      backgroundColor: tokens.colorNeutralBackground3,
      fontWeight: '600',
      fontSize: tokens.fontSizeBase200,
      color: tokens.colorNeutralForeground3,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    '& tbody tr': {
      cursor: 'pointer',
      transition: 'background-color 0.1s ease',
    },
    '& tbody tr:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  detailPanel: {
    position: 'fixed',
    top: '60px',
    right: 0,
    width: '480px',
    height: 'calc(100vh - 60px)',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderLeft('1px', 'solid', tokens.colorNeutralStroke2),
    boxShadow: tokens.shadow16,
    zIndex: 900,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('16px', '20px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  detailBody: {
    flex: 1,
    overflow: 'auto',
    ...shorthands.padding('20px'),
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  fieldItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sigList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sigCard: {
    ...shorthands.padding('10px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  stepCard: {
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  stepHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sigSlot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('6px', '10px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border('1px', 'dashed', tokens.colorNeutralStroke2),
  },
  sigSlotSigned: {
    ...shorthands.border('1px', 'solid', tokens.colorPaletteGreenBorder2),
    backgroundColor: tokens.colorPaletteGreenBackground1,
  },
});

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Draft', label: 'Draft' },
  { value: 'InReview', label: 'In Review' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Released', label: 'Released' },
  { value: 'Rejected', label: 'Rejected' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function BatchRecordsPage() {
  const styles = useStyles();
  const { records, isLoading, createRecord, isCreating } = useBatchRecords();
  const { currentUser } = useCurrentUser();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [signTarget, setSignTarget] = useState<{ stepNumber: number; stepName: string; signatureType: SignatureType } | null>(null);

  // New record form state
  const [form, setForm] = useState({
    batchNumber: '',
    productName: '',
    productCode: '',
    classificationId: BATCH_CLASSIFICATIONS[0].id,
    description: '',
    quantity: '',
    unit: 'tablets',
  });

  const filtered = records.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.batchNumber.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.productCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedRecord = records.find((r) => r.id === selectedId) ?? null;

  const handleCreate = async () => {
    await createRecord({
      batchNumber: form.batchNumber,
      productName: form.productName,
      productCode: form.productCode,
      classificationId: form.classificationId,
      description: form.description,
      quantity: Number(form.quantity) || 0,
      unit: form.unit,
      manufacturingDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 730 * 86400000).toISOString(),
      createdBy: currentUser.displayName,
    });
    setForm({ batchNumber: '', productName: '', productCode: '', classificationId: BATCH_CLASSIFICATIONS[0].id, description: '', quantity: '', unit: 'tablets' });
    setShowNewDialog(false);
  };

  const canSign = selectedRecord && SIGNATURE_AUTHORITY[currentUser.role]?.length > 0;

  const handleOpenSignDialog = (stepNumber: number, stepName: string, signatureType: SignatureType) => {
    setSignTarget({ stepNumber, stepName, signatureType });
    setShowSignDialog(true);
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner label="Loading records..." /></div>;
  }

  return (
    <div className={styles.page}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <Input
          className={styles.searchBox}
          contentBefore={<SearchRegular />}
          placeholder="Search batch records..."
          value={search}
          onChange={(_, data) => setSearch(data.value)}
        />
        <Select value={statusFilter} onChange={(_, data) => setStatusFilter(data.value)}>
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </Select>
        <Button icon={<AddRegular />} appearance="primary" onClick={() => setShowNewDialog(true)}>
          New Batch Record
        </Button>
      </div>

      {/* Records Table */}
      <Card style={{ padding: 0, overflow: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Batch #</th>
              <th>Product</th>
              <th>Code</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Created By</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} onClick={() => setSelectedId(r.id)} style={r.id === selectedId ? { backgroundColor: tokens.colorNeutralBackground1Selected } : undefined}>
                <td><Text weight="semibold" size={300}>{r.batchNumber}</Text></td>
                <td><Text size={300}>{r.productName}</Text></td>
                <td><Text size={200}>{r.productCode}</Text></td>
                <td><StatusBadge status={r.status} /></td>
                <td><Text size={300}>{r.quantity.toLocaleString()} {r.unit}</Text></td>
                <td><Text size={300}>{r.createdBy}</Text></td>
                <td><Text size={200}>{formatDate(r.createdOn)}</Text></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>
                  <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>No records found.</Text>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Detail Side Panel */}
      {selectedRecord && (
        <RecordDetailPanel
          record={selectedRecord}
          onClose={() => setSelectedId(null)}
          canSign={!!canSign}
          onSignClick={handleOpenSignDialog}
        />
      )}

      {/* Signature Dialog */}
      {selectedRecord && signTarget && (
        <SignatureDialogWrapper
          record={selectedRecord}
          open={showSignDialog}
          onClose={() => { setShowSignDialog(false); setSignTarget(null); }}
          stepNumber={signTarget.stepNumber}
          stepName={signTarget.stepName}
          signatureType={signTarget.signatureType}
        />
      )}

      {/* New Record Dialog */}
      <Dialog open={showNewDialog} onOpenChange={(_, data) => { if (!data.open) setShowNewDialog(false); }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Create New Batch Record</DialogTitle>
            <DialogContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Field label="Batch Number" required>
                  <Input value={form.batchNumber} onChange={(_, d) => setForm({ ...form, batchNumber: d.value })} placeholder="RX-2026-XXXX" />
                </Field>
                <Field label="Product Name" required>
                  <Input value={form.productName} onChange={(_, d) => setForm({ ...form, productName: d.value })} />
                </Field>
                <Field label="Product Code" required>
                  <Input value={form.productCode} onChange={(_, d) => setForm({ ...form, productCode: d.value })} placeholder="AMX-500" />
                </Field>
                <Field label="Batch Classification" required>
                  <Select value={form.classificationId} onChange={(_, d) => setForm({ ...form, classificationId: d.value })}>
                    {BATCH_CLASSIFICATIONS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.steps.length} steps)</option>
                    ))}
                  </Select>
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Quantity">
                    <Input type="number" value={form.quantity} onChange={(_, d) => setForm({ ...form, quantity: d.value })} />
                  </Field>
                  <Field label="Unit">
                    <Select value={form.unit} onChange={(_, d) => setForm({ ...form, unit: d.value })}>
                      <option value="tablets">Tablets</option>
                      <option value="capsules">Capsules</option>
                      <option value="mL">mL</option>
                      <option value="kg">kg</option>
                    </Select>
                  </Field>
                </div>
                <Field label="Description">
                  <Textarea value={form.description} onChange={(_, d) => setForm({ ...form, description: d.value })} rows={3} />
                </Field>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setShowNewDialog(false)}>Cancel</Button>
              <Button
                appearance="primary"
                onClick={handleCreate}
                disabled={!form.batchNumber || !form.productName || !form.productCode || isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Record'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────

function RecordDetailPanel({
  record,
  onClose,
  canSign,
  onSignClick,
}: {
  record: BatchRecord;
  onClose: () => void;
  canSign: boolean;
  onSignClick: (stepNumber: number, stepName: string, signatureType: SignatureType) => void;
}) {
  const styles = useStyles();
  const { signatures } = useElectronicSignatures(record.id);
  const { entries } = useAuditTrail(record.id);
  const { currentUser } = useCurrentUser();

  const classification = BATCH_CLASSIFICATIONS.find((c) => c.id === record.classificationId);
  const steps = classification?.steps ?? [];

  return (
    <div className={styles.detailPanel}>
      <div className={styles.detailHeader}>
        <div>
          <Text weight="semibold" size={400} block>{record.batchNumber}</Text>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>{record.productName}</Text>
        </div>
        <Button icon={<DismissRegular />} appearance="subtle" onClick={onClose} />
      </div>
      <div className={styles.detailBody}>
        {/* Record Fields */}
        <div className={styles.fieldGrid}>
          <FieldDisplay label="Status" value={<StatusBadge status={record.status} />} />
          <FieldDisplay label="Product Code" value={record.productCode} />
          <FieldDisplay label="Classification" value={classification?.name ?? 'Unknown'} />
          <FieldDisplay label="Quantity" value={`${record.quantity.toLocaleString()} ${record.unit}`} />
          <FieldDisplay label="Mfg Date" value={formatDate(record.manufacturingDate)} />
          <FieldDisplay label="Exp Date" value={formatDate(record.expirationDate)} />
          <FieldDisplay label="Created By" value={record.createdBy} />
          <FieldDisplay label="Created On" value={formatDateTime(record.createdOn)} />
        </div>
        {record.description && (
          <div>
            <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3 }} block>Description</Text>
            <Text size={300}>{record.description}</Text>
          </div>
        )}

        <Divider />

        {/* Step-Based Signatures */}
        <div>
          <Text weight="semibold" size={300} block style={{ marginBottom: 8 }}>
            Manufacturing Steps & Signatures (§ 11.50)
          </Text>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3, display: 'block', marginBottom: 12 }}>
            Each step requires a Doer (performer) and a Witness. The Doer must sign first. Both must be different people.
          </Text>
          <div className={styles.sigList}>
            {steps.map((step) => {
              const doerSig = signatures.find(
                (s) => s.stepNumber === step.stepNumber && s.signatureType === 'Doer'
              );
              const witnessSig = signatures.find(
                (s) => s.stepNumber === step.stepNumber && s.signatureType === 'Witness'
              );
              const stepComplete = !!doerSig && !!witnessSig;
              const canSignDoer = canSign && !doerSig && record.status !== 'Released' && record.status !== 'Rejected';
              const canSignWitness =
                canSign &&
                !!doerSig &&
                !witnessSig &&
                record.status !== 'Released' &&
                record.status !== 'Rejected' &&
                doerSig.signerName !== currentUser.displayName;

              return (
                <div key={step.stepNumber} className={styles.stepCard} style={stepComplete ? { borderColor: tokens.colorPaletteGreenBorder2 } : undefined}>
                  <div className={styles.stepHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {stepComplete ? (
                        <CheckmarkCircleRegular style={{ color: tokens.colorPaletteGreenForeground1 }} />
                      ) : (
                        <CircleRegular style={{ color: tokens.colorNeutralForeground3 }} />
                      )}
                      <Text size={300} weight="semibold">Step {step.stepNumber}: {step.name}</Text>
                    </div>
                    {stepComplete && (
                      <Badge appearance="filled" color="success" size="small" shape="rounded">Complete</Badge>
                    )}
                  </div>
                  <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>{step.description}</Text>

                  {/* Doer slot */}
                  <div className={`${styles.sigSlot} ${doerSig ? styles.sigSlotSigned : ''}`}>
                    <div>
                      <Text size={200} weight="semibold" block>Doer</Text>
                      {doerSig ? (
                        <>
                          <Text size={200}>{doerSig.signerName} ({doerSig.signerRole})</Text>
                          <Text size={100} style={{ color: tokens.colorNeutralForeground3, display: 'block' }}>
                            {doerSig.meaning} · {formatDateTime(doerSig.signedOn)}
                          </Text>
                          <Text size={100} style={{ color: tokens.colorNeutralForeground3, display: 'block', fontStyle: 'italic' }}>
                            {doerSig.reason}
                          </Text>
                        </>
                      ) : (
                        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Awaiting signature</Text>
                      )}
                    </div>
                    {canSignDoer && (
                      <Button
                        size="small"
                        appearance="primary"
                        icon={<PersonRegular />}
                        onClick={() => onSignClick(step.stepNumber, step.name, 'Doer')}
                      >
                        Sign
                      </Button>
                    )}
                    {doerSig && <LockClosedRegular style={{ color: tokens.colorPaletteGreenForeground1, fontSize: 16 }} />}
                  </div>

                  {/* Witness slot */}
                  <div className={`${styles.sigSlot} ${witnessSig ? styles.sigSlotSigned : ''}`}>
                    <div>
                      <Text size={200} weight="semibold" block>Witness</Text>
                      {witnessSig ? (
                        <>
                          <Text size={200}>{witnessSig.signerName} ({witnessSig.signerRole})</Text>
                          <Text size={100} style={{ color: tokens.colorNeutralForeground3, display: 'block' }}>
                            {witnessSig.meaning} · {formatDateTime(witnessSig.signedOn)}
                          </Text>
                          <Text size={100} style={{ color: tokens.colorNeutralForeground3, display: 'block', fontStyle: 'italic' }}>
                            {witnessSig.reason}
                          </Text>
                        </>
                      ) : !doerSig ? (
                        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Doer must sign first</Text>
                      ) : (
                        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Awaiting witness</Text>
                      )}
                    </div>
                    {canSignWitness && (
                      <Button
                        size="small"
                        appearance="outline"
                        icon={<PersonRegular />}
                        onClick={() => onSignClick(step.stepNumber, step.name, 'Witness')}
                      >
                        Witness
                      </Button>
                    )}
                    {witnessSig && <LockClosedRegular style={{ color: tokens.colorPaletteGreenForeground1, fontSize: 16 }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Divider />

        {/* Audit Trail Section */}
        <div>
          <Text weight="semibold" size={300} block style={{ marginBottom: 8 }}>Audit Trail (§ 11.10(e))</Text>
          <AuditTimeline entries={entries} />
        </div>
      </div>
    </div>
  );
}

function FieldDisplay({ label, value }: { label: string; value: React.ReactNode }) {
  const styles = useStyles();
  return (
    <div className={styles.fieldItem}>
      <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3 }}>{label}</Text>
      {typeof value === 'string' ? <Text size={300}>{value}</Text> : value}
    </div>
  );
}

function SignatureDialogWrapper({
  record,
  open,
  onClose,
  stepNumber,
  stepName,
  signatureType,
}: {
  record: BatchRecord;
  open: boolean;
  onClose: () => void;
  stepNumber: number;
  stepName: string;
  signatureType: SignatureType;
}) {
  const { sign } = useElectronicSignatures(record.id);

  return (
    <SignatureDialog
      open={open}
      onClose={onClose}
      recordLabel={record.batchNumber}
      stepNumber={stepNumber}
      stepName={stepName}
      signatureType={signatureType}
      onSign={async (meaning, reason) => {
        await sign({ targetRecordId: record.id, stepNumber, signatureType, meaning, reason });
      }}
    />
  );
}
