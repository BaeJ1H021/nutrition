import { useState } from 'react';
import styled from 'styled-components';
import { BoldText, CustomButton } from '../components/atoms';
import { theme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import { IoIosCloseCircle } from 'react-icons/io';
import { supabase } from '../apis';
import { StyledIconButton, InputField } from '../components/molecules';

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
      <InputField
        label="이메일"
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="이메일을 입력해주세요"
        isValid={email === '' || isValid}
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
      <CustomButton
        onClick={handleSendCode}
        variant="primary"
        disabled={!email || !isValid}
        marginTop="auto"
      >
        인증번호 발송하기
      </CustomButton>
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
