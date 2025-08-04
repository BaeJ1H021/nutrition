import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BoldText, RegularText, CustomButton } from '../components/atoms';
import { useProfileStore } from '../states/ProfileStore';
import { theme } from '../styles/theme';
import { InputField } from '../components/molecules';
import { saveProfileToDBAPI } from '../apis';

const ProfileBodyPage = () => {
  const navigate = useNavigate();
  const { setHeight, setWeight } = useProfileStore();

  const [height, setHeightState] = useState('');
  const [weight, setWeightState] = useState('');

  const isValid = height !== '' && weight !== '';

  const handleNext = async () => {
    if (!isValid) return;
    setHeight(Number(height));
    setWeight(Number(weight));

    try {
      await saveProfileToDBAPI();
      navigate('/profile/end'); // 저장 성공 후 이동
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <BoldText
        size={28}
        color={theme.color.gray.gray800}
        style={{ marginBottom: '1.8rem' }}
      >
        키와 몸무게를 알려주세요
      </BoldText>
      <RegularText
        size={16}
        color={theme.color.gray.gray500}
        style={{ marginBottom: '4.2rem', whiteSpace: 'pre-line' }}
      >
        신체정보에 따라{'\n'}건강 분석이 진행돼요
      </RegularText>
      <InputField
        label="키"
        type="text"
        value={height}
        placeholder="회원님의 키를 입력하세요"
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 3);
          setHeightState(val);
        }}
      >
        <Unit>cm</Unit>
      </InputField>
      <InputField
        label="몸무게"
        type="text"
        value={weight}
        placeholder="회원님의 몸무게를 입력하세요"
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 3);
          setWeightState(val);
        }}
        marginBottom="auto"
      >
        <Unit>kg</Unit>
      </InputField>

      <CustomButton onClick={handleNext} disabled={!isValid}>
        다음
      </CustomButton>
    </Container>
  );
};

export default ProfileBodyPage;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 3.4rem 1.4rem;
`;

const Unit = styled.span`
  position: absolute;
  right: 1.4rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.color.gray.gray300};
  ${({ theme }) => theme.font.regular16};
`;
