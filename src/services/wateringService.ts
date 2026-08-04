import { supabase } from '../lib/supabase';

async function assertOwnedPlant(
  plantId: number,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error(
      '물주기 기록을 사용하려면 사용자 인증이 필요합니다.',
    );
  }

  const { data, error } = await supabase
    .from('plants')
    .select('id')
    .eq('id', plantId)
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    throw (
      error ??
      new Error('식물을 찾을 수 없습니다.')
    );
  }
}

export type WateringRecord = {
  id: number;
  plant_id: number;
  watered_at: string;
  note: string | null;
};

export async function addWateringRecord(
  plantId: number,
): Promise<WateringRecord> {
  await assertOwnedPlant(plantId);
  const { data, error } = await supabase
    .from('watering_history')
    .insert({
      plant_id: plantId,
    })
    .select('id, plant_id, watered_at, note')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteWateringRecord(
  wateringRecordId: number,
): Promise<void> {
  const { data: record, error: recordError } =
    await supabase
      .from('watering_history')
      .select('plant_id')
      .eq('id', wateringRecordId)
      .single();

  if (recordError) {
    throw recordError;
  }

  await assertOwnedPlant(record.plant_id);

  const { error } = await supabase
    .from('watering_history')
    .delete()
    .eq('id', wateringRecordId);

  if (error) {
    throw error;
  }
}

export async function getWateringHistory(
  plantId: number,
) {
  await assertOwnedPlant(plantId);
  const { data, error } = await supabase
    .from('watering_history')
    .select('id, watered_at')
    .eq('plant_id', plantId)
    .order('watered_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function setLastWateredAt(
  plantId: number,
  wateredAt: string | null,
): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error(
      '물주기 기록을 수정하려면 사용자 인증이 필요합니다.',
    );
  }

  const {
    data: ownedPlant,
    error: ownershipError,
  } = await supabase
    .from('plants')
    .select('id')
    .eq('id', plantId)
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .single();

  if (ownershipError || !ownedPlant) {
    throw (
      ownershipError ??
      new Error('식물을 찾을 수 없습니다.')
    );
  }

  const {
    data: latestRecords,
    error: latestRecordError,
  } = await supabase
    .from('watering_history')
    .select('id')
    .eq('plant_id', plantId)
    .order('watered_at', {
      ascending: false,
    })
    .limit(1);

  if (latestRecordError) {
    throw latestRecordError;
  }

  const latestRecordId =
    latestRecords?.[0]?.id ?? null;

  if (latestRecordId === null) {
    if (wateredAt === null) {
      return;
    }

    const { error } = await supabase
      .from('watering_history')
      .insert({
        plant_id: plantId,
        watered_at: wateredAt,
      });

    if (error) {
      throw error;
    }

    return;
  }

  if (wateredAt === null) {
    const { error } = await supabase
      .from('watering_history')
      .delete()
      .eq('id', latestRecordId);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase
    .from('watering_history')
    .update({
      watered_at: wateredAt,
    })
    .eq('id', latestRecordId);

  if (error) {
    throw error;
  }
}
