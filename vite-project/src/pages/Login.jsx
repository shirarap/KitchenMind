import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
  
    const onSubmit = async (data) => {
      try {
        const res = await axios.post("http://localhost:5000/api/users/login", data);
        localStorage.setItem("token", res.data.token); // שמירת הטוקן
        navigate("/products"); // לדוגמה: מעבר לעמוד המוצרים אחרי התחברות
      } catch (error) {
        console.error(error.response?.data?.message || "Login failed");
      }
    };
  
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("email")} placeholder="Email" type="email" />
          <input {...register("password")} placeholder="Password" type="password" />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  
  export default Login;
  