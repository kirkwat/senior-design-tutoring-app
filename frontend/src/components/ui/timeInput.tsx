import React, { ChangeEvent, useState } from "react";

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <input
        type="time"
        value={value}
        onChange={handleInputChange}
        className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default TimeInput;
