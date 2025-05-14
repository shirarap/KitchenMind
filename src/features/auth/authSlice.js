import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// יצירת תאנק לתהליך ההתחברות
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/loginUser', userData);
      // שמירת הטוקן ב-localStorage
      localStorage.setItem('token', response.data.token);
      return response.data; // מחזיר את הנתונים מהשרת (טוקן ושם משתמש)
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'התחברות נכשלה');
    }
  }
);

// יצירת תאנק לתהליך ההרשמה
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/registerUser', userData);
      // שמירת הטוקן ב-localStorage
      localStorage.setItem('token', response.data.token);
      return response.data; // מחזיר את הנתונים מהשרת (טוקן ושם משתמש)
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'הרשמה נכשלה');
    }
  }
);

// יצירת תאנק לקבלת נתוני המשתמש
export const fetchUserData = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await axios.get('/api/users/getUser', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data; // מחזיר את נתוני המשתמש המלאים
    } catch (error) {
      localStorage.removeItem('token'); // מוחק את הטוקן אם הוא לא תקף
      return rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת נתוני משתמש');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // מצבי התחברות
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          // שים לב: אנחנו מתאימים את המבנה של המשתמש לפי מה שמגיע מהשרת
          name: action.payload.UserName // שימוש ב-UserName במקום name
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // מצבי הרשמה
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          // שים לב: אנחנו מתאימים את המבנה של המשתמש לפי מה שמגיע מהשרת
          name: action.payload.UserName // שימוש ב-UserName במקום name
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // מצבי טעינת נתוני משתמש
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = {
            // כאן אנחנו מקבלים את המשתמש המלא, עם כל השדות שלו
            // אנחנו שומרים את השם כ-name לשימוש ב-Navbar
            name: action.payload.UserName,
            // שמירת שאר הנתונים כמו שהם
            ...action.payload
          };
          state.isAuthenticated = true;
        }
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;