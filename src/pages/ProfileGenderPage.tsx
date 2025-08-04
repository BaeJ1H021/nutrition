import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BoldText, RegularText } from '../components/atoms';
import { useProfileStore } from '../states/ProfileStore';
import { theme } from '../styles/theme';

const ProfileGenderPage = () => {
  const navigate = useNavigate();
  const { setGender } = useProfileStore();

  const handleSelect = (gender: 'male' | 'female') => {
    setGender(gender);
    navigate('/profile/birthday'); // 다음 생년월일 페이지로 이동
  };

  return (
    <Container>
      <BoldText
        size={28}
        color={theme.color.gray.gray800}
        style={{ marginBottom: '1.8rem' }}
      >
        성별은 어떻게 되시나요?
      </BoldText>
      <RegularText
        size={16}
        color={theme.color.gray.gray500}
        style={{ whiteSpace: 'pre-line', marginBottom: '11.4rem' }}
      >
        성별에 따라 필요한 영양성분이 {'\n'} 다를 수 있어요
      </RegularText>
      <OptionContainer>
        <Card onClick={() => handleSelect('male')}>
          <Image src="/images/male.png" alt="남성" />
          <CardLabel>남성</CardLabel>
        </Card>
        <Card onClick={() => handleSelect('female')}>
          <Image src="/images/female.png" alt="여성" />
          <CardLabel>여성</CardLabel>
        </Card>
      </OptionContainer>
    </Container>
  );
};

export default ProfileGenderPage;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 3.4rem 1.4rem;
`;

const OptionContainer = styled.div`
  display: flex;
  gap: 1.6rem;
`;

const Card = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0.8rem;
  padding: 3.5rem 3.1rem 1.9rem 3.1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.06);
`;

const Image = styled.img`
  margin-bottom: 1.8rem;
`;

const CardLabel = styled.span`
  ${({ theme }) => theme.font.semibold16};
  color: ${({ theme }) => theme.color.gray.gray800};
`;
