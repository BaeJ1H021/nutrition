import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BoldText, FlexBox, RegularText } from '../components/atoms';
import { theme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../apis';

const SignUpVerifyPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const init = () => {
      const savedEmail = sessionStorage.getItem('signup_email');
      if (!savedEmail) navigate('/signup/email');
      else setEmail(savedEmail);
    };
    init();
  }, []);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendAvailable(true);
    }
  }, [seconds]);

  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => setToastMessage(''), 2000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  const handleVerify = async () => {
    setError('');
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) {
      setError('*인증번호가 일치하지 않습니다.');
      return;
    }
    navigate('/signup/password');
  };

  const handleResend = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });
    if (error) return alert('인증번호 재전송 실패: ' + error.message);
    setToastMessage('새로운 인증번호를 발송했습니다!');
    setSeconds(60);
    setResendAvailable(false);
  };

  const handleGoBack = () => navigate('/signup/email');

  return (
    <Container>
      <BoldText
        size={28}
        color={theme.color.gray.gray800}
        style={{ marginBottom: '0.4rem' }}
      >
        이메일 인증을 확인해주세요
      </BoldText>
      <RegularText
        size={16}
        color={theme.color.gray.gray500}
        style={{ marginBottom: '3.2rem' }}
      >
        {email}으로
        <br />
        인증번호를 발송했습니다.
      </RegularText>
      <Label>인증번호</Label>
      <Input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="인증번호 6자리"
      />
      <FlexBox gap="1.2rem" style={{ marginBottom: '7.1rem' }}>
        {error && <ErrorText>{error}</ErrorText>}
        <TimerText>
          대기시간 {Math.floor(seconds / 60)}:
          {(seconds % 60).toString().padStart(2, '0')}
        </TimerText>
      </FlexBox>

      <BottomText>
        {resendAvailable ? (
          <ResendButton onClick={handleResend}>인증번호가 안와요</ResendButton>
        ) : (
          <RegularText size={12} color={theme.color.gray.gray400}>
            인증번호가 안와요
          </RegularText>
        )}
        <Divider>|</Divider>
        <ResendButton onClick={handleGoBack}>이메일 다시 입력하기</ResendButton>
      </BottomText>
      <BottomWrapper>
        {toastMessage && <Toast>{toastMessage}</Toast>}
        <SubmitButton onClick={handleVerify} disabled={code.length !== 6}>
          인증번호 확인
        </SubmitButton>
      </BottomWrapper>
    </Container>
  );
};

export default SignUpVerifyPage;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 3.4rem 1.4rem;
  background-color: #ffffff;
`;

const Label = styled.label`
  display: block;
  ${({ theme }) => theme.font.bold14}
  color: ${theme.color.brand.main};
  margin-bottom: 0.8rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.1rem 1.4rem;
  ${({ theme }) => theme.font.regular16};
  color: ${theme.color.gray.gray800};
  border: 1px solid ${theme.color.gray.gray100};
  border-radius: 0.8rem;
  margin-bottom: 0.8rem;
`;

const ErrorText = styled.p`
  ${({ theme }) => theme.font.regular12}
  color: ${theme.color.semantic.error};
`;

const TimerText = styled.p`
  ${({ theme }) => theme.font.regular12}
  color: ${theme.color.gray.gray400};
`;

const BottomText = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.4rem;
  margin-bottom: 2.2rem;
`;

const Divider = styled.span`
  color: ${theme.color.gray.gray400};
`;

const ResendButton = styled.button`
  ${({ theme }) => theme.font.regular12};
  color: ${theme.color.gray.gray400};
`;

const BottomWrapper = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 4.8rem;
  border-radius: 0.8rem;
  ${({ theme }) => theme.font.semibold16};
  color: ${({ disabled }) => (disabled ? theme.color.gray.gray400 : '#fff')};
  background-color: ${({ disabled }) =>
    disabled ? theme.color.gray.gray50 : theme.color.brand.main};
`;

const Toast = styled.div`
  position: relative;
  width: 100%;
  height: 5.2rem;
  ${({ theme }) => theme.font.regular14};
  background-color: black;
  color: #fff;
  padding: 1.5rem 1.4rem;
  border-radius: 0.8rem;
`;
