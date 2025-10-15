import React, { forwardRef } from "react";
import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";

export interface ButtonProps extends Omit<AntButtonProps, "type" | "variant"> {
  Icon?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary";
  htmlType?: "button" | "submit" | "reset";
  className?: string;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      Icon,
      loading = false,
      children,
      variant = "primary",
      htmlType = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    const variantClass =
      variant === "primary"
        ? "!bg-[#121329] !text-white"
        : "!bg-white !text-gray-800 border !border-gray-200";

    return (
      <AntButton
        ref={ref as React.Ref<HTMLButtonElement>}
        htmlType={htmlType}
        loading={loading}
        className={`!rounded-full h-14 px-6 ${variantClass} ${className}`}
        {...props}
      >
        {Icon && <span className="mr-3">{Icon}</span>}
        {children}
      </AntButton>
    );
  }
);

Button.displayName = "Button";