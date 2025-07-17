import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BoldText, FlexBox, RegularText } from '../components/atoms';
import { theme } from '../styles/theme';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleReset = async () => {
    setIsLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      },
    );

    const result = await res.json();

    setIsLoading(false);

    if (!res.ok) {
      setToastMessage(result.error || '실패했습니다.');
      setEmail('');
    } else {
      setToastMessage('메일을 발송했습니다!');
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => setToastMessage(''), 2000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  return (
    <Container>
      <BoldText
        size={28}
        color={theme.color.gray.gray800}
        style={{ marginBottom: '0.4rem' }}
      >
        가입하신 이메일 주소를
        <br /> 입력해주세요
      </BoldText>
      <RegularText
        size={16}
        color={theme.color.gray.gray500}
        style={{ marginBottom: '1.6rem' }}
      >
        이메일 주소로 임시 비밀번호를 보내드려요.
      </RegularText>
      <Label>이메일</Label>
      <Input
        type="email"
        placeholder="이메일을 입력해주세요"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <FlexBox col fullWidth gap="0.8rem" style={{ marginTop: 'auto' }}>
        {toastMessage && <Toast>{toastMessage}</Toast>}
        <Button disabled={!email || isLoading} onClick={handleReset}>
          새로운 비밀번호 전송
        </Button>
        <ReturnLoginButton onClick={() => history.back()}>
          로그인으로 돌아가기
        </ReturnLoginButton>
      </FlexBox>
    </Container>
  );
};

export default ResetPasswordPage;

const Container = styled.div`
  padding: 3.4rem 1.4rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  ${({ theme }) => theme.font.regular16}
  border: 1px solid
    ${({ theme }) => theme.color.gray.gray200};
  border-radius: 0.8rem;
  &:focus {
    border-color: ${theme.color.brand.main};
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 4.8rem;
  border-radius: 0.8rem;
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.color.gray.gray50 : theme.color.brand.main};
  color: ${({ disabled, theme }) =>
    disabled ? theme.color.gray.gray400 : 'white'};
  ${({ theme }) => theme.font.semibold16};
`;

const ReturnLoginButton = styled.button`
  width: 100%;
  height: 4.8rem;
  border-radius: 0.8rem;
  ${({ theme }) => theme.font.semibold16}
  color: ${({ theme }) => theme.color.gray.gray200};
  border: 1px solid ${({ theme }) => theme.color.gray.gray100};
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
