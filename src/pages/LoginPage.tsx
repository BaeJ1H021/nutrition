import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../apis';
import { BoldText } from '../components/atoms';
import { theme } from '../styles/theme';
import { FaCheck } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [saveId, setSaveId] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // Error logging removed to prevent exposing sensitive information.
    if (error) {
      setErrorMessage('*아이디 또는 비밀번호를 확인해주세요.');
      return;
    }

    setErrorMessage('');
    navigate('/home');
  };

  const handleKakaoLogin = async () => {
    const redirectTo =
      import.meta.env.MODE === 'development'
        ? 'http://localhost:5173/auth/callback'
        : 'https://www.nutritioncorp.kr/auth/callback';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: redirectTo,
      },
    });
    if (error) alert('카카오 로그인 실패: ' + error.message);
  };

  return (
    <Container>
      <BoldText
        size={28}
        color={theme.color.gray.gray800}
        style={{ marginBottom: '4.2rem' }}
      >
        뉴트리션과 함께
        <br />
        건강한 시작을 해보세요
      </BoldText>
      <Input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        $isError={!!errorMessage}
      />
      <Input
        type="password"
        placeholder="비밀번호(8자 이상, 영문/숫자/특수문자 조합)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        $isError={!!errorMessage}
      />
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      <CheckboxRow>
        <div>
          <input
            type="checkbox"
            id="autoLogin"
            checked={autoLogin}
            onChange={() => setAutoLogin(!autoLogin)}
            style={{ display: 'none' }}
          />
          <label htmlFor="autoLogin">
            <CustomBox $checked={autoLogin}>
              {autoLogin && <FaCheck size={12} color="#fff" />}
            </CustomBox>
            자동로그인
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            id="saveId"
            checked={saveId}
            onChange={() => setSaveId(!saveId)}
            style={{ display: 'none' }}
          />
          <label htmlFor="saveId">
            <CustomBox $checked={saveId}>
              {saveId && <FaCheck size={12} color="#fff" />}
            </CustomBox>
            아이디 저장
          </label>
        </div>
      </CheckboxRow>
      <LoginButton disabled={!email || !password} onClick={handleLogin}>
        로그인
      </LoginButton>
      <SignUpButton onClick={() => navigate('/signup/email')}>
        회원가입
      </SignUpButton>
      <TextButton onClick={() => navigate('/reset-password')}>
        비밀번호를 잊으셨나요?
      </TextButton>
      <KakaoImageButton
        src="/images/kakao_login.png"
        alt="카카오톡으로 로그인"
        onClick={handleKakaoLogin}
      />
    </Container>
  );
};

export default LoginPage;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 3.4rem 1.4rem;
  background-color: #ffffff;
`;

const Input = styled.input<{ $isError?: boolean }>`
  padding: 1.1rem 1.4rem;
  border: 1px solid
    ${({ $isError, theme }) =>
      $isError ? theme.color.semantic.error : theme.color.gray.gray100};
  border-radius: 0.8rem;
  margin-bottom: 0.8rem;
  ${({ theme }) => theme.font.regular16};
  color: ${theme.color.gray.gray800};
`;

const ErrorText = styled.p`
  color: ${theme.color.semantic.error};
  ${({ theme }) => theme.font.regular12};
  margin-top: 0.8rem;
`;

const CheckboxRow = styled.div`
  display: flex;
  gap: 3.2rem;
  margin-top: 4rem;
  margin-bottom: 1.6rem;
  ${({ theme }) => theme.font.regular14};
  color: ${theme.color.gray.gray800};

  label {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 4.8rem;
  background-color: ${theme.color.brand.main};
  color: white;
  border-radius: 0.8rem;
  ${({ theme }) => theme.font.semibold16};
  margin-bottom: 0.8rem;
`;

const SignUpButton = styled.button`
  width: 100%;
  height: 4.8rem;
  background-color: white;
  color: ${theme.color.gray.gray600};
  border: 1px solid ${theme.color.gray.gray100};
  border-radius: 0.8rem;
  ${({ theme }) => theme.font.semibold16};
  margin-bottom: 2.2rem;
`;

const TextButton = styled.button`
  ${({ theme }) => theme.font.regular14};
  color: ${theme.color.gray.gray400};
`;

const CustomBox = styled.span<{ $checked: boolean }>`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.4rem;
  background-color: ${({ $checked, theme }) =>
    $checked ? theme.color.brand.main : 'white'};
  border: 1px solid
    ${({ $checked, theme }) =>
      $checked ? theme.color.brand.main : theme.color.gray.gray300};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const KakaoImageButton = styled.img`
  width: 100%;
  height: auto;
  margin-top: auto;
  cursor: pointer;
  border-radius: 1rem;
`;
