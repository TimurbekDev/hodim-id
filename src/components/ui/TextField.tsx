import React from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';

export interface TextFieldProps extends InputProps {
  label?: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm text-gray-600 mb-1">{label}</label>}
      <Input {...props} />
    </div>
  );
};

export default TextField;
