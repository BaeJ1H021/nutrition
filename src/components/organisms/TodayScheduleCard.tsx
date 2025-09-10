import React, { useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { BoldText, RegularText } from '../atoms';
import { GiPill } from 'react-icons/gi';

export type ScheduleItem = {
  id: string;
  title: string;
  dates?: string[]; // 단일 날짜들 (YYYY-MM-DD)
  range?: { start: string; end: string }; // 구간
};

type Props = {
  today: Date;
  schedules: ScheduleItem[];
  onMoreClick?: () => void; // "자세히 보기 >" 클릭
};

const TodayScheduleCard: React.FC<Props> = ({
  today,
  schedules,
  onMoreClick,
}) => {
  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  const occursToday = (s: ScheduleItem) =>
    (s.dates && s.dates.includes(todayStr)) ||
    (s.range && todayStr >= s.range.start && todayStr <= s.range.end);

  const todays = useMemo(
    () => schedules.filter(occursToday),
    [schedules, todayStr],
  );
  const visible = todays.slice(0, 2);
  const extraCount = Math.max(todays.length - 2, 0);

  return (
    <Card role="region" aria-label="오늘의 복용 일정">
      <RegularText
        size={20}
        color={theme.color.gray.white}
        style={{ marginBottom: '0.8rem' }}
      >
        오늘의 복용 일정
      </RegularText>
      {todays.length === 0 ? (
        <Empty>오늘은 등록된 복용 일정이 없어요</Empty>
      ) : (
        <List>
          {visible.map((s) => (
            <Pill key={s.id}>
              <GiPill size={24} color="green" />
              <BoldText size={14} color={theme.color.brand.darken200}>
                {s.title}
              </BoldText>
            </Pill>
          ))}
        </List>
      )}
      <CardFooter>
        <RegularText size={14} color={theme.color.brand.darken300}>
          {extraCount > 0 ? `+ 외 ${extraCount}개 일정` : '\u00A0'}
        </RegularText>
        <DetailBtn type="button" onClick={onMoreClick}>
          자세히 보기 &gt;
        </DetailBtn>
      </CardFooter>
    </Card>
  );
};

export default TodayScheduleCard;

const Card = styled.div`
  background: ${theme.color.brand.main};
  color: #fff;
  border-radius: 1.2rem;
  padding: 1.2rem 1rem;
  margin-bottom: 4.2rem;
`;

const Empty = styled.div`
  ${({ theme }) => theme.font.regular14};
  opacity: 0.95;
  background: rgba(255, 255, 255, 0.16);
  padding: 0.9rem 1.1rem;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
`;

const Pill = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  background: #fff;
  border-radius: 3rem;
  height: 3.8rem;
  padding: 0.7rem 1.4rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DetailBtn = styled.button`
  ${({ theme }) => theme.font.regular14};
  color: ${theme.color.brand.darken300};
`;
