import { supabase } from '../lib/supabase';

export const PROFILE_NICKNAME_MAX_LENGTH = 30;

export type UserProfile = {
  userId: string;
  nickname: string | null;
};

type ProfileRow = {
  user_id: string;
  nickname: string | null;
};

async function getCurrentUserId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error('PROFILE_AUTH_REQUIRED');
  }

  return session.user.id;
}

function toUserProfile(row: ProfileRow): UserProfile {
  return {
    userId: row.user_id,
    nickname: row.nickname,
  };
}

async function selectOwnProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, nickname')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as ProfileRow | null;
}

export async function getOrCreateProfile(): Promise<UserProfile> {
  const userId = await getCurrentUserId();
  const existingProfile = await selectOwnProfile(userId);

  if (existingProfile) {
    return toUserProfile(existingProfile);
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({ user_id: userId })
    .select('user_id, nickname')
    .single();

  if (!error) {
    return toUserProfile(data as ProfileRow);
  }

  if (error.code === '23505') {
    const concurrentProfile =
      await selectOwnProfile(userId);

    if (concurrentProfile) {
      return toUserProfile(concurrentProfile);
    }
  }

  throw error;
}

export async function saveProfileNickname(
  nickname: string,
): Promise<UserProfile> {
  const userId = await getCurrentUserId();
  const normalizedNickname = nickname.trim();

  if (!normalizedNickname) {
    throw new Error('PROFILE_NICKNAME_REQUIRED');
  }

  if (
    normalizedNickname.length >
    PROFILE_NICKNAME_MAX_LENGTH
  ) {
    throw new Error('PROFILE_NICKNAME_TOO_LONG');
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        user_id: userId,
        nickname: normalizedNickname,
      },
      { onConflict: 'user_id' },
    )
    .select('user_id, nickname')
    .single();

  if (error) {
    throw error;
  }

  return toUserProfile(data as ProfileRow);
}
