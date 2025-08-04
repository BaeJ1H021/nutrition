import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BoldText, RegularText, CustomButton } from '../components/atoms';
import { useProfileStore } from '../states/ProfileStore';
import { theme } from '../styles/theme';

const ProfileBirthdayPage = () => {
  const navigate = useNavigate();
  const { setBirthday } = useProfileStore();

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const isValidDate = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const date = new Date(`${y}-${m}-${d}`);
    return (
      y > 1900 &&
      m >= 1 &&
      m <= 12 &&
      d >= 1 &&
      d <= 31 &&
      date.getFullYear() === y &&
      date.getMonth() + 1 === m &&
      date.getDate() === d
    );
  };

  const handleNext = () => {
    if (!isValidDate()) return;
    setBirthday(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    navigate('/profile/body'); // 다음 페이지로 이동
  };

  return (
    <Container>
      <BoldText
        size={28}
        color={theme.color.gray.gray800}
        style={{ marginBottom: '1.8rem' }}
      >
        생일을 알려주세요!
      </BoldText>
      <RegularText
        size={16}
        color={theme.color.gray.gray500}
        style={{ marginBottom: '5rem', whiteSpace: 'pre-line' }}
      >
        나이에 따라{'\n'}건강 분석이 진행돼요
      </RegularText>
      <DateInputContainer>
        <DateInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="1991"
          value={year}
          maxLength={4}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
            setYear(val);
          }}
        />
        <Divider>/</Divider>
        <DateInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="01"
          value={month}
          maxLength={2}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 2);
            setMonth(val);
          }}
        />
        <Divider>/</Divider>
        <DateInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="31"
          value={day}
          maxLength={2}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 2);
            setDay(val);
          }}
        />
      </DateInputContainer>
      <CustomButton
        marginTop="auto"
        onClick={handleNext}
        disabled={!isValidDate()}
      >
        다음
      </CustomButton>
    </Container>
  );
};

export default ProfileBirthdayPage;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 3.4rem 1.4rem;
`;

const DateInputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3.5rem;
`;

const DateInput = styled.input`
  width: 5rem;
  text-align: center;
  border: none;
  ${({ theme }) => theme.font.regular20};
  color: ${theme.color.gray.gray800};

  &:focus {
    outline: none;
    border-color: ${theme.color.brand.main};
  }

  &::placeholder {
    color: ${theme.color.gray.gray200};
  }
`;

const Divider = styled.span`
  ${({ theme }) => theme.font.regular20};
  color: ${theme.color.gray.gray200};
`;
