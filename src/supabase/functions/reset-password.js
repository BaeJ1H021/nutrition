import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
const resendKey = Deno.env.get('RESEND_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
function generateSecurePassword() {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  return Array.from(
    {
      length: 10,
    },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}
serve(async (req) => {
  // ✅ CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders(),
    });
  }
  try {
    const { email } = await req.json();
    console.log('요청받은 email: ', email);
    // ✅ Supabase client 생성
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    // ✅ 임시 비밀번호 생성
    const tempPassword = generateSecurePassword();
    // ✅ 전체 사용자 조회
    const {
      data: { users },
      error: fetchError,
    } = await supabase.auth.admin.listUsers();
    if (fetchError || !users?.length) {
      return responseJSON(500, {
        error: '전체 유저 조회 실패',
      });
    }
    // ✅ 해당 사용자 조회
    const user = users.find((u) => u.email === email);
    if (!user) {
      return responseJSON(404, {
        error: `이메일 ${email} 유저 없음`,
      });
    }
    console.log(user);
    // ✅ 비밀번호 업데이트
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password: tempPassword,
      },
    );
    if (updateError) {
      return responseJSON(500, {
        error: '비밀번호 변경 실패',
      });
    }
    // ✅ Resend API 호출
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'NutritionCorp <no-reply@nutritioncorp.kr>',
        to: email,
        subject: '임시 비밀번호 안내',
        html: `
          <p>안녕하세요!</p>
          <p>요청하신 임시 비밀번호는 아래와 같습니다:</p>
          <p><strong>${tempPassword}</strong></p>
          <p>로그인 후 꼭 비밀번호를 변경해주세요.</p>
        `,
      }),
    });
    const emailData = await emailRes.json();
    if (!emailRes.ok) {
      return responseJSON(500, {
        error: '이메일 발송 실패',
        detail: emailData,
      });
    }
    return responseJSON(200, {
      success: true,
      emailData,
    });
  } catch (err) {
    return responseJSON(500, {
      error: '서버 내부 오류 발생',
      detail: err.message || err,
    });
  }
});
// ✅ 공통 응답 헤더 (CORS 허용)
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
// ✅ 공통 JSON 응답 포맷
function responseJSON(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}
