import { useState } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../api/auth.api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await registerAPI(form);

      toast({
        title: "Register success",
        status: "success",
        duration: 2000
      });

      navigate("/login");

    } catch (err) {
      toast({
        title: err.response?.data?.message || "Register failed",
        status: "error",
        duration: 2000
      });
    }
  };

  return (
    <>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Sign up and start learning
        </Text>

        <VStack spacing={4}>
          <Input
            placeholder="Full name"
            name="name"
            onChange={handleChange}
          />

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
            Sign Up
          </Button>
        </VStack>

        <Text mt={4} fontSize="sm" textAlign="center">
          Already have an account?{" "}
          <span
            style={{ color: "#A435F0", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </Text>
    </>
  );
};

export default Register;