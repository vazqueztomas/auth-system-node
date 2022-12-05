import React, { ButtonHTMLAttributes, ReactNode } from "react";
import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover{
    border-color: #646cff;
  }

  &:focus, &:focus-visible{
    outline: 4px auto -webkit-focus-ring-color;
  }
`

interface Props {
  children?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'submit' | 'reset' | 'button' | undefined;
}
const MainButton = ({ children }: Props) => {
  return <Button>{children}</Button>
}

export default MainButton;