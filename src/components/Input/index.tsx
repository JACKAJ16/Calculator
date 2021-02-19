import React from 'react';
// style
import './style.scss';

interface InputProps {
  input: string;
  result: string;
}

const Input: React.FC<InputProps> = ({ input, result }: InputProps) => (
  <div className="input">
    <div className="input__inner">
      <div className="input__value">{input}</div>
      <div className="input__result">{result}</div>
    </div>
  </div>
);

export default Input;
