import React, { useState } from "react";

interface InputProps {
  value?: string;
  type?: string;
  variants?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

const variants = {
  signIn: "",
};

const Input: React.FC<InputProps> = ({
  value,
  type = "text",
  variants,
  onChange,
  disabled,
  label,
  ...props
}) => {
  return (
    <div className="pb-4">
      <label className="relative">
        <input
          value={value != null ? value : ""}
          type={type}
          placeholder={label}
          onChange={onChange}
          className={` w-full p-4 border border-ink-200 rounded-xl outline-none focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-ink-50 ${variants} `}
          {...props}
        />
        {variants === "signIn" && (
          <span className="text-up absolute top-1/2 left-4 transform -translate-y-1/2 focus-within:text-blue-500 transition duration-200 text-gray-400">
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

export default Input;
