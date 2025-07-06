import 'styled-components';

interface Font {
  bold30: RuleSet<object>;
  bold28: RuleSet<object>;
  bold24: RuleSet<object>;
  bold22: RuleSet<object>;
  bold20: RuleSet<object>;
  bold18: RuleSet<object>;
  bold16: RuleSet<object>;
  bold14: RuleSet<object>;
  bold12: RuleSet<object>;
  bold10: RuleSet<object>;
  semibold16: RuleSet<object>;
  medium28: RuleSet<object>;
  medium24: RuleSet<object>;
  medium20: RuleSet<object>;
  medium18: RuleSet<object>;
  medium16: RuleSet<object>;
  medium14: RuleSet<object>;
  medium12: RuleSet<object>;
  regular28: RuleSet<object>;
  regular24: RuleSet<object>;
  regular20: RuleSet<object>;
  regular18: RuleSet<object>;
  regular16: RuleSet<object>;
  regular14: RuleSet<object>;
  regular12: RuleSet<object>;
  regular10: RuleSet<object>;
  [key: string]: RuleSet<object>;
}

interface Color {
  gray: {
    black: string;
    gray900: string;
    gray800: string;
    gray700: string;
    gray600: string;
    gray500: string;
    gray400: string;
    gray300: string;
    gray200: string;
    gray100: string;
    gray50: string;
    white: string;
  };
  brand: {
    darken400: string;
    darken300: string;
    darken200: string;
    darken100: string;
    main: string;
    lighten100: string;
    lighten200: string;
  };
  semantic: {
    error: string;
    errorContainer1: string;
    errorContainer2: string;
    errorContainer3: string;
  };
}

interface Device {
  mobile: string;
  tablet: string;
  desktop: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    color: Color;
    font: Font;
    device: Device;
  }
}
