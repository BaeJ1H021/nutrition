import { useProfileStore } from '../states/ProfileStore';
import { supabase } from './supabase';

export const saveProfileToDBAPI = async () => {
  const { gender, birthday, height, weight } = useProfileStore.getState();

  // 현재 로그인한 유저 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('유저 정보를 가져올 수 없습니다.');
  }

  const { error } = await supabase.from('user_profiles').upsert([
    {
      user_id: user.id,
      gender,
      birthday,
      height,
      weight,
    },
  ]);

  if (error) {
    throw new Error('프로필 저장 실패: ' + error.message);
  }
};
