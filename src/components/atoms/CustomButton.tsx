import styled from 'styled-components';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'disabled';
  backgroundColor?: string;
  textColor?: string;
  marginTop?: string;
  marginBottom?: string;
}

const CustomButton = ({
  children,
  variant = 'primary',
  backgroundColor,
  textColor,
  marginTop = '0',
  marginBottom = '0',
  disabled = false,
  ...rest
}: CustomButtonProps) => {
  return (
    <StyledButton
      $variant={variant}
      $backgroundColor={backgroundColor}
      $textColor={textColor}
      $marginTop={marginTop}
      $marginBottom={marginBottom}
      disabled={disabled}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'disabled';
  $backgroundColor?: string;
  $textColor?: string;
  $marginTop?: string;
  $marginBottom?: string;
  disabled?: boolean;
}>`
  width: 100%;
  height: 4.8rem;
  border-radius: 0.8rem;
  margin-top: ${({ $marginTop }) => $marginTop};
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
  ${({ theme }) => theme.font.semibold16};

  background-color: ${({ $variant, $backgroundColor, theme, disabled }) => {
    if (disabled || $variant === 'disabled') return theme.color.gray.gray50;
    if ($backgroundColor) return $backgroundColor;

    switch ($variant) {
      case 'primary':
        return theme.color.brand.main;
      case 'secondary':
        return 'white';
      default:
        return theme.color.brand.main;
    }
  }};

  color: ${({ $variant, $textColor, theme, disabled }) => {
    if (disabled || $variant === 'disabled') return theme.color.gray.gray400;
    if ($textColor) return $textColor;

    switch ($variant) {
      case 'primary':
        return 'white';
      case 'secondary':
        return theme.color.gray.gray200;
      default:
        return 'white';
    }
  }};

  border: ${({ $variant, theme }) =>
    $variant === 'secondary'
      ? `1px solid ${theme.color.gray.gray100}`
      : 'none'};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

export default CustomButton;
