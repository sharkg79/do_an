import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Select,
  useToast,
  FormControl,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";

const CreateUserPage = () => {
  const { id } = useParams(); // 👈 lấy id nếu edit
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  const toast = useToast();
  const navigate = useNavigate();

  // ================= FETCH USER (EDIT MODE) =================
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/api/users/${id}`);
      const data = res.data.user;

      setForm({
        name: data?.name || "",
        email: data?.email || "",
        password: "", // ❗ không fill password
        role: data?.role || "STUDENT",
      });
    } catch (err) {
      toast({
        title: "Load user failed",
        status: "error",
      });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isEdit) fetchUser();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      return toast({
        title: "Name & Email are required",
        status: "warning",
      });
    }

    if (!isEdit && !form.password) {
      return toast({
        title: "Password is required",
        status: "warning",
      });
    }

    setLoading(true);

    try {
      if (isEdit) {
        await axiosInstance.put(`/api/users/${id}`, form);

        toast({
          title: "User updated successfully",
          status: "success",
        });
      } else {
        await axiosInstance.post("/api/users", form);

        toast({
          title: "User created successfully",
          status: "success",
        });
      }

      navigate("/dashboard/users");
    } catch (err) {
      toast({
        title:
          err.response?.data?.message ||
          (isEdit ? "Update failed" : "Create failed"),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (loadingData) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Box maxW="500px" mx="auto" mt={10}>
      <Heading size="lg" mb={6}>
        {isEdit ? "Update User" : "Create User"}
      </Heading>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </FormControl>

            {/* PASSWORD (chỉ bắt buộc khi create) */}
            <FormControl>
              <FormLabel>
                Password {isEdit && "(leave blank to keep current)"}
              </FormLabel>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="INSTRUCTOR">INSTRUCTOR</option>
                <option value="ADMIN">ADMIN</option>
              </Select>
            </FormControl>

            <Button
              colorScheme="teal"
              type="submit"
              width="full"
              isLoading={loading}
            >
              {isEdit ? "Update User" : "Create User"}
            </Button>

            <Button
              variant="outline"
              width="full"
              onClick={() => navigate("/dashboard/users", { replace: true })}
            >
              Cancel
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CreateUserPage;