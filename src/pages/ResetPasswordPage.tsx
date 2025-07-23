import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BoldText,
  CustomButton,
  FlexBox,
  RegularText,
} from '../components/atoms';
import { theme } from '../styles/theme';
import { InputField, StyledIconButton } from '../components/molecules';
import { IoIosCloseCircle } from 'react-icons/io';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isValid = email === '' || /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);

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

  const handleClear = () => {
    setEmail('');
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
      <InputField
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력해주세요"
        isValid={isValid}
        helperMessage={
          email !== '' && !isValid ? '*잘못된 유형의 이메일 주소입니다.' : ''
        }
      >
        {email && (
          <StyledIconButton onClick={handleClear}>
            <IoIosCloseCircle size={20} color={theme.color.gray.gray300} />
          </StyledIconButton>
        )}
      </InputField>
      <FlexBox col fullWidth gap="0.8rem" style={{ marginTop: 'auto' }}>
        {toastMessage && <Toast>{toastMessage}</Toast>}
        <CustomButton
          onClick={handleReset}
          disabled={!email || !isValid || isLoading}
          variant="primary"
        >
          새로운 비밀번호 전송
        </CustomButton>
        <CustomButton onClick={() => history.back()} variant="secondary">
          로그인으로 돌아가기
        </CustomButton>
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
