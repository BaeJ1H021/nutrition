import { useState } from 'react';
import styled from 'styled-components';
import { BoldText } from '../components/atoms';
import { theme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import { IoIosCloseCircle } from 'react-icons/io';
import { supabase } from '../apis';

const SignUpEmailPage = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    setIsValid(value === '' || emailRegex.test(value));
  };

  const handleClear = () => {
    setEmail('');
    setIsValid(true);
  };

  const handleSendCode = async () => {
    if (isValid) {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });

      if (error) return alert('메일 전송 실패: ' + error.message);

      // ✅ 이메일을 세션 스토리지에 저장
      sessionStorage.setItem('signup_email', email);
      alert('인증번호가 이메일로 발송되었습니다.');

      navigate('/signup/verify'); // 다음 페이지로 이동
    }
  };

  return (
    <Container>
      <BoldText
        size={28}
        color={theme.color.gray.gray800}
        style={{ marginBottom: '4.6rem' }}
      >
        안전한 계정으로
        <br />
        맞춤 추천을 받아보세요
      </BoldText>
      <Label>이메일</Label>
      <InputWrapper>
        <InputContainer>
          <Input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleChange}
            $isValid={email === '' || isValid}
          />
          {email && (
            <IconButton onClick={handleClear}>
              <IoIosCloseCircle size={20} color={theme.color.gray.gray300} />
            </IconButton>
          )}
        </InputContainer>
        {email !== '' && !isValid && (
          <ErrorText>*잘못된 유형의 이메일 주소입니다.</ErrorText>
        )}
      </InputWrapper>
      <SubmitButton disabled={!email || !isValid} onClick={handleSendCode}>
        인증번호 발송하기
      </SubmitButton>
    </Container>
  );
};

export default SignUpEmailPage;

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

const InputWrapper = styled.div`
  margin-bottom: 13.3rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input<{ $isValid: boolean }>`
  width: 100%;
  padding: 1.1rem 1.4rem;
  ${({ theme }) => theme.font.regular16}
  border: 1px solid
    ${({ $isValid, theme }) =>
    $isValid ? theme.color.gray.gray200 : theme.color.semantic.error};
  border-radius: 0.8rem;
  &:focus {
    border-color: ${theme.color.brand.main};
  }
`;

const IconButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorText = styled.p`
  color: ${theme.color.semantic.error};
  ${({ theme }) => theme.font.regular12}
  margin-top: 0.8rem;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 4.8rem;
  margin-top: auto;
  border-radius: 0.8rem;
  ${({ theme }) => theme.font.semibold16}
  color: ${({ disabled }) => (disabled ? theme.color.gray.gray400 : '#fff')};
  background-color: ${({ disabled }) =>
    disabled ? theme.color.gray.gray50 : theme.color.brand.main};
`;
