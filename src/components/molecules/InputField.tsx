import React from 'react';
import styled from 'styled-components';

interface InputFieldProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  children?: React.ReactNode; // 아이콘 영역 등
  isValid?: boolean;
  helperMessage?: string; // ✅ 성공 or 에러 모두 표현
  marginBottom?: string;
}

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  children,
  isValid = true,
  helperMessage,
  marginBottom,
}: InputFieldProps) => {
  return (
    <Wrapper $marginBottom={marginBottom}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <InputContainer>
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          $isValid={isValid}
        />
        {children}
      </InputContainer>
      {helperMessage && (
        <HelperText $isValid={isValid}>{helperMessage}</HelperText>
      )}
    </Wrapper>
  );
};

export default InputField;

const Wrapper = styled.div<{ $marginBottom?: string }>`
  margin-bottom: ${({ $marginBottom }) => $marginBottom || '1.6rem'};
`;

const Label = styled.label`
  display: block;
  ${({ theme }) => theme.font.bold14};
  color: ${({ theme }) => theme.color.brand.main};
  margin-bottom: 0.8rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input<{ $isValid: boolean }>`
  width: 100%;
  padding: 1.1rem 1.4rem;
  ${({ theme }) => theme.font.regular16};
  color: ${({ theme }) => theme.color.gray.gray800};
  border: 1px solid
    ${({ theme, $isValid }) =>
      $isValid ? theme.color.gray.gray200 : theme.color.semantic.error};
  border-radius: 0.8rem;
  &:focus {
    border-color: ${({ theme }) => theme.color.brand.main};
  }
`;

export const StyledIconButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
`;

const HelperText = styled.p<{ $isValid?: boolean }>`
  ${({ theme }) => theme.font.regular12};
  color: ${({ theme, $isValid }) =>
    $isValid === false ? theme.color.semantic.error : theme.color.brand.main};
  margin-top: 0.8rem;
`;
