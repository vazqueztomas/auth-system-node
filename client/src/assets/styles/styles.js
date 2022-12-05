import styled from 'styled-components';

export const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 30rem;
  width: 100%;
  gap: ${(props) => props.gap};
`;

export const Label = styled.label`
  font-size: ${(props) => (props.size ? `${props.size}rem` : "1.7rem")};
  margin: 0.3em 0;
  line-height: 0.9;
  display: block;
  text-align: ${(props) => props.textalign};
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: "18px 0";
  @media (min-width: 1024px) {
    align-items: center;
    justify-content: center;
  }
`;

export const Input = styled.input`
  border: 3px solid var(--white);
  border-radius: 5px;
  padding: 0.5em;
  margin-bottom: 0.5em;
  font-size: 0.8rem;
  &:focus {
    outline: none;
    border: 3px solid var(--blue);
  }
  width: 100%;
  max-width: 70vh;
  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

export const ErrorPanel = styled.p`
  background: var(--black);
  color: var(--white);
  border: 5px solid var(--red);
  padding: 0.2em;
  margin: 0.5em;
  text-align: center;
  font-style: italic;
  font-size: 1.5rem;
  border-radius: 15px;
`;

export const Checkbox = styled.input`
  vertical-align: middle;
  min-width: 2rem;
  height: 2rem;
  background-color: var(--black);
  border: 2px solid var(--red);
  cursor: pointer;
  border-radius: 50%;
  margin-right: 0.5rem;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  margin-top: 0.1rem;
  &:checked {
    background-color: var(--black);
    border: 2px solid var(--white);
    box-shadow: -2px 2px 9px var(--blue);
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;