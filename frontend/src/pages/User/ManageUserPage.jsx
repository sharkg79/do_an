import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Button,
  Spinner,
  useToast,
  Text,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/users";

const ManageUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const toast = useToast();

  // ================= FETCH =================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (err) {
      toast({
        title: "Load users failed",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "User deleted",
        status: "success",
        duration: 2000,
      });

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast({
        title: "Delete failed",
        status: "error",
        duration: 3000,
      });
    }
  };

  // ================= UPDATE ROLE =================
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axios.put(
        `${API}/${id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Role updated",
        status: "success",
        duration: 2000,
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? res.data.user : u))
      );
    } catch (err) {
      toast({
        title: "Update role failed",
        status: "error",
        duration: 3000,
      });
    }
  };

  // ================= ROLE COLOR =================
  const getRoleColor = (role) => {
    if (role === "ADMIN") return "red";
    if (role === "INSTRUCTOR") return "blue";
    return "gray";
  };

  // ================= UI =================
  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        User Management
      </Heading>

      {users.length === 0 ? (
        <Text>No users found</Text>
      ) : (
        <Box
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="md"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Change Role</Th>
                <Th isNumeric>Actions</Th>
              </Tr>
            </Thead>

            <Tbody>
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td fontWeight="medium">{user.name}</Td>

                  <Td>{user.email}</Td>

                  {/* CURRENT ROLE */}
                  <Td>
                    <Badge colorScheme={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </Td>

                  {/* CHANGE ROLE */}
                  <Td>
                    <Select
                      size="sm"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="INSTRUCTOR">INSTRUCTOR</option>
                      <option value="STUDENT">STUDENT</option>
                    </Select>
                  </Td>

                  {/* ACTION */}
                  <Td isNumeric>
                    <HStack justify="flex-end">
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default ManageUserPage;