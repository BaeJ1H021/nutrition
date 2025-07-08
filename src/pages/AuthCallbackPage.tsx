import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../apis';

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/home'); // 로그인 성공 시 홈으로
        } else {
          navigate('/login'); // 실패 시 로그인 페이지로
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe(); // 컴포넌트 언마운트 시 cleanup
    };
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default AuthCallbackPage;
