import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IoCalendarOutline,
  IoHomeOutline,
  IoPersonOutline,
} from 'react-icons/io5';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string, key: string) => {
    if (key === 'home') return path === '/' || path.startsWith('/home');
    if (key === 'calendar') return path.startsWith('/calendar');
    if (key === 'my') return path.startsWith('/my');
    return false;
  };

  return (
    <Container role="navigation" aria-label="Bottom navigation">
      <NavItem
        $active={isActive(location.pathname, 'home')}
        onClick={() => navigate('/home')}
      >
        <IoHomeOutline size={24} />
        <NavLabel $active={isActive(location.pathname, 'home')}>홈</NavLabel>
      </NavItem>
      <NavItem
        $active={isActive(location.pathname, 'calendar')}
        onClick={() => navigate('/calendar')}
      >
        <IoCalendarOutline size={24} />
        <NavLabel $active={isActive(location.pathname, 'calendar')}>
          캘린더
        </NavLabel>
      </NavItem>
      <NavItem
        $active={isActive(location.pathname, 'my')}
        onClick={() => navigate('/my')}
      >
        <IoPersonOutline size={24} />
        <NavLabel $active={isActive(location.pathname, 'my')}>마이</NavLabel>
      </NavItem>
    </Container>
  );
};

export default BottomNav;

const Container = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72px;
  background: #fff;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  z-index: 100;

  /* Drop Shadow */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;

  svg {
    color: ${({ $active, theme }) =>
      $active ? theme.color.brand.main : theme.color.gray.gray800};
  }
`;

const NavLabel = styled.span<{ $active?: boolean }>`
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)}; /* active면 bold */
  color: ${({ $active, theme }) =>
    $active ? theme.color.brand.main : theme.color.gray.gray800};
`;
