import React from 'react';

interface WrapperProps {
    children: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="flex flex-col text-center m-4 items-center">
      {children}
    </div>
  );
};