import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/molecules';
import { Calendar } from '../components/organisms';
import { theme } from '../styles/theme';
import { MediumText } from '../components/atoms';

/** ---- Mock schedules ---- */
const mockSchedules = [
  {
    id: '1',
    title: '전해질 보충제',
    dates: ['2025-09-09', '2025-09-16', '2025-09-30'],
  },
  {
    id: '2',
    title: 'BCAA (분지사슬아미노산)',
    range: { start: '2025-09-09', end: '2025-09-11' },
  },
  { id: '3', title: '오메가-3', dates: ['2025-09-09'] },
  { id: '4', title: '비타민D', dates: ['2025-09-15'] },
  { id: '5', title: '비타민E', dates: ['2025-09-10'] },
  { id: '6', title: '비타민F', dates: ['2025-09-10'] },
];

const LargeCalendar = styled(Calendar)`
  --cell-vpad: 10px; /* 셀 높이 늘리기 */
  --row-gap: 10px; /* 행 간격 늘리기 */
`;

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const today = new Date();

  return (
    <Container>
      {/* 상단 헤더 */}
      <Header>
        <MediumText size={16} color={theme.color.gray.gray800}>
          캘린더
        </MediumText>
        <AddButton onClick={() => navigate('/schedule/add')}>
          일정추가
        </AddButton>
      </Header>

      {/* 캘린더 */}
      <LargeCalendar
        viewDate={viewDate}
        today={today}
        schedules={mockSchedules}
        onPrevMonth={() =>
          setViewDate(
            new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1),
          )
        }
        onNextMonth={() =>
          setViewDate(
            new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1),
          )
        }
      />

      {/* 오늘 일정 보기 버튼 */}
      <TodayButton onClick={() => navigate('/today')}>
        오늘 일정 보기
      </TodayButton>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </Container>
  );
};

export default CalendarPage;

/* ---------- styles ---------- */
const Container = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 1.4rem 8rem;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.6rem 0 2rem;
`;

const AddButton = styled.button`
  ${theme.font.medium16}
  color: ${theme.color.gray.gray800};
`;

const TodayButton = styled.button`
  ${theme.font.semibold16}
  width: 40%;
  padding: 0.8rem 2rem;
  margin-top: 2.6rem;
  border-radius: 0.6rem;
  color: #fff;
  background: ${theme.color.brand.main};
  align-self: center;
`;
