import { Text, Card, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { PeopleRegular } from '@fluentui/react-icons';
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

export default function Office365Page() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <PageHeader
        title="Office 365 Connector Example"
        subtitle="This page will demonstrate Office 365 connector patterns with user profiles, calendar events, and email integration using mock data."
        icon={<PeopleRegular />}
      />

      <Card className={styles.comingSoon}>
        <Text className={styles.comingSoonTitle}>
          Coming Soon
        </Text>
        <Text className={styles.comingSoonText}>
          Office 365 connector example with user profiles, calendar events, and email integration
          will be implemented here using comprehensive mock data.
        </Text>
      </Card>
    </div>
  );
}
