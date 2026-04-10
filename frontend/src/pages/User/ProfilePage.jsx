import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Spinner
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { getUserByIdAPI, updateUserAPI } from "../../api/user.api";

const ProfilePage = () => {
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  // 👉 lấy userId từ localStorage (bạn đang lưu khi login)
  const userId = localStorage.getItem("userId");

  // ================= LOAD USER =================
  const fetchUser = async () => {
    try {
      const res = await getUserByIdAPI(userId);
      const data = res.user;

      setUser(data);
      setForm({
        name: data.name,
        email: data.email,
        password: ""
      });

    } catch (err) {
      toast({
        title: "Error loading profile",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      const payload = {
        name: form.name,
        email: form.email
      };

      // chỉ gửi password nếu có nhập
      if (form.password) {
        payload.password = form.password;
      }

      await updateUserAPI(userId, payload);

      toast({
        title: "Profile updated successfully",
        status: "success"
      });

      fetchUser();

    } catch (err) {
      toast({
        title: err.response?.data?.message || "Update failed",
        status: "error"
      });
    }
  };

  // ================= UI =================
  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Container maxW="lg" py={10}>
      <Heading mb={6}>My Profile</Heading>

      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password (optional)</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={handleChange}
          />
        </FormControl>

        <Box>
          <Text fontWeight="bold">Role:</Text>
          <Text color="blue.500">{user.role}</Text>
        </Box>

        <Button colorScheme="blue" onClick={handleUpdate}>
          Update Profile
        </Button>
      </VStack>
    </Container>
  );
};

export default ProfilePage;