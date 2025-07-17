import { Text, Card, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { CloudRegular } from '@fluentui/react-icons';
import PageHeader from '../components/PageHeader';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  comingSoon: {
    textAlign: 'center',
    ...shorthands.padding('48px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  comingSoonTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '16px',
    display: 'block',
  },
  comingSoonText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
});

export default function CustomApiPage() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <PageHeader
        title="Custom API Connector Example"
        subtitle="This page will demonstrate custom API connector patterns with REST API calls, HTTP methods, error handling, and response parsing using mock data."
        icon={<CloudRegular />}
      />

      <Card className={styles.comingSoon}>
        <Text className={styles.comingSoonTitle}>
          Coming Soon
        </Text>
        <Text className={styles.comingSoonText}>
          Custom API connector example with REST API calls, HTTP methods, 
          error handling, and response parsing will be implemented here using comprehensive mock data.
        </Text>
      </Card>
    </div>
  );
}
