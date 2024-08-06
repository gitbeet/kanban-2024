import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

interface SmallMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SmallMenu = forwardRef<HTMLDivElement, SmallMenuProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={`menu-bg p-3 ${props.className}`}>
        {children}
      </div>
    );
  },
);

SmallMenu.displayName = "SmallMenu";
