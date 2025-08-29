export type RecommendReq = {
  age: number;
  sex: '남성' | '여성' | '기타';
  height_cm: number;
  weight_kg: number;
  schedule: string[];
};

const examplePayload: RecommendReq = {
  age: 28,
  sex: '남성',
  height_cm: 177,
  weight_kg: 72,
  schedule: ['야근', '야구'],
};
// payload: RecommendReq
export const getRecommendations = async (payload: RecommendReq) => {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recommend-supplements`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      //body: JSON.stringify(examplePayload),
    },
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // JSON 스키마와 동일한 객체
};
