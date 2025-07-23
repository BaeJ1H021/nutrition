import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../apis';
import { BoldText, CustomButton } from '../components/atoms';
import { theme } from '../styles/theme';
import { FaCheck } from 'react-icons/fa';
import { InputField, StyledIconButton } from '../components/molecules';
import { IoIosCloseCircle } from 'react-icons/io';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const [saveId, setSaveId] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      <InputField
        marginBottom="0.8rem"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        isValid={!errorMessage}
      >
        {email && (
          <StyledIconButton onClick={() => setEmail('')}>
            <IoIosCloseCircle size={20} color={theme.color.gray.gray300} />
          </StyledIconButton>
        )}
      </InputField>
      <InputField
        type={passwordVisible ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호(8자 이상, 영문/숫자/특수문자 조합)"
        isValid={!errorMessage}
        helperMessage={errorMessage}
        marginBottom="0.8rem"
      >
        {password && (
          <StyledIconButton
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <IoEyeOffOutline color={theme.color.gray.gray300} size={20} />
            ) : (
              <IoEyeOutline color={theme.color.gray.gray300} size={20} />
            )}
          </StyledIconButton>
        )}
      </InputField>
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
      <CustomButton
        onClick={() => navigate('/signup/email')}
        variant="secondary"
        marginBottom="2.2rem"
      >
        회원가입
      </CustomButton>
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
