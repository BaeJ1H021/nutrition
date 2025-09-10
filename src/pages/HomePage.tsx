import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/molecules';
import TodayScheduleCard, {
  ScheduleItem,
} from '../components/organisms/TodayScheduleCard';
import { Calendar } from '../components/organisms';

/** ---- Mock schedules ---- */
const mockSchedules: ScheduleItem[] = [
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

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const today = new Date(); // 실제 오늘

  return (
    <Container>
      <LogoRow>
        <img src="/images/Nutrition.png" alt="Nutrition" />
      </LogoRow>

      {/* 오늘 일정 카드 (최대 2개 + '외 n개') */}
      <TodayScheduleCard
        today={today}
        schedules={mockSchedules}
        onMoreClick={() => navigate('/schedule')}
      />

      {/* 캘린더 (기존 그대로) */}
      <Calendar
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

      <BottomNav />
    </Container>
  );
};

export default HomePage;

/* ---------- styles ---------- */
const Container = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.6rem 1.4rem 8rem;
  background: #fff;
`;

const LogoRow = styled.div`
  margin-bottom: 2.6rem;
`;
