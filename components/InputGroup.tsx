
import React from 'react';

interface InputGroupProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, children, required }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);
