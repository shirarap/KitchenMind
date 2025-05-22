import { useSelector, useDispatch } from "react-redux";
import { logout, getUserDetails } from "../features/auth/authSlice";
import { useEffect } from "react";

/**
 * הוק מותאם אישית לניהול התחברות/התנתקות וסטטוס המשתמש
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  // בדיקה אוטומטית של סטטוס המשתמש אם קיים טוקן
  useEffect(() => {
    if (token && !user) {
      dispatch(getUserDetails());
    }
  }, [token, user, dispatch]);

  const isAuthenticated = !!user;

  const signOut = () => {
    dispatch(logout());
  };

  return { 
    user, 
    token, 
    loading, 
    isAuthenticated,
    signOut 
  };
};

export default useAuth;