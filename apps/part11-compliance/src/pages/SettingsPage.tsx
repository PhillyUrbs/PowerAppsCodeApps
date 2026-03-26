import {
  makeStyles,
  shorthands,
  Text,
  Card,
  tokens,
  Select,
  Field,
  Badge,
  Divider,
  Button,
} from '@fluentui/react-components';
import {
  PersonRegular,
  ShieldCheckmarkRegular,
  InfoRegular,
  DeleteRegular,
} from '@fluentui/react-icons';
import { useCurrentUser } from '../hooks/useCurrentUser';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '800px',
  },
  card: {
    ...shorthands.padding('20px'),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '8px',
  },
  fieldItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    '& th, & td': {
      ...shorthands.padding('8px', '12px'),
      textAlign: 'left',
      ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    },
    '& th': {
      backgroundColor: tokens.colorNeutralBackground3,
      fontWeight: '600',
      fontSize: tokens.fontSizeBase200,
    },
  },
  infoBox: {
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
});

const ROLE_PERMISSIONS: Record<string, string[]> = {
  Operator: ['Create batch records', 'Update draft records', 'Sign as Verified'],
  Reviewer: ['View all records', 'Sign as Reviewed', 'Sign as Rejected'],
  'QA Approver': ['View all records', 'Sign as Approved', 'Sign as Rejected', 'Release batches'],
  Admin: ['Full access', 'All signature types', 'System configuration'],
};

export default function SettingsPage() {
  const styles = useStyles();
  const { currentUser, switchUser, allUsers } = useCurrentUser();

  const handleClearStorage = () => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('part11-'));
    keys.forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <div className={styles.page}>
      <Text size={600} weight="bold">Settings</Text>

      {/* Role Switcher */}
      <Card className={styles.card}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <PersonRegular style={{ fontSize: 20, color: tokens.colorBrandForeground1 }} />
            <Text weight="semibold" size={400}>Current User (Demo Role Switcher)</Text>
          </div>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            Switch between user roles to demonstrate how 21 CFR Part 11 authority checks (§ 11.10(g)) restrict actions based on role.
            In production, this would be driven by Microsoft Entra ID and Dataverse security roles.
          </Text>

          <Field label="Active User">
            <Select
              value={currentUser.id}
              onChange={(_, data) => switchUser(data.value)}
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName} — {u.role}
                </option>
              ))}
            </Select>
          </Field>

          <div className={styles.userInfo}>
            <div className={styles.fieldItem}>
              <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3 }}>Name</Text>
              <Text size={300}>{currentUser.displayName}</Text>
            </div>
            <div className={styles.fieldItem}>
              <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3 }}>Role</Text>
              <Badge appearance="filled" color="brand" shape="rounded">{currentUser.role}</Badge>
            </div>
            <div className={styles.fieldItem}>
              <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3 }}>Email</Text>
              <Text size={300}>{currentUser.email}</Text>
            </div>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <Text size={200} weight="semibold">Permissions for {currentUser.role}:</Text>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {ROLE_PERMISSIONS[currentUser.role]?.map((p) => (
              <li key={p}><Text size={200}>{p}</Text></li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Dataverse Mapping */}
      <Card className={styles.card}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <ShieldCheckmarkRegular style={{ fontSize: 20, color: tokens.colorBrandForeground1 }} />
            <Text weight="semibold" size={400}>Dataverse Mapping — Part 11 Requirements</Text>
          </div>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            How each 21 CFR Part 11 requirement maps to Power Platform / Dataverse capabilities in a production deployment.
          </Text>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Part 11 Section</th>
                <th>Requirement</th>
                <th>Dataverse Capability</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Text size={200}>§ 11.10(a)</Text></td>
                <td><Text size={200}>System Validation</Text></td>
                <td><Text size={200}>SOC 2 Type II certified, FDA-validated cloud infrastructure</Text></td>
              </tr>
              <tr>
                <td><Text size={200}>§ 11.10(b)</Text></td>
                <td><Text size={200}>Record Copies</Text></td>
                <td><Text size={200}>Dataverse data export, Power Automate PDF generation</Text></td>
              </tr>
              <tr>
                <td><Text size={200}>§ 11.10(c)</Text></td>
                <td><Text size={200}>Record Retention</Text></td>
                <td><Text size={200}>Geo-redundant storage, configurable retention policies</Text></td>
              </tr>
              <tr>
                <td><Text size={200}>§ 11.10(d)</Text></td>
                <td><Text size={200}>Access Control</Text></td>
                <td><Text size={200}>Entra ID authentication + Dataverse security roles</Text></td>
              </tr>
              <tr>
                <td><Text size={200}>§ 11.10(e)</Text></td>
                <td><Text size={200}>Audit Trail</Text></td>
                <td><Text size={200}>Built-in Dataverse audit logging (immutable, time-stamped)</Text></td>
              </tr>
              <tr>
                <td><Text size={200}>§ 11.10(g)</Text></td>
                <td><Text size={200}>Authority Checks</Text></td>
                <td><Text size={200}>Dataverse security roles + field-level security</Text></td>
              </tr>
              <tr>
                <td><Text size={200}>§ 11.50</Text></td>
                <td><Text size={200}>Signature Manifestation</Text></td>
                <td><Text size={200}>Custom signature table with name, role, meaning, timestamp</Text></td>
              </tr>
              <tr>
                <td><Text size={200}>§ 11.100</Text></td>
                <td><Text size={200}>Unique Signatures</Text></td>
                <td><Text size={200}>Entra ID identity (one user = one identity, never reused)</Text></td>
              </tr>
              <tr>
                <td><Text size={200}>§ 11.200</Text></td>
                <td><Text size={200}>Two-Factor Auth</Text></td>
                <td><Text size={200}>Entra ID MFA (user ID + password + second factor)</Text></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reset Demo Data */}
      <Card className={styles.card}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <DeleteRegular style={{ fontSize: 20, color: tokens.colorPaletteRedForeground1 }} />
            <Text weight="semibold" size={400}>Reset Demo Data</Text>
          </div>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            Clear all locally stored batch records, signatures, and audit entries. This resets the demo back to the original seed data.
          </Text>
          <Button
            appearance="secondary"
            icon={<DeleteRegular />}
            onClick={handleClearStorage}
            style={{ alignSelf: 'flex-start', marginTop: 4 }}
          >
            Clear Local Storage &amp; Reload
          </Button>
        </div>
      </Card>

      {/* About */}
      <Card className={styles.card}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <InfoRegular style={{ fontSize: 20, color: tokens.colorBrandForeground1 }} />
            <Text weight="semibold" size={400}>About This Demo</Text>
          </div>
          <div className={styles.infoBox}>
            <Text size={200} block>
              This application demonstrates how <strong>Microsoft Power Apps (Code Components)</strong> and <strong>Dataverse</strong> can 
              address the requirements of <strong>FDA 21 CFR Part 11</strong> — Electronic Records; Electronic Signatures.
            </Text>
            <Text size={200} block style={{ marginTop: 8 }}>
              The demo uses mock data to showcase the user experience. In production, batch records, 
              electronic signatures, and audit trail entries would be stored in Dataverse tables with 
              built-in audit logging, security roles, and Microsoft Entra ID authentication providing 
              the compliance infrastructure.
            </Text>
            <Text size={200} block style={{ marginTop: 8 }}>
              <strong>Key Part 11 features demonstrated:</strong>
            </Text>
            <ul style={{ margin: '4px 0 0 20px' }}>
              <li><Text size={200}>Electronic records with lifecycle management (Draft → Review → Approve → Release)</Text></li>
              <li><Text size={200}>Electronic signatures with identity re-confirmation, meaning, and reason capture</Text></li>
              <li><Text size={200}>Immutable, time-stamped audit trail for all record operations</Text></li>
              <li><Text size={200}>Role-based authority checks controlling who can sign with which meanings</Text></li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
