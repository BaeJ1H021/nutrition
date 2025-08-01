import { css } from 'styled-components';

const bold30 = css`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.3;
`;

const bold28 = css`
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.3;
`;

const bold24 = css`
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.3;
`;

const bold22 = css`
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.3;
`;

const bold20 = css`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
`;

const bold18 = css`
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.3;
`;

const bold16 = css`
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.3;
`;

const bold14 = css`
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.3;
`;

const bold12 = css`
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.3;
`;

const bold10 = css`
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
`;

const semibold16 = css`
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.3;
`;

const medium28 = css`
  font-size: 2.8rem;
  font-weight: 500;
`;

const medium24 = css`
  font-size: 2.4rem;
  font-weight: 500;
`;

const medium20 = css`
  font-size: 2rem;
  font-weight: 500;
`;

const medium18 = css`
  font-size: 1.8rem;
  font-weight: 500;
`;

const medium16 = css`
  font-size: 1.6rem;
  font-weight: 500;
`;

const medium14 = css`
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.3;
`;

const medium12 = css`
  font-size: 1.2rem;
  font-weight: 500;
`;

const regular28 = css`
  font-size: 2.8rem;
  font-weight: 400;
  line-height: 1.6;
`;

const regular24 = css`
  font-size: 2.4rem;
  font-weight: 400;
  line-height: 1.6;
`;

const regular20 = css`
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.6;
`;

const regular18 = css`
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1.6;
`;

const regular16 = css`
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6;
`;

const regular14 = css`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.6;
`;

const regular12 = css`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.3;
`;

const regular10 = css`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.3;
`;

const size = {
  mobile: '767px',
  tablet: '1023px',
  desktop: '1024px',
};

const device = {
  mobile: `screen and (max-width: ${size.mobile})`,
  tablet: `screen and (max-width: ${size.tablet})`,
  desktop: `screen and (min-width: ${size.desktop})`,
};

const font = {
  bold30,
  bold28,
  bold24,
  bold22,
  bold20,
  bold18,
  bold16,
  bold14,
  bold12,
  bold10,
  semibold16,
  medium28,
  medium24,
  medium20,
  medium18,
  medium16,
  medium14,
  medium12,
  regular28,
  regular24,
  regular20,
  regular18,
  regular16,
  regular14,
  regular12,
  regular10,
};

const color = {
  gray: {
    black: '#000000',
    gray900: '#0f0f0f',
    gray800: '#282828',
    gray700: '#424242',
    gray600: '#5B5B5B',
    gray500: '#757575',
    gray400: '#8E8E8E',
    gray300: '#A8A8A8',
    gray200: '#C1C1C1',
    gray100: '#DBDBDB',
    gray50: '#f4f4f4',
    white: '#ffffff',
  },
  brand: {
    darken400: '#03110B',
    darken300: '#0B391F',
    darken200: '#146734',
    darken100: '#1D9B4D',
    main: '#2EBC5D',
    lighten100: '#9ce7b5',
    lighten200: '#c5f1d4',
  },
  semantic: {
    error: '#FF5B7A',
    errorContainer1: '#910021',
    errorContainer2: '#2791FE',
    errorContainer3: '#F1F8FF',
  },
};

export const theme = {
  font,
  color,
  device,
};

export type Theme = typeof theme;
