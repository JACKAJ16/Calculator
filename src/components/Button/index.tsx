import React from 'react';
// style
import './style.scss';

interface ButtonProps {
  value?: string;
  className: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ value, className, onClick }: ButtonProps) => {
  return (
    <div className={`button ${className}`} onClick={onClick}>
      {value}
    </div>
  );
};

export default Button;
