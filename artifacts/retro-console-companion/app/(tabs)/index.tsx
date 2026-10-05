import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { GameEntry, GamePlatform, useLibrary } from '@/context/LibraryContext';

const platformOptions: { value: GamePlatform; label: string }[] = [
  { value: 'ps2', label: 'PS2' },
  { value: 'ps3', label: 'PS3' },
];

export default function LibraryScreen() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { games, isHydrated, storageError, addGame, removeGame } = useLibrary();
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<GamePlatform | 'all'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<GamePlatform>('ps2');
  const [fileName, setFileName] = useState('');
  const [saving, setSaving] = useState(false);

  const visibleGames = games.filter((game) => {
    const matchesPlatform = selectedPlatform === 'all' || game.platform === selectedPlatform;
    const matchesSearch = `${game.title} ${game.fileName}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const openAdd = () => {
    setTitle('');
    setFileName('');
    setPlatform('ps2');
    setModalVisible(true);
  };

  const pickGameFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const file = result.assets[0];
      setFileName(file.name);
      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '));
      }
      const extension = file.name.toLowerCase().split('.').pop() ?? '';
      if (['pkg', 'rap', 'self', 'sprx'].includes(extension)) setPlatform('ps3');
      else if (['iso', 'bin', 'chd', 'cso', 'cue', 'nrg'].includes(extension)) setPlatform('ps2');
      await Haptics.selectionAsync();
    } catch {
      Alert.alert('Could not open file', 'Try choosing the game file again from Files.');
    }
  };

  const saveGame = async () => {
    if (!title.trim()) {
      Alert.alert('Add a title', 'Enter the game title before saving it to your library.');
      return;
    }
    setSaving(true);
    const entry: GameEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: title.trim(),
      platform,
      fileName: fileName.trim() || 'No file attached',
      addedAt: new Date().toISOString(),
    };
    try {
      await addGame(entry);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setModalVisible(false);
    } catch {
      Alert.alert('Could not save', 'Your library could not be saved. Check your device storage and try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = (game: GameEntry) => {
    Alert.alert('Remove from library?', `${game.title} will be removed from RetroShelf. The original file is not deleted.`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeGame(game.id);
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch {
            Alert.alert('Could not remove game', 'Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={visibleGames}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.topline}>
              <View>
                <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
                <Text style={styles.heading}>RetroShelf</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countNumber}>{games.length.toString().padStart(2, '0')}</Text>
                <Text style={styles.countCaption}>GAMES</Text>
              </View>
            </View>

            <View style={styles.heroCard}>
              <View style={styles.heroIcon}>
                <Feather name="disc" size={23} color={colors.primary} />
              </View>
              <Text style={styles.heroTitle}>Your games, organized.</Text>
              <Text style={styles.heroBody}>
                Keep track of your own game files and setup. RetroShelf organizes your collection; it does not run games or include BIOS files.
              </Text>
              <View style={styles.heroFoot}>
                <View style={styles.statusDot} />
                <Text style={styles.heroFootText}>PS2 setup guide · PS3 remote-play guide</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Game library</Text>
              <Pressable onPress={openAdd} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} testID="add-game">
                <Feather name="plus" size={16} color={colors.primaryForeground} />
                <Text style={styles.addButtonText}>Add game</Text>
              </Pressable>
            </View>

            <View style={styles.searchBox}>
              <Feather name="search" size={17} color={colors.mutedForeground} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search your library"
                placeholderTextColor={colors.mutedForeground}
                style={styles.searchInput}
                returnKeyType="search"
                accessibilityLabel="Search games"
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery('')} hitSlop={10}>
                  <Feather name="x-circle" size={17} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>

            <View style={styles.filters}>
              {(['all', 'ps2', 'ps3'] as const).map((filter) => {
                const selected = selectedPlatform === filter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setSelectedPlatform(filter)}
                    style={[styles.filterChip, selected && styles.filterChipSelected]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                      {filter === 'all' ? 'All games' : filter.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {storageError ? (
              <View style={styles.warningBox}>
                <Feather name="alert-circle" size={17} color={colors.destructive} />
                <Text style={styles.warningText}>Library storage could not be read. Restart the app and try again.</Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !isHydrated ? (
            <View style={styles.emptyState}><ActivityIndicator color={colors.primary} /></View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}><Feather name={query ? 'search' : 'archive'} size={23} color={colors.mutedForeground} /></View>
              <Text style={styles.emptyTitle}>{query ? 'No matches' : 'Your shelf is empty'}</Text>
              <Text style={styles.emptyBody}>{query ? 'Try a different search or platform filter.' : 'Add a game file you own to start organizing your collection.'}</Text>
              {!query && <Pressable style={styles.emptyAction} onPress={openAdd}><Text style={styles.emptyActionText}>Add your first game</Text></Pressable>}
            </View>
          )
        }
        renderItem={({ item }) => <GameRow game={item} onRemove={() => confirmRemove(item)} styles={styles} />}
        scrollEnabled
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalRoot}>
          <Pressable style={styles.modalScrim} onPress={() => setModalVisible(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeadingRow}>
              <View>
                <Text style={styles.eyebrow}>PERSONAL LIBRARY</Text>
                <Text style={styles.modalTitle}>Add a game</Text>
              </View>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton} accessibilityLabel="Close">
                <Feather name="x" size={19} color={colors.foreground} />
              </Pressable>
            </View>
            <Text style={styles.inputLabel}>GAME TITLE</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Shadow of the Colossus"
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel="Game title"
              autoCapitalize="words"
            />
            <Text style={styles.inputLabel}>CONSOLE</Text>
            <View style={styles.platformRow}>
              {platformOptions.map((option) => {
                const active = platform === option.value;
                return (
                  <Pressable key={option.value} onPress={() => setPlatform(option.value)} style={[styles.platformOption, active && styles.platformOptionActive]}>
                    <Text style={[styles.platformOptionText, active && styles.platformOptionTextActive]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable style={styles.filePicker} onPress={pickGameFile} testID="choose-game-file">
              <Feather name="folder" size={18} color={colors.primary} />
              <View style={styles.filePickerText}>
                <Text style={styles.filePickerTitle}>{fileName || 'Choose a game file'}</Text>
                <Text style={styles.filePickerHint}>Optional · stored on your device, not uploaded</Text>
              </View>
              <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
            </Pressable>
            <View style={styles.modalNotice}>
              <Feather name="info" size={15} color={colors.accentForeground} />
              <Text style={styles.modalNoticeText}>This adds a library entry only. It does not launch or emulate the selected game.</Text>
            </View>
            <Pressable disabled={saving} style={({ pressed }) => [styles.saveButton, pressed && styles.pressed, saving && styles.disabled]} onPress={saveGame} testID="save-game">
              {saving ? <ActivityIndicator color={colors.primaryForeground} /> : <Text style={styles.saveButtonText}>Save to library</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function GameRow({ game, onRemove, styles }: { game: GameEntry; onRemove: () => void; styles: ReturnType<typeof makeStyles> }) {
  const colors = useColors();
  return (
    <View style={styles.gameRow}>
      <View style={[styles.gameDisc, game.platform === 'ps3' && styles.gameDiscPs3]}>
        <Feather name="disc" size={21} color={game.platform === 'ps3' ? colors.accentForeground : colors.primary} />
      </View>
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle} numberOfLines={1}>{game.title}</Text>
        <Text style={styles.gameMeta} numberOfLines={1}>{game.platform.toUpperCase()} · {game.fileName}</Text>
      </View>
      <Pressable onPress={onRemove} hitSlop={10} style={styles.removeButton} accessibilityLabel={`Remove ${game.title}`}>
        <Feather name="more-horizontal" size={20} color={colors.mutedForeground} />
      </Pressable>
    </View>
  );
}

function makeStyles(c: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.background },
    listContent: { paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 67 : 12, paddingBottom: Platform.OS === 'web' ? 108 : 110, flexGrow: 1 },
    topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 19 },
    eyebrow: { color: c.primary, fontSize: 10, letterSpacing: 1.7, fontFamily: 'Inter_700Bold' },
    heading: { color: c.foreground, fontSize: 30, lineHeight: 36, fontFamily: 'Inter_700Bold', marginTop: 3 },
    countBadge: { alignItems: 'center', justifyContent: 'center', width: 54, height: 54, borderRadius: 18, backgroundColor: c.secondary, borderWidth: 1, borderColor: c.border },
    countNumber: { color: c.foreground, fontSize: 16, fontFamily: 'Inter_700Bold' },
    countCaption: { color: c.mutedForeground, fontSize: 8, letterSpacing: 1, fontFamily: 'Inter_700Bold', marginTop: 1 },
    heroCard: { padding: 18, backgroundColor: c.card, borderColor: c.border, borderWidth: 1, borderRadius: 22, marginBottom: 24 },
    heroIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.secondary, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    heroTitle: { fontSize: 20, color: c.cardForeground, fontFamily: 'Inter_700Bold', marginBottom: 7 },
    heroBody: { fontSize: 13, lineHeight: 19, color: c.mutedForeground, fontFamily: 'Inter_400Regular' },
    heroFoot: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 13, borderTopWidth: 1, borderTopColor: c.border },
    statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: c.primary, marginRight: 8 },
    heroFootText: { color: c.foreground, fontSize: 11, fontFamily: 'Inter_500Medium' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
    sectionTitle: { color: c.foreground, fontSize: 19, fontFamily: 'Inter_700Bold' },
    addButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 13, backgroundColor: c.primary },
    addButtonText: { color: c.primaryForeground, fontSize: 12, fontFamily: 'Inter_700Bold' },
    pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
    searchBox: { height: 46, borderRadius: 14, borderWidth: 1, borderColor: c.border, backgroundColor: c.card, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 13 },
    searchInput: { flex: 1, color: c.foreground, fontSize: 13, fontFamily: 'Inter_400Regular', paddingVertical: 0 },
    filters: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 14 },
    filterChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 12, backgroundColor: c.secondary, borderWidth: 1, borderColor: c.border },
    filterChipSelected: { backgroundColor: c.primary, borderColor: c.primary },
    filterText: { color: c.mutedForeground, fontSize: 11, fontFamily: 'Inter_600SemiBold' },
    filterTextSelected: { color: c.primaryForeground },
    warningBox: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12, borderRadius: 13, backgroundColor: c.accent, marginBottom: 12 },
    warningText: { flex: 1, color: c.accentForeground, fontSize: 12, lineHeight: 17, fontFamily: 'Inter_500Medium' },
    emptyState: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 28, flex: 1 },
    emptyIcon: { width: 56, height: 56, borderRadius: 19, backgroundColor: c.secondary, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    emptyTitle: { color: c.foreground, fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 6 },
    emptyBody: { color: c.mutedForeground, fontSize: 12, lineHeight: 18, textAlign: 'center', fontFamily: 'Inter_400Regular', maxWidth: 260 },
    emptyAction: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 12, backgroundColor: c.primary },
    emptyActionText: { color: c.primaryForeground, fontFamily: 'Inter_700Bold', fontSize: 12 },
    gameRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: c.border },
    gameDisc: { width: 46, height: 46, borderRadius: 15, backgroundColor: c.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    gameDiscPs3: { backgroundColor: c.accent },
    gameInfo: { flex: 1, minWidth: 0 },
    gameTitle: { color: c.foreground, fontSize: 14, fontFamily: 'Inter_600SemiBold' },
    gameMeta: { color: c.mutedForeground, fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 4 },
    removeButton: { padding: 8 },
    modalRoot: { flex: 1, justifyContent: 'flex-end' },
    modalScrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.56)' },
    modalCard: { backgroundColor: c.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingBottom: Platform.OS === 'web' ? 34 : 30, paddingTop: 10, borderWidth: 1, borderColor: c.border },
    modalHandle: { width: 38, height: 4, borderRadius: 2, backgroundColor: c.mutedForeground, opacity: 0.55, alignSelf: 'center', marginBottom: 18 },
    modalHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { color: c.foreground, fontSize: 24, fontFamily: 'Inter_700Bold', marginTop: 4 },
    closeButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: c.secondary, alignItems: 'center', justifyContent: 'center' },
    inputLabel: { color: c.mutedForeground, fontSize: 9, letterSpacing: 1.4, fontFamily: 'Inter_700Bold', marginBottom: 8, marginTop: 3 },
    textInput: { height: 48, borderWidth: 1, borderColor: c.input, borderRadius: 13, paddingHorizontal: 13, color: c.foreground, backgroundColor: c.card, fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 16 },
    platformRow: { flexDirection: 'row', gap: 9, marginBottom: 17 },
    platformOption: { flex: 1, height: 43, borderRadius: 13, borderWidth: 1, borderColor: c.border, backgroundColor: c.secondary, alignItems: 'center', justifyContent: 'center' },
    platformOptionActive: { borderColor: c.primary, backgroundColor: c.primary },
    platformOptionText: { color: c.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 13 },
    platformOptionTextActive: { color: c.primaryForeground },
    filePicker: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 14, marginBottom: 13 },
    filePickerText: { flex: 1, minWidth: 0 },
    filePickerTitle: { color: c.foreground, fontSize: 12, fontFamily: 'Inter_600SemiBold' },
    filePickerHint: { color: c.mutedForeground, fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 4 },
    modalNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: c.accent, borderRadius: 12, padding: 11, marginBottom: 15 },
    modalNoticeText: { flex: 1, color: c.accentForeground, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_500Medium' },
    saveButton: { height: 49, borderRadius: 14, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
    saveButtonText: { color: c.primaryForeground, fontSize: 14, fontFamily: 'Inter_700Bold' },
    disabled: { opacity: 0.5 },
  });
}