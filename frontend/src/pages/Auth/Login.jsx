import { useState, useContext } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../api/auth.api";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  try {
    const res = await loginAPI(form);

    // ❌ KHÔNG cần lưu lại nữa (đã làm trong API)
    // localStorage.setItem("token", res.data.token);
    // localStorage.setItem("user", JSON.stringify(res.data.user));

    login(res); // vì res đã là res.data

    toast({
      title: "Login success",
      status: "success",
      duration: 2000
    });

    // ✅ điều hướng đúng
    if (res.user.role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }

  } catch (err) {
    toast({
      title: err.response?.data?.message || "Login failed",
      status: "error",
      duration: 2000
    });
  }
};
  return (
    <>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Log in to your account
        </Text>

        <VStack spacing={4}>
          <Input
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />

          <Input
            placeholder="Password"
            type="password"
            name="password"
            onChange={handleChange}
          />

          <Button w="100%" onClick={handleSubmit}>
            Login
          </Button>
        </VStack>

        <Text mt={4} fontSize="sm" textAlign="center">
          Don’t have an account?{" "}
          <span
            style={{ color: "#A435F0", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </Text>
    </>
  );
};

export default Login;