import { useState } from 'react';
import styled from 'styled-components';
import { BoldText, FlexBox, RegularText } from '../components/atoms';
import { theme } from '../styles/theme';

const onboardingData = [
  {
    image: '/images/onboarding_1.png',
    title: '개인 맞춤 영양 관리의\n진짜 시작',
    description: '당신의 라이프스타일에 맞는 최적의\n영양소 추천을 받아보세요',
  },
  {
    image: '/images/onboarding_2.png',
    title: '상황별 맞춤 추천으로\n더 스마트하게',
    description: '야근, 운동, 스트레스 등\n상황에 따른 최적의 영양소 조합',
  },
  {
    image: '/images/onboarding_3.png',
    title: '과학적 근거 기반\n안전한 추천',
    description: '영양학 전문가 검증을 통한\n신뢰할 수 있는 정보 제공',
  },
];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const isLast = step === onboardingData.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setStep(step + 1);
    } else {
      // 로그인 페이지 이동 예정
      console.log('온보딩 완료!');
    }
  };

  const handleSkip = () => {
    // 로그인 페이지 이동 예정
    console.log('건너뛰기!');
  };

  return (
    <Container>
      <DotContainer>
        {onboardingData.map((_, idx) => (
          <Dot key={idx} active={idx === step} />
        ))}
      </DotContainer>
      <Illustration src={onboardingData[step].image} alt={onboardingData[step].title} />
      <BoldText
        size={28}
        color={theme.color.gray.gray800}
        style={{ whiteSpace: 'pre-line' }}
      >
        {onboardingData[step].title}
      </BoldText>
      <RegularText
        size={18}
        color={theme.color.gray.gray500}
        style={{ whiteSpace: 'pre-line', marginBottom: '3.4rem' }}
      >
        {onboardingData[step].description}
      </RegularText>
      <FlexBox col fullWidth>
        <MainButton onClick={handleNext}>
          {isLast ? '시작하기' : '다음'}
        </MainButton>
        <SkipButton onClick={handleSkip}>건너뛰기</SkipButton>
      </FlexBox>
    </Container>
  );
};

export default OnboardingPage;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1.5rem;
  background-color: #ffffff;
  text-align: center;
`;

const DotContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 2.6rem;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: ${({ active, theme }) =>
    active ? theme.color.brand.main : theme.color.gray.gray100};
`;

const Illustration = styled.img`
  width: 228px;
  height: 256px;
  object-fit: contain;
`;

const MainButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.color.brand.main};
  ${({ theme }) => theme.font.medium14}
  color: white;
  height: 4.8rem;
  border-radius: 0.8rem;
  margin-bottom: 0.8rem;
`;

const SkipButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.color.gray.gray50};
  ${({ theme }) => theme.font.medium14}
  color: ${({ theme }) => theme.color.gray.gray400};
  height: 4.8rem;
  border-radius: 0.8rem;
`;
