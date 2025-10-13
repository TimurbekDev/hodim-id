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
    const buttonStyle =
      variant === "primary"
        ? ""
        : "";

    return (
      <AntButton
        ref={ref as any}
        htmlType={htmlType}
        loading={loading}
        className={`!bg-accent-primary !text-label-opposite !rounded-4xl  ${buttonStyle} ${className}`}
        {...props}
      >
        {Icon && <span className="mr-2">{Icon}</span>}
        {children}
      </AntButton>
    );
  }
);

Button.displayName = "Button";