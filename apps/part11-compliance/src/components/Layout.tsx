import type { ReactNode } from 'react';
import {
  makeStyles,
  shorthands,
  Text,
  Button,
  tokens,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import {
  BoardRegular,
  BoardFilled,
  DocumentBulletListRegular,
  DocumentBulletListFilled,
  HistoryRegular,
  HistoryFilled,
  SettingsRegular,
  SettingsFilled,
  NavigationRegular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
  ShieldCheckmarkRegular,
} from '@fluentui/react-icons';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useCurrentUser } from '../hooks/useCurrentUser';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  sidebar: {
    width: '260px',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRight('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('16px'),
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 1000,
    paddingTop: '76px',
    transition: 'transform 0.3s ease-in-out',
    '@media (max-width: 768px)': {
      width: '100vw',
      transform: 'translateX(-100%)',
      paddingTop: '60px',
    },
  },
  sidebarVisible: {
    '@media (max-width: 768px)': {
      transform: 'translateX(0) !important',
    },
  },
  sidebarCollapsed: {
    width: '60px',
    '@media (max-width: 768px)': {
      transform: 'translateX(-100%)',
    },
  },
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '260px',
    marginTop: '60px',
    width: 'calc(100vw - 260px)',
    '@media (max-width: 768px)': {
      marginLeft: 0,
      marginTop: '60px',
      width: '100vw',
    },
  },
  contentCollapsed: {
    marginLeft: '60px',
    marginTop: '60px',
    width: 'calc(100vw - 60px)',
    '@media (max-width: 768px)': {
      marginLeft: 0,
      marginTop: '60px',
      width: '100vw',
    },
  },
  appHeader: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.padding('0', '20px'),
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    boxShadow: tokens.shadow4,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    ...shorthands.padding('4px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground3,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  avatar: {
    width: '28px',
    height: '28px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  },
  popoverContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '220px',
  },
  userOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    ...shorthands.padding('8px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    cursor: 'pointer',
    ...shorthands.border('1px', 'solid', 'transparent'),
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  userOptionActive: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorBrandStroke1),
  },
  navList: {
    listStyle: 'none',
    ...shorthands.margin(0),
    ...shorthands.padding(0),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('10px', '14px'),
    textDecoration: 'none',
    color: tokens.colorNeutralForeground2,
    backgroundColor: 'transparent',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', 'transparent'),
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
    },
  },
  navLinkActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontWeight: '600',
    '&:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
  navLinkCollapsed: {
    justifyContent: 'center',
    ...shorthands.padding('10px'),
  },
  navIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  main: {
    flex: 1,
    ...shorthands.padding('24px'),
    overflow: 'auto',
    minHeight: 'calc(100vh - 60px)',
    '@media (max-width: 768px)': {
      ...shorthands.padding('16px'),
    },
  },
  themeToggle: {
    marginTop: 'auto',
    ...shorthands.padding('12px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    justifyContent: 'center',
  },
  brandIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: '24px',
  },
});

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactElement;
  iconFilled: React.ReactElement;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <BoardRegular />, iconFilled: <BoardFilled /> },
  { path: '/batch-records', label: 'Batch Records', icon: <DocumentBulletListRegular />, iconFilled: <DocumentBulletListFilled /> },
  { path: '/audit-trail', label: 'Audit Trail', icon: <HistoryRegular />, iconFilled: <HistoryFilled /> },
  { path: '/settings', label: 'Settings', icon: <SettingsRegular />, iconFilled: <SettingsFilled /> },
];

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/batch-records': 'Batch Records',
  '/audit-trail': 'Audit Trail',
  '/settings': 'Settings',
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const styles = useStyles();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, switchUser, allUsers } = useCurrentUser();

  const breadcrumbs = (() => {
    const crumbs = [{ path: '/', name: 'Home' }];
    const name = routeNames[location.pathname];
    if (name && location.pathname !== '/') {
      crumbs.push({ path: location.pathname, name });
    }
    return crumbs;
  })();

  const sidebarClassName = `${styles.sidebar} ${
    collapsed ? styles.sidebarCollapsed : ''
  } ${mobileMenuOpen ? styles.sidebarVisible : ''}`;

  const contentClassName = collapsed ? styles.contentCollapsed : styles.content;

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.appHeader}>
        <div className={styles.headerLeft}>
          <Button
            icon={<NavigationRegular />}
            appearance="subtle"
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileMenuOpen(!mobileMenuOpen);
              } else {
                setCollapsed(!collapsed);
              }
            }}
          />
          <ShieldCheckmarkRegular className={styles.brandIcon} />
          <Text weight="semibold" size={400}>
            21 CFR Part 11 Compliance
          </Text>
          <Breadcrumb aria-label="Breadcrumb" size="small">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {i > 0 && <BreadcrumbDivider />}
                <BreadcrumbItem>
                  {i === breadcrumbs.length - 1 ? (
                    <Text size={200} weight="semibold">{crumb.name}</Text>
                  ) : (
                    <Link to={crumb.path} style={{ textDecoration: 'none', color: tokens.colorBrandForeground1, fontSize: tokens.fontSizeBase200 }}>
                      {crumb.name}
                    </Link>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </Breadcrumb>
        </div>
        <div className={styles.headerRight}>
          <Popover withArrow>
            <PopoverTrigger disableButtonEnhancement>
              <div className={styles.profileButton}>
                <div className={styles.avatar}>
                  {currentUser.displayName.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <Text size={200} weight="semibold">{currentUser.displayName}</Text>
                  <Badge appearance="tint" color="brand" size="small" shape="rounded">{currentUser.role}</Badge>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverSurface>
              <div className={styles.popoverContent}>
                <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3 }}>Switch User</Text>
                {allUsers.map((u) => (
                  <div
                    key={u.id}
                    className={`${styles.userOption} ${u.id === currentUser.id ? styles.userOptionActive : ''}`}
                    onClick={() => switchUser(u.id)}
                  >
                    <div className={styles.avatar}>
                      {u.displayName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Text size={200} weight="semibold">{u.displayName}</Text>
                      <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>{u.role}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverSurface>
          </Popover>
          <Button
            icon={isDarkMode ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
            appearance="subtle"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          />
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <nav className={sidebarClassName}>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ''} ${
                    collapsed ? styles.navLinkCollapsed : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={styles.navIcon}>
                    {active ? item.iconFilled : item.icon}
                  </span>
                  {!collapsed && <Text size={300} weight={active ? 'semibold' : 'regular'}>{item.label}</Text>}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className={styles.themeToggle}>
          <Button
            icon={isDarkMode ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
            appearance="subtle"
            onClick={toggleTheme}
            size="small"
          />
        </div>
      </nav>

      {/* Main content */}
      <div className={contentClassName}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
