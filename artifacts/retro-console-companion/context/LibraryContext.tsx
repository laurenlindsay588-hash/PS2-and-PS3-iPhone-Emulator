import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type GamePlatform = 'ps2' | 'ps3';

export interface GameEntry {
  id: string;
  title: string;
  platform: GamePlatform;
  fileName: string;
  addedAt: string;
}

export interface RemoteSetup {
  pcName: string;
  address: string;
}

interface LibraryContextValue {
  games: GameEntry[];
  isHydrated: boolean;
  storageError: boolean;
  remoteSetup: RemoteSetup;
  addGame: (game: GameEntry) => Promise<void>;
  removeGame: (id: string) => Promise<void>;
  saveRemoteSetup: (setup: RemoteSetup) => Promise<void>;
}

const GAMES_KEY = 'retroshelf.games.v1';
const REMOTE_KEY = 'retroshelf.remote.v1';
const emptyRemoteSetup: RemoteSetup = { pcName: '', address: '' };
const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: React.PropsWithChildren) {
  const [games, setGames] = useState<GameEntry[]>([]);
  const [remoteSetup, setRemoteSetup] = useState<RemoteSetup>(emptyRemoteSetup);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([AsyncStorage.getItem(GAMES_KEY), AsyncStorage.getItem(REMOTE_KEY)])
      .then(([storedGames, storedRemote]) => {
        if (!mounted) return;
        if (storedGames) {
          const parsed: unknown = JSON.parse(storedGames);
          if (!Array.isArray(parsed)) throw new Error('Invalid game library data');
          setGames(parsed as GameEntry[]);
        }
        if (storedRemote) {
          const parsedRemote: unknown = JSON.parse(storedRemote);
          if (parsedRemote && typeof parsedRemote === 'object' && 'pcName' in parsedRemote && 'address' in parsedRemote) {
            setRemoteSetup(parsedRemote as RemoteSetup);
          } else {
            throw new Error('Invalid remote setup data');
          }
        }
      })
      .catch(() => {
        if (mounted) setStorageError(true);
      })
      .finally(() => {
        if (mounted) setIsHydrated(true);
      });
    return () => { mounted = false; };
  }, []);

  const value = useMemo<LibraryContextValue>(() => ({
    games,
    isHydrated,
    storageError,
    remoteSetup,
    async addGame(game) {
      const next = [game, ...games];
      await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(next));
      setGames(next);
    },
    async removeGame(id) {
      const next = games.filter((game) => game.id !== id);
      await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(next));
      setGames(next);
    },
    async saveRemoteSetup(setup) {
      await AsyncStorage.setItem(REMOTE_KEY, JSON.stringify(setup));
      setRemoteSetup(setup);
    },
  }), [games, isHydrated, storageError, remoteSetup]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used inside LibraryProvider');
  return context;
}