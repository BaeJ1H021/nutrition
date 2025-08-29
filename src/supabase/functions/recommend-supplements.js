// supabase/functions/recommend-supplements/index.ts
// Deno + Supabase Edge Functions + OpenAI Chat Completions
// 결과: ["타우린","비타민C","오메가-3"] 처럼 "문자열 배열(1~4개)"만 반환
// 다양성 전략: 카테고리 버킷/넓은 후보/태그 기반 후보/셔플/샘플링 가중 + 최근결과 회피(옵션)
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import OpenAI from 'npm:openai@4.56.1';
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
// ---------- 유틸 ----------
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function uniq(arr) {
  return Array.from(new Set(arr));
}
// ---------- 카테고리 버킷(안전/일반 웰니스 범위 위주) ----------
const BUCKETS = {
  '멀티/기본': ['멀티비타민', '종합미네랄', '전해질', '식이섬유(이눌린)'],
  비타민: [
    '비타민D',
    '비타민C',
    '비타민E',
    '비타민K2',
    '베타카로틴',
    '비오틴',
    '엽산(메틸폴레이트)',
  ],
  미네랄: ['마그네슘', '아연', '셀레늄', '칼슘', '칼륨'],
  '오메가/지질': ['오메가-3', '크릴오일', 'DHA', 'EPA'],
  '아미노/에너지': [
    'BCAA',
    '타우린',
    '아세틸-L-카르니틴(ALCAR)',
    'L-카르니틴',
    'L-테아닌',
  ],
  '장/프로바이오틱스': [
    '프로바이오틱스',
    '프리바이오틱스',
    '유산균(락토바실러스)',
    '베타글루칸',
  ],
  '간/해독': ['밀크시슬(실리마린)', 'N-아세틸시스테인(NAC)'],
  '눈/피부': ['루테인', '제아잔틴', '아스타잔틴', '히알루론산'],
  '관절/뼈': ['MSM', '글루코사민', '콘드로이틴', '콜라겐펩타이드'],
  '적응/스트레스': ['아슈와간다', '로디올라', '진생(인삼)', 'L-테아닌'],
  '순환/인지': [
    '코엔자임Q10',
    '레스베라트롤',
    '징코(은행잎)',
    '카테킨(녹차추출)',
  ],
};
// 일정 → 태그 매핑
const TAG_TO_BUCKETS = {
  운동: ['아미노/에너지', '오메가/지질', '미네랄'],
  회복: ['아미노/에너지', '오메가/지질'],
  수면부족: ['적응/스트레스', '미네랄'],
  집중: ['순환/인지', '오메가/지질'],
  눈피로: ['눈/피부', '오메가/지질'],
  좌식: ['오메가/지질', '비타민'],
};
function tagsFromSchedule(schedule = []) {
  const set = new Set();
  for (const raw of schedule) {
    const s = String(raw).toLowerCase();
    if (s.includes('야구')) (set.add('운동'), set.add('회복'));
    if (s.includes('야근')) set.add('수면부족');
    if (s.includes('영화')) (set.add('좌식'), set.add('눈피로'));
    if (s.includes('독서'))
      (set.add('좌식'), set.add('눈피로'), set.add('집중'));
  }
  return Array.from(set);
}
// BMI 분류(라이트 가중치용)
function bmiClass(hCm, wKg) {
  const h = hCm / 100;
  const bmi = wKg / (h * h);
  if (bmi < 18.5)
    return {
      bmi,
      cls: '저체중',
    };
  if (bmi < 25)
    return {
      bmi,
      cls: '정상',
    };
  if (bmi < 30)
    return {
      bmi,
      cls: '과체중',
    };
  return {
    bmi,
    cls: '비만',
  };
}
// 태그 기반 + 기본 버킷 기반 후보 풀 만들기
function buildAllowed(tags) {
  const wantedBuckets = new Set();
  for (const t of tags) {
    for (const b of TAG_TO_BUCKETS[t] ?? []) wantedBuckets.add(b);
  }
  // 항상 포함하고 싶은 기본 버킷
  ['멀티/기본', '비타민', '미네랄', '오메가/지질'].forEach((b) =>
    wantedBuckets.add(b),
  );
  const pool = [];
  for (const b of wantedBuckets) {
    pool.push(...(BUCKETS[b] ?? []));
  }
  // 다양성 강화를 위해 다른 버킷에서도 일부만 보충
  Object.keys(BUCKETS).forEach((b) => {
    if (!wantedBuckets.has(b)) pool.push(...(BUCKETS[b]?.slice(0, 2) ?? []));
  });
  return shuffle(uniq(pool)).slice(0, 24); // 과도한 후보 방지
}
// 간단 정규화
function normalizeNames(list) {
  const norm = list.map((s) =>
    s
      .trim()
      .replace(/\s+/g, '') // "비타민 B" -> "비타민B"
      .replace(/coq\s*10|코엔자임\s*q\s*10/gi, '코엔자임Q10')
      .replace(/omega[-\s]*3/gi, '오메가-3'),
  );
  const out = [];
  const seen = new Set();
  for (const n of norm) {
    const key = n.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(n);
    }
    if (out.length >= 4) break;
  }
  return out;
}
serve(async (req) => {
  // CORS 프리플라이트
  if (req.method === 'OPTIONS')
    return new Response('ok', {
      headers: cors(),
    });
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: corsJson(),
      });
    }
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'Missing OPENAI_API_KEY',
        }),
        {
          status: 500,
          headers: corsJson(),
        },
      );
    }
    // 요청 스키마 (lastSelected는 선택)
    const {
      age,
      sex,
      height_cm,
      weight_kg,
      schedule = [],
      lastSelected = [],
    } = await req.json();
    // 최소 검증
    if (
      typeof age !== 'number' ||
      !sex ||
      typeof height_cm !== 'number' ||
      typeof weight_kg !== 'number'
    ) {
      return new Response(
        JSON.stringify({
          error: 'invalid payload',
        }),
        {
          status: 400,
          headers: corsJson(),
        },
      );
    }
    // 태그/후보 생성
    const tags = tagsFromSchedule(schedule);
    const { cls } = bmiClass(height_cm, weight_kg);
    let allowed = buildAllowed(tags);
    // (선택) 최근 결과 회피: lastSelected 제외
    if (Array.isArray(lastSelected) && lastSelected.length) {
      const deny = new Set(lastSelected.map((s) => s.toLowerCase()));
      allowed = allowed.filter((x) => !deny.has(x.toLowerCase()));
      if (allowed.length < 6) {
        // 너무 줄어들면 풀 보충
        allowed = uniq([...allowed, ...buildAllowed(tags)]);
      }
    }
    // OpenAI 클라이언트 (지연 생성)
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    // 프롬프트
    const system = `
너는 보수적이고 안전한 웰니스 영양제 코치다.
JSON만 출력한다. 설명/코드블록 금지.
규칙:
- 아래 allowed 배열(영양제 이름 문자열)에서만 1~4개를 고른다(리스트 밖 금지).
- 선택된 영양제들은 '서로 다른 카테고리'에서 오도록 구성한다(가능하면 최소 3개 다른 카테고리).
- 동일 카테고리에서 2개 이상 선택 금지.
- 과도하게 반복되는 조합(비타민B/마그네슘/오메가-3/비타민D)만으로 구성하지 말 것.
- 이름만 출력한다(용량/설명 없음).
출력 형식(엄격): {"supplements":["..."]}
`.trim();
    const user = `
입력:
- 나이: ${age}
- 성별: ${sex}
- 키: ${height_cm} cm
- 몸무게: ${weight_kg} kg
- 일정: ${JSON.stringify(schedule)}
- 태그: ${tags.join(', ') || '없음'}
- BMI 분류: ${cls}
- allowed: ${JSON.stringify(allowed)}
요청:
- allowed에서만 1~4개 선택하여 {"supplements":[...]}로 응답.
`.trim();
    // Chat Completions + JSON Schema(객체 래핑)로 강제
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.9,
      top_p: 0.95,
      presence_penalty: 0.8,
      frequency_penalty: 0.3,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'SupplementNamesObject',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              supplements: {
                type: 'array',
                items: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 60,
                },
                minItems: 1,
                maxItems: 4,
              },
            },
            required: ['supplements'],
          },
        },
      },
      messages: [
        {
          role: 'system',
          content: system,
        },
        {
          role: 'user',
          content: user,
        },
      ],
    });
    let content =
      completion?.choices?.[0]?.message?.content ?? `{"supplements":[]}`;
    content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    // 파싱
    let obj;
    try {
      obj = JSON.parse(content);
    } catch {
      return new Response(
        JSON.stringify({
          error: 'LLM output is not valid JSON',
        }),
        {
          status: 500,
          headers: corsJson(),
        },
      );
    }
    const list = obj?.supplements;
    if (!Array.isArray(list)) {
      return new Response(
        JSON.stringify({
          error: "Output does not contain 'supplements' array",
        }),
        {
          status: 500,
          headers: corsJson(),
        },
      );
    }
    // 정규화 + 중복 제거 + 최대 4개
    const out = normalizeNames(list);
    if (out.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Empty result',
        }),
        {
          status: 500,
          headers: corsJson(),
        },
      );
    }
    return new Response(JSON.stringify(out), {
      status: 200,
      headers: corsJson(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({
        error: msg,
      }),
      {
        status: 500,
        headers: corsJson(),
      },
    );
  }
});
// CORS helpers
function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}
function corsJson() {
  return {
    ...cors(),
    'Content-Type': 'application/json',
  };
}
