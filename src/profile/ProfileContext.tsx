import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '../auth/AuthContext';
import {
  getOrCreateProfile,
  saveProfileNickname,
  type UserProfile,
} from '../services/profileService';

type ProfileContextValue = {
  profile: UserProfile | null;
  nickname: string | null;
  isProfileLoading: boolean;
  profileError: boolean;
  refreshProfile: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
  clearProfile: () => void;
};

const ProfileContext =
  createContext<ProfileContextValue | null>(null);

export function ProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const [profile, setProfile] =
    useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] =
    useState(true);
  const [profileError, setProfileError] =
    useState(false);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);
    setProfileError(false);

    try {
      setProfile(await getOrCreateProfile());
    } catch (error) {
      console.error('Profile load failed:', error);
      setProfileError(true);
    } finally {
      setIsProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const updateNickname = useCallback(
    async (nickname: string) => {
      const updatedProfile =
        await saveProfileNickname(nickname);
      setProfile(updatedProfile);
      setProfileError(false);
    },
    [],
  );

  const clearProfile = useCallback(() => {
    setProfile(null);
    setProfileError(false);
    setIsProfileLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      nickname: profile?.nickname ?? null,
      isProfileLoading,
      profileError,
      refreshProfile,
      updateNickname,
      clearProfile,
    }),
    [
      isProfileLoading,
      profile,
      profileError,
      refreshProfile,
      updateNickname,
      clearProfile,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      'useProfile must be used inside ProfileProvider.',
    );
  }

  return context;
}
