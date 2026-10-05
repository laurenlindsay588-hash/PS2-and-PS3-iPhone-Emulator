import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLibrary } from '@/context/LibraryContext';
import { useColors } from '@/hooks/useColors';

export default function RemoteScreen() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { remoteSetup, isHydrated, saveRemoteSetup } = useLibrary();
  const [pcName, setPcName] = useState(remoteSetup.pcName);
  const [address, setAddress] = useState(remoteSetup.address);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      setPcName(remoteSetup.pcName);
      setAddress(remoteSetup.address);
    }
  }, [isHydrated, remoteSetup]);

  const save = async () => {
    if (address.trim() && !/^[a-zA-Z0-9.-]+(:\d{1,5})?$/.test(address.trim())) {
      Alert.alert('Check the host address', 'Use a local address such as 192.168.1.20 or a hostname. Do not include http://.');
      return;
    }
    setSaving(true);
    try {
      await saveRemoteSetup({ pcName: pcName.trim(), address: address.trim() });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved', 'Your remote host details are saved on this device.');
    } catch {
      Alert.alert('Could not save', 'Remote setup could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>REMOTE PLAY</Text>
        <Text style={styles.title}>Bring your PC along.</Text>
        <Text style={styles.subtitle}>PS3 games need to run on a capable computer. Save its details here, then use a separate streaming client on your iPhone.</Text>

        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}><Feather name="wifi" size={20} color={colors.primary} /></View>
            <View style={styles.statusTag}><View style={styles.statusDot} /><Text style={styles.statusText}>REMOTE ONLY</Text></View>
          </View>
          <Text style={styles.heroTitle}>Not connected</Text>
          <Text style={styles.heroBody}>RetroShelf stores your host information, but does not stream or launch games.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Your gaming PC</Text>
          <Text style={styles.inputLabel}>DEVICE NAME</Text>
          <TextInput value={pcName} onChangeText={setPcName} placeholder="e.g. Living room PC" placeholderTextColor={colors.mutedForeground} style={styles.input} accessibilityLabel="Device name" />
          <Text style={styles.inputLabel}>LOCAL ADDRESS</Text>
          <TextInput value={address} onChangeText={setAddress} placeholder="192.168.1.20" placeholderTextColor={colors.mutedForeground} autoCapitalize="none" autoCorrect={false} style={styles.input} accessibilityLabel="Local network address" />
          <Text style={styles.formHint}>Saved only on this iPhone. Don’t enter passwords or access tokens.</Text>
          <Pressable style={({ pressed }) => [styles.saveButton, pressed && styles.pressed, saving && styles.disabled]} onPress={save} disabled={saving} testID="save-remote">
            <Feather name="save" size={16} color={colors.primaryForeground} />
            <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save host details'}</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>HOW REMOTE PLAY WORKS</Text>
        <View style={styles.stepRow}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>01</Text></View>
          <View style={styles.stepCopy}><Text style={styles.stepTitle}>Set up your own PC</Text><Text style={styles.stepBody}>Install a PS3 emulator from its official source and provide your own legally obtained game files.</Text></View>
        </View>
        <View style={styles.stepRow}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>02</Text></View>
          <View style={styles.stepCopy}><Text style={styles.stepTitle}>Connect on the same network</Text><Text style={styles.stepBody}>Use a separate iOS streaming app that supports your computer’s streaming setup.</Text></View>
        </View>
        <View style={[styles.stepRow, styles.lastStep]}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>03</Text></View>
          <View style={styles.stepCopy}><Text style={styles.stepTitle}>Use a controller</Text><Text style={styles.stepBody}>Pair a compatible Bluetooth controller with iPhone in iOS Settings.</Text></View>
        </View>

        <View style={styles.legalNote}>
          <Feather name="shield" size={15} color={colors.mutedForeground} />
          <Text style={styles.legalText}>Only use game and firmware files you are legally entitled to use. RetroShelf does not provide downloads.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    flex: { flex: 1 },
    screen: { flex: 1, backgroundColor: c.background },
    content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 67 : 18, paddingBottom: Platform.OS === 'web' ? 108 : 112 },
    eyebrow: { color: c.primary, fontSize: 10, letterSpacing: 1.7, fontFamily: 'Inter_700Bold', marginBottom: 7 },
    title: { color: c.foreground, fontSize: 28, lineHeight: 34, fontFamily: 'Inter_700Bold' },
    subtitle: { color: c.mutedForeground, fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', marginTop: 8, marginBottom: 19 },
    hero: { backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 20, padding: 17, marginBottom: 15 },
    heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 17 },
    heroIcon: { width: 41, height: 41, borderRadius: 14, backgroundColor: c.secondary, alignItems: 'center', justifyContent: 'center' },
    statusTag: { flexDirection: 'row', gap: 7, alignItems: 'center', backgroundColor: c.accent, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 7 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accentForeground },
    statusText: { color: c.accentForeground, fontSize: 8, letterSpacing: 0.8, fontFamily: 'Inter_700Bold' },
    heroTitle: { color: c.foreground, fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 5 },
    heroBody: { color: c.mutedForeground, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
    formCard: { backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 20, padding: 16, marginBottom: 24 },
    cardTitle: { color: c.foreground, fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 16 },
    inputLabel: { color: c.mutedForeground, fontSize: 9, letterSpacing: 1.4, fontFamily: 'Inter_700Bold', marginBottom: 7 },
    input: { height: 46, borderWidth: 1, borderColor: c.input, borderRadius: 12, color: c.foreground, backgroundColor: c.background, paddingHorizontal: 12, fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 13 },
    formHint: { color: c.mutedForeground, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginBottom: 13 },
    saveButton: { height: 46, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: c.primary },
    saveText: { color: c.primaryForeground, fontSize: 12, fontFamily: 'Inter_700Bold' },
    pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
    disabled: { opacity: 0.55 },
    sectionLabel: { color: c.mutedForeground, fontSize: 9, letterSpacing: 1.5, fontFamily: 'Inter_700Bold', marginBottom: 12 },
    stepRow: { flexDirection: 'row', gap: 12, paddingBottom: 17 },
    lastStep: { paddingBottom: 7 },
    stepNumber: { width: 34, height: 34, borderRadius: 12, backgroundColor: c.secondary, alignItems: 'center', justifyContent: 'center' },
    stepNumberText: { color: c.primary, fontSize: 10, fontFamily: 'Inter_700Bold' },
    stepCopy: { flex: 1, paddingTop: 1 },
    stepTitle: { color: c.foreground, fontSize: 12, fontFamily: 'Inter_700Bold', marginBottom: 4 },
    stepBody: { color: c.mutedForeground, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular' },
    legalNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderTopWidth: 1, borderTopColor: c.border, marginTop: 13, paddingTop: 15 },
    legalText: { flex: 1, color: c.mutedForeground, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  });
}