import { validateUserPermissions } from "../utils/validateUserPermissions";
import { useAuth } from "./auth";

interface CanParams {
  permissions?: string[];
  roles?: string[];
}

export const useCan = ({ permissions = [], roles = [] }: CanParams) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
};
