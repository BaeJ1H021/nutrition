import { useMemo } from 'react';
import styled from 'styled-components';
import { BoldText } from '../atoms';
import { theme } from '../../styles/theme';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

export type ScheduleItem = {
  id: string;
  title: string;
  dates?: string[];
  range?: { start: string; end: string };
};

type RangeStatus = 'none' | 'mid' | 'start' | 'end';

type Props = {
  viewDate: Date;
  schedules: ScheduleItem[];
  today?: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  className?: string;
};

/** ---------- Utils ---------- */
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addDays = (d: Date, n: number) => {
  const nd = new Date(d);
  nd.setDate(d.getDate() + n);
  return nd;
};
const parse = (s: string) => {
  const [y, m, dd] = s.split('-').map(Number);
  return new Date(y, m - 1, dd);
};
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** 로컬 포맷 (UTC 오프바이원 방지) */
const fmtLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

const ymLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

function buildMonthMatrix(view: Date) {
  const start = startOfMonth(view);
  const startOffset = start.getDay();
  const gridStart = addDays(start, -startOffset);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(gridStart, i));
  return { cells, start, end: endOfMonth(view) };
}

function hasEventOnDate(schedules: ScheduleItem[], dateStr: string): boolean {
  for (const s of schedules) {
    if (s.dates?.includes(dateStr)) return true;
    if (s.range) {
      const d = parse(dateStr);
      const st = parse(s.range.start);
      const en = parse(s.range.end);
      if (d >= st && d <= en) return true;
    }
  }
  return false;
}

function rangeStatusOnDate(
  schedules: ScheduleItem[],
  dateStr: string,
): RangeStatus {
  let hasRange = false,
    isStart = false,
    isEnd = false;
  for (const s of schedules) {
    if (!s.range) continue;
    const st = fmtLocal(parse(s.range.start));
    const en = fmtLocal(parse(s.range.end));
    if (dateStr === st && dateStr === en) return 'none';
    if (dateStr === st) {
      hasRange = true;
      isStart = true;
    } else if (dateStr === en) {
      hasRange = true;
      isEnd = true;
    } else {
      const d = parse(dateStr);
      if (d > parse(st) && d < parse(en)) hasRange = true;
    }
  }
  if (!hasRange) return 'none';
  if (isStart) return 'start';
  if (isEnd) return 'end';
  return 'mid';
}

/** ---------- Component ---------- */
const Calendar: React.FC<Props> = ({
  viewDate,
  schedules,
  today = new Date(),
  onPrevMonth,
  onNextMonth,
  className,
}) => {
  const { cells, start, end } = useMemo(
    () => buildMonthMatrix(viewDate),
    [viewDate],
  );

  const monthSchedules = useMemo(() => {
    const ym = ymLocal(viewDate);
    return schedules.filter((s) => {
      const inDates = (s.dates ?? []).some((d) => d.startsWith(ym));
      const inRange =
        s.range &&
        (s.range.start.slice(0, 7) === ym ||
          s.range.end.slice(0, 7) === ym ||
          (parse(s.range.start) < start && parse(s.range.end) > end));
      return inDates || !!inRange;
    });
  }, [viewDate, start, end, schedules]);

  return (
    <Wrap className={className}>
      <BoldText
        size={22}
        color={theme.color.brand.darken300}
        style={{ marginBottom: '8px' }}
      >
        {viewDate.toLocaleString('ko-KR', { month: 'long' })} 캘린더
      </BoldText>

      <HeaderRow>
        <NavBtn aria-label="이전 달" onClick={onPrevMonth}>
          <IoChevronBackOutline size={28} />
        </NavBtn>
        <MonthLabel>
          {viewDate.toLocaleString('en-US', { month: 'long' })}{' '}
          {viewDate.getFullYear()}
        </MonthLabel>
        <NavBtn aria-label="다음 달" onClick={onNextMonth}>
          <IoChevronForwardOutline size={28} />
        </NavBtn>
      </HeaderRow>

      <Weekdays>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((w) => (
          <small key={w}>{w}</small>
        ))}
      </Weekdays>

      <Grid>
        {cells.map((d) => {
          const inMonth = d.getMonth() === viewDate.getMonth();
          const dateStr = fmtLocal(d);
          const isToday = isSameDay(d, today);
          const rStatus = rangeStatusOnDate(monthSchedules, dateStr);
          const hasEvent = hasEventOnDate(monthSchedules, dateStr);
          const showDot = hasEvent && rStatus === 'none'; // ✅ 선/점 공존 금지

          return (
            <Cell key={dateStr} $inMonth={inMonth}>
              {/* 연결 바: 셀 전체 기준으로 깔아줌 */}
              {rStatus !== 'none' && (
                <RangeBar data-pos={rStatus} data-day={d.getDay()} />
              )}
              <DateWrap $isToday={isToday}>
                <span>{d.getDate()}</span>
                {showDot && <Dot />}
              </DateWrap>
            </Cell>
          );
        })}
      </Grid>
    </Wrap>
  );
};

export default Calendar;

/** ---------- styles ---------- */
const Wrap = styled.section`
  display: flex;
  flex-direction: column;

  --date-size: 39px;
  /* 기본값 — 페이지에서만 덮어씌우면 됨 */
  --cell-vpad: 0px; /* 셀 위/아래 여백 */
  --row-gap: 8px; /* 주(행) 간격 */
`;

const HeaderRow = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MonthLabel = styled.div`
  ${({ theme }) => theme.font.semibold16};
  color: ${({ theme }) => theme.color.gray.gray900};
`;

const NavBtn = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.color.brand.main};
`;

const Weekdays = styled.div`
  height: 18px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: center;
  small {
    text-align: center;
    ${({ theme }) => theme.font.regular12};
    color: ${({ theme }) => theme.color.gray.gray300};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(7, 1fr);
  row-gap: var(--row-gap); /* ✅ 행 간격 변수화 */
`;

const Cell = styled.div<{ $inMonth: boolean }>`
  position: relative; /* ⬅ 선을 셀 기준으로 배치 */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $inMonth }) => ($inMonth ? 1 : 0.35)};
  padding-block: var(--cell-vpad); /* ✅ 세로 여백 변수화 */
`;

const DateWrap = styled.div<{ $isToday: boolean }>`
  position: relative;
  z-index: 1; /* 선 위에 숫자/점 표시 */
  width: var(--date-size);
  height: var(--date-size);
  display: grid;
  place-items: center;

  span {
    ${({ theme }) => theme.font.regular18};
    color: ${({ $isToday, theme }) =>
      $isToday ? theme.color.brand.darken200 : theme.color.gray.gray800};
    background: ${({ $isToday, theme }) =>
      $isToday ? theme.color.brand.lighten200 : 'transparent'};
    border-radius: 999px;
    width: ${({ $isToday }) => ($isToday ? 'var(--date-size)' : 'auto')};
    height: ${({ $isToday }) => ($isToday ? 'var(--date-size)' : 'auto')};
    display: grid;
    place-items: center;
  }
`;

const Dot = styled.i`
  position: absolute;
  bottom: 0px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: ${theme.color.semantic.error};
`;

/* ✅ ‘이어지는’ 바 */
const RangeBar = styled.i`
  position: absolute;
  bottom: 0px; /* 숫자 아래 위치 */
  height: 6px;
  background: ${theme.color.semantic.error};

  /* 중간: 전체 폭(라운딩 없음) */
  &[data-pos='mid'] {
    left: 0;
    right: 0;
  }

  /* 시작: 가운데 → 오른쪽 (왼쪽 끝 라운딩) */
  &[data-pos='start'] {
    left: calc(60% - (var(--date-size) / 2));
    right: 0;
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
  }

  /* 끝: 왼쪽 → 가운데 (오른쪽 끝 라운딩) */
  &[data-pos='end'] {
    left: 0;
    right: calc(60% - (var(--date-size) / 2));
    border-top-right-radius: 999px;
    border-bottom-right-radius: 999px;
  }

  /* ✅ 주말 스냅 우선 규칙 */
  /* 일요일(0): 어떤 상태든 left를 숫자원 왼쪽 엣지로 */
  &[data-day='0'] {
    left: calc(55% - var(--date-size) / 2) !important;
  }

  /* 토요일(6): 어떤 상태든 right를 숫자원 오른쪽 엣지로 */
  &[data-day='6'] {
    right: calc(55% - var(--date-size) / 2) !important;
  }
`;
