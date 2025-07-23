import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BoldText, CustomButton, RegularText } from '../components/atoms';
import { theme } from '../styles/theme';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Image src="/images/welcome.png" alt="환영 일러스트" />
      <BoldText
        size={28}
        color={theme.color.brand.main}
        style={{ marginBottom: '1.4rem' }}
      >
        환영합니다!
      </BoldText>
      <RegularText
        size={18}
        color={theme.color.gray.gray500}
        style={{ textAlign: 'center' }}
      >
        프로필을 생성하여 뉴트리션과 함께하는
        <br />
        건강한 여정을 시작해보세요
      </RegularText>
      <ButtonWrapper>
        <CustomButton onClick={() => navigate('/login')} variant="primary">
          로그인 하기
        </CustomButton>
      </ButtonWrapper>
    </Container>
  );
};

export default WelcomePage;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.4rem 1.4rem;
  min-height: 100vh;
  background-color: #ffffff;
`;

const Image = styled.img`
  width: 294px;
  height: 333px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.1rem;
  margin-top: auto;
`;
