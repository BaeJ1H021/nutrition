import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../apis';
import { FaCheck } from 'react-icons/fa';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { User } from '@supabase/supabase-js';
import { BoldText } from '../components/atoms';
import { theme } from '../styles/theme';

const SignUpPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate('/signup/email');

      // 이미 비밀번호 설정된 유저는 홈으로 보냄 (예: 메타데이터 사용)
      if (user.user_metadata?.is_password_set) return navigate('/home');

      setUser(user);
    };
    checkUser();
  }, []);

  const isValid =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
      password,
    );
  const isMatch = password === confirmPassword;

  const handleSubmit = async () => {
    if (!isValid || !isMatch || !user) return;

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return alert('비밀번호 설정 실패: ' + error.message);

    // 메타데이터로 비밀번호 설정 여부 저장 (선택사항)
    await supabase.auth.updateUser({ data: { is_password_set: true } });

    alert('비밀번호가 설정되었습니다.');
    navigate('/welcome');
  };

  return (
    <Container>
      <BoldText
        size={28}
        color={theme.color.gray.gray800}
        style={{ marginBottom: '2.6rem' }}
      >
        안전한 시작을 위해
        <br />
        비밀번호를 설정해 주세요.
      </BoldText>
      <Label>비밀번호</Label>
      <InputWrapper>
        <InputContainer>
          <Input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8자 이상, 영문/숫자/특수문자 조합"
            $isValid={password === '' || isValid}
          />
          <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? (
              <IoEyeOffOutline color={theme.color.gray.gray300} size={20} />
            ) : (
              <IoEyeOutline color={theme.color.gray.gray300} size={20} />
            )}
          </IconButton>
        </InputContainer>
        {password && (
          <Message $isValid={isValid}>
            {isValid ? (
              <ValidRow>
                <FaCheck size={12} color={theme.color.brand.main} /> 안전한
                비밀번호입니다.
              </ValidRow>
            ) : (
              '*안전하지 않은 비밀번호입니다. (8자 이상, 영문/숫자/특수문자 포함)'
            )}
          </Message>
        )}
      </InputWrapper>
      <Label>비밀번호 확인</Label>
      <InputWrapper>
        <InputContainer>
          <Input
            type={confirmVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            $isValid={confirmPassword === '' || isMatch}
          />
          <IconButton onClick={() => setConfirmVisible(!confirmVisible)}>
            {confirmVisible ? (
              <IoEyeOffOutline color={theme.color.gray.gray300} size={20} />
            ) : (
              <IoEyeOutline color={theme.color.gray.gray300} size={20} />
            )}
          </IconButton>
        </InputContainer>
        {confirmPassword && !isMatch && (
          <Message $isValid={false}>*비밀번호가 일치하지 않습니다.</Message>
        )}
        {confirmPassword && isMatch && isValid && (
          <Message $isValid={true}>
            <ValidRow>
              <FaCheck size={12} color={theme.color.brand.main} /> 비밀번호가
              일치합니다.
            </ValidRow>
          </Message>
        )}
      </InputWrapper>
      <SubmitButton onClick={handleSubmit} disabled={!isValid || !isMatch}>
        완료
      </SubmitButton>
    </Container>
  );
};

export default SignUpPasswordPage;

const Container = styled.div`
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
  margin-bottom: 1.6rem;
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

const Message = styled.p<{ $isValid: boolean }>`
  ${({ theme }) => theme.font.regular12}
  color: ${({ $isValid, theme }) =>
    $isValid ? theme.color.brand.main : theme.color.semantic.error};
  margin-top: 0.8rem;
`;

const ValidRow = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  margin-top: auto;
  width: 100%;
  height: 4.8rem;
  border-radius: 0.8rem;
  ${({ theme }) => theme.font.semibold16}
  color: ${({ disabled }) => (disabled ? theme.color.gray.gray400 : '#fff')};
  background-color: ${({ disabled }) =>
    disabled ? theme.color.gray.gray50 : theme.color.brand.main};
`;
