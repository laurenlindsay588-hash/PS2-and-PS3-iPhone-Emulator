import { Feather } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export default function SetupScreen() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>DEVICE READINESS</Text>
      <Text style={styles.title}>Know what can run.</Text>
      <Text style={styles.subtitle}>A clear picture of the iPhone setup today, without promising an emulator this app doesn’t contain.</Text>

      <View style={styles.noticeCard}>
        <View style={styles.noticeIcon}><Feather name="info" size={19} color={colors.accentForeground} /></View>
        <View style={styles.noticeCopy}>
          <Text style={styles.noticeTitle}>RetroShelf is a companion, not an emulator core.</Text>
          <Text style={styles.noticeBody}>It organizes your files and setup notes. It does not execute game code, include console firmware, or install third-party emulator apps.</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>PLATFORM SUPPORT</Text>
      <View style={styles.platformCard}>
        <View style={styles.platformTop}>
          <View style={styles.consoleBadge}><Feather name="disc" size={19} color={colors.primary} /></View>
          <View style={styles.platformTitleBlock}>
            <Text style={styles.platformName}>PlayStation 2</Text>
            <Text style={styles.platformSub}>Local play needs a separate iOS-compatible emulator</Text>
          </View>
          <View style={styles.statePill}><Text style={styles.stateText}>NOT INCLUDED</Text></View>
        </View>
        <View style={styles.divider} />
        <ChecklistLine icon="check" text="Add and organize your own game files here" styles={styles} />
        <ChecklistLine icon="cpu" text="A compatible iPhone emulator core must be installed separately" styles={styles} />
        <ChecklistLine icon="shield" text="Use only game and firmware files you are legally entitled to use" styles={styles} />
      </View>

      <View style={styles.platformCard}>
        <View style={styles.platformTop}>
          <View style={[styles.consoleBadge, styles.ps3Badge]}><Feather name="disc" size={19} color={colors.accentForeground} /></View>
          <View style={styles.platformTitleBlock}>
            <Text style={styles.platformName}>PlayStation 3</Text>
            <Text style={styles.platformSub}>Remote streaming from your own PC is the practical route</Text>
          </View>
          <View style={[styles.statePill, styles.remotePill]}><Text style={[styles.stateText, styles.remoteText]}>REMOTE</Text></View>
        </View>
        <View style={styles.divider} />
        <ChecklistLine icon="wifi" text="Run a PS3 emulator on a capable computer you control" styles={styles} />
        <ChecklistLine icon="cast" text="Use a separate streaming client on iPhone" styles={styles} />
        <ChecklistLine icon="alert-triangle" text="This iPhone app cannot emulate PS3 games directly" styles={styles} />
      </View>

      <View style={styles.footerNote}>
        <Feather name="lock" size={15} color={colors.mutedForeground} />
        <Text style={styles.footerText}>Game files stay in your device’s Files app. RetroShelf never uploads them.</Text>
      </View>
    </ScrollView>
  );
}

function ChecklistLine({ icon, text, styles }: { icon: React.ComponentProps<typeof Feather>['name']; text: string; styles: ReturnType<typeof makeStyles> }) {
  const colors = useColors();
  return (
    <View style={styles.checkLine}>
      <Feather name={icon} size={14} color={colors.mutedForeground} />
      <Text style={styles.checkText}>{text}</Text>
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.background },
    content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 67 : 18, paddingBottom: Platform.OS === 'web' ? 108 : 112 },
    eyebrow: { color: c.primary, fontSize: 10, letterSpacing: 1.7, fontFamily: 'Inter_700Bold', marginBottom: 7 },
    title: { color: c.foreground, fontSize: 28, lineHeight: 34, fontFamily: 'Inter_700Bold' },
    subtitle: { color: c.mutedForeground, fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', marginTop: 8, marginBottom: 20, maxWidth: 330 },
    noticeCard: { flexDirection: 'row', gap: 12, padding: 15, borderRadius: 18, backgroundColor: c.accent, borderWidth: 1, borderColor: c.border, marginBottom: 24 },
    noticeIcon: { width: 33, height: 33, borderRadius: 11, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' },
    noticeCopy: { flex: 1 },
    noticeTitle: { color: c.foreground, fontSize: 13, lineHeight: 18, fontFamily: 'Inter_700Bold', marginBottom: 4 },
    noticeBody: { color: c.accentForeground, fontSize: 11, lineHeight: 17, fontFamily: 'Inter_400Regular' },
    sectionLabel: { color: c.mutedForeground, fontSize: 9, letterSpacing: 1.5, fontFamily: 'Inter_700Bold', marginBottom: 10 },
    platformCard: { padding: 15, borderRadius: 19, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, marginBottom: 12 },
    platformTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    consoleBadge: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.secondary, alignItems: 'center', justifyContent: 'center' },
    ps3Badge: { backgroundColor: c.accent },
    platformTitleBlock: { flex: 1, minWidth: 0 },
    platformName: { color: c.foreground, fontSize: 15, fontFamily: 'Inter_700Bold' },
    platformSub: { color: c.mutedForeground, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginTop: 3 },
    statePill: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: c.secondary },
    stateText: { color: c.mutedForeground, fontSize: 8, letterSpacing: 0.8, fontFamily: 'Inter_700Bold' },
    remotePill: { backgroundColor: c.accent },
    remoteText: { color: c.accentForeground },
    divider: { height: 1, backgroundColor: c.border, marginTop: 14, marginBottom: 10 },
    checkLine: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, paddingVertical: 7 },
    checkText: { flex: 1, color: c.cardForeground, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
    footerNote: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', paddingHorizontal: 4, paddingTop: 8 },
    footerText: { flex: 1, color: c.mutedForeground, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  });
}