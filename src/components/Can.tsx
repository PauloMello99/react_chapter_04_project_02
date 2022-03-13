import { ReactNode } from "react";
import { useCan } from "../hooks/can";

interface CanProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}

export const Can = ({ children, permissions = [], roles = [] }: CanProps) => {
  const userCanSeeComponent = useCan({ permissions, roles });

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
};
