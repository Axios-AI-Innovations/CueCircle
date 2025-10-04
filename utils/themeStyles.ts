import { StyleSheet } from 'react-native';
import { Theme } from '@/contexts/ThemeContext';

// Memoize the style creation to prevent weak map key issues
const styleCache = new Map<string, any>();

export const createThemedStyles = (theme: Theme) => {
  // Create a cache key based on theme properties
  const cacheKey = `${theme.name}-${JSON.stringify(theme.colors)}`;
  
  if (styleCache.has(cacheKey)) {
    return styleCache.get(cacheKey);
  }
  
  // Create styles as plain objects to avoid StyleSheet.create weak map issues
  const styles = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: theme.colors.background,
  },
  
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
  },
  
  // Card styles
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0 2px 4px ${theme.colors.text}20`,
    elevation: 2,
  },
  
  // Text styles
  text: {
    color: theme.colors.text,
    fontSize: 16,
  },
  
  textSecondary: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  
  textMuted: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  
  textLarge: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  
  textMedium: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Button styles
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonSecondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  
  buttonTextSecondary: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  
  warningText: {
    color: theme.colors.warning,
    fontSize: 14,
    fontWeight: '500',
  },
  
  successText: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '500',
  },
  
  accentText: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  
  iconColor: {
    color: theme.colors.textMuted,
  },
  
  // Input styles
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  
  // List styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0 1px 2px ${theme.colors.text}10`,
    elevation: 1,
  },
  
  // Section styles
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  
  // Status styles
  success: {
    color: theme.colors.success,
  },
  
  warning: {
    color: theme.colors.warning,
  },
  
  error: {
    color: theme.colors.error,
  },
  
  // Icon styles
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  // Avatar styles
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  // Stats styles
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: `0 2px 4px ${theme.colors.text}20`,
  },
  
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  
  // Switch styles
  switchTrack: {
    false: theme.colors.border,
    true: theme.colors.success,
  },
  
  switchThumb: theme.colors.surface,
  
  // Setting styles
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  
  settingDescription: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  
  fontIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  
  // Divider styles
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },
  
  // Pod page styles
  emptyPodContainer: {
    padding: 40,
    alignItems: 'center',
  },
  
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  
  emptyText: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 300,
  },
  
  joinOptions: {
    width: '100%',
    gap: 20,
  },
  
  optionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    boxShadow: `0 2px 4px ${theme.colors.text}20`,
  },
  
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  
  optionDescription: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 16,
  },
  
  codeInput: {
    backgroundColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
  
  joinButton: {
    backgroundColor: theme.colors.success,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  
  joinButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  
  createButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
  createButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  
  podIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.success}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  
  podCount: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  
  inviteSection: {
    backgroundColor: theme.colors.surface,
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    boxShadow: `0 2px 4px ${theme.colors.text}20`,
  },
  
  inviteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  
  inviteCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  
  inviteCode: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  
  copyButton: {
    padding: 8,
  },
  
  inviteDescription: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  
  partnerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
    boxShadow: `0 2px 4px ${theme.colors.text}20`,
  },
  
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  avatarText: {
    color: theme.colors.surface,
    fontSize: 20,
    fontWeight: '700',
  },
  
  partnerInfo: {
    flex: 1,
  },
  
  partnerName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  
  partnerStatus: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  
  streakBadge: {
    backgroundColor: `${theme.colors.warning}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  
  streakText: {
    color: theme.colors.warning,
    fontSize: 14,
    fontWeight: '600',
  },
  
  partnerProgress: {
    gap: 8,
  },
  
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  
  progressText: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '500',
  },
  
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  
  actionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 16,
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.success,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
  actionButtonText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  
  bodyDoubleExplainer: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  
  recentActivity: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  
  activityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 16,
  },
  
  activityList: {
    gap: 16,
  },
  
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    boxShadow: `0 2px 4px ${theme.colors.text}20`,
  },
  
  activityText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  
  activityUser: {
    fontWeight: '600',
    color: theme.colors.success,
  },
  
  activityTime: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  
  managementSection: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  
  managementTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 16,
  },
  
  managementActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  managementButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: `0 2px 4px ${theme.colors.text}20`,
  },
  
  managementButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  
  disabledButton: {
    opacity: 0.6,
  },
  
  activeBodyDouble: {
    backgroundColor: theme.colors.success,
    opacity: 0.8,
  },
  
  bodyDoubleTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.accent}20`,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.accent,
    fontFamily: 'monospace',
  },
  
  timerLabel: {
    fontSize: 14,
    color: theme.colors.textMuted,
    flex: 1,
  },

  // Habits page specific styles
  content: {
    flex: 1,
    padding: 20,
  },
  
  habitsContainer: {
    gap: 12,
  },
  
  startButton: {
    backgroundColor: theme.colors.success,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  
  startButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  closeButton: {
    padding: 8,
  },

  // Footer styles
  footer: {
    padding: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  
  versionText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  
  // Home screen specific styles
  scrollView: {
    flex: 1,
  },
  
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: `0 4px 8px ${theme.colors.text}20`,
    elevation: 4,
  },
  
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  
  progressText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  
  habitsSection: {
    marginBottom: 24,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  addButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  
  emptyState: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  
  emptyText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  habitsList: {
    gap: 12,
  },
  
  viewAllButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  
  viewAllText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  quickActions: {
    marginBottom: 24,
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: `0 2px 4px ${theme.colors.text}20`,
    elevation: 2,
  },
  
  actionButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  
  modeSection: {
    marginBottom: 24,
  },
  
  modeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  
  modeButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  activeModeButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  
  modeButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  
  activeModeButtonText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  
  modeDescription: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  
  adhdStatus: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  
  adhdStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  
  adhdStatusText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
  };
  
  // Cache the styles
  styleCache.set(cacheKey, styles);
  return styles;
};
