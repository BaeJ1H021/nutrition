import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BoldText, CustomButton, RegularText } from '../components/atoms';
import { theme } from '../styles/theme';

const ProfileEndPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Image src="/images/profile_end.png" alt="웃으며 축하해주는 일러스트" />
      <BoldText
        size={28}
        color={theme.color.brand.main}
        style={{ marginBottom: '1.4rem', marginTop: '8.2rem' }}
      >
        모든 준비가 완료되었어요
      </BoldText>
      <RegularText
        size={18}
        color={theme.color.gray.gray500}
        style={{ textAlign: 'center' }}
      >
        이제 개인 맞춤
        <br />
        영양 추천을 받아보세요
      </RegularText>
      <ButtonWrapper>
        <CustomButton onClick={() => navigate('/login')} variant="primary">
          첫 일정 등록하기
        </CustomButton>
        <CustomButton onClick={() => navigate('/home')} variant="disabled">
          건너뛰기
        </CustomButton>
      </ButtonWrapper>
    </Container>
  );
};

export default ProfileEndPage;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.4rem 1.4rem;
  min-height: 100vh;
  background-color: #ffffff;
`;

const Image = styled.img`
  width: 228px;
  height: 256px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.1rem;
  margin-top: auto;
`;
