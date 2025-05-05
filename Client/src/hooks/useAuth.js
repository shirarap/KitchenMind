import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../features/auth/authSlice";

/**
 * הוק מותאם אישית לניהול התחברות/התנתקות
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const signIn = (email, password) => {
    // שלב התחברות (כרגע מדומה)
    dispatch(login({ email }));
  };

  const signOut = () => {
    dispatch(logout());
  };

  return { user, signIn, signOut };
};
