import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const serverUrl = import.meta.env.VITE_SERVER_URL;

            await axios.post(`${serverUrl}/api/users/register`, data);

            console.log(res.data); // לבדוק שחוזר תשובה מהשרת
            navigate("/login"); // אחרי הרשמה עוברים להתחברות
        } catch (error) {
            console.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("userName")} placeholder="Username" />
                <input {...register("email")} placeholder="Email" type="email" />
                <input {...register("password")} placeholder="Password" type="password" />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
