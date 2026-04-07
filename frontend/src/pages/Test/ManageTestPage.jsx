import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  Text,
  Flex,
  Spinner,
  useToast,
  Input,
  Badge,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getAllTestsAPI,
  deleteTestAPI,
} from "../../api/test.api";

import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";

const ManageTestPage = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [user, setUser] = useState(null); // ✅ thêm

  const navigate = useNavigate();
  const toast = useToast();

  // ================= GET USER =================
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Fetch user error:", err);
    }
  };

  // ================= FETCH TESTS =================
  const fetchTests = async () => {
    try {
      const data = await getAllTestsAPI();
      setTests(data);
      setFilteredTests(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error loading tests",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();   // ✅ gọi user
    fetchTests();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = tests.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTests(filtered);
  }, [search, tests]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this test?")) return;

    try {
      await deleteTestAPI(id);

      const updated = tests.filter((t) => t._id !== id);
      setTests(updated);
      setFilteredTests(updated);

      toast({
        title: "Test deleted",
        status: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Delete failed",
        status: "error",
      });
    }
  };

  // ================= UI =================
  return (
    <Box>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manage Tests</Heading>

        {/* chỉ instructor mới tạo */}
        {user?.role === "INSTRUCTOR" && (
          <Button
            colorScheme="blue"
            onClick={() => navigate("/dashboard/create-test")}
          >
            + Create Test
          </Button>
        )}
      </Flex>

      {/* SEARCH */}
      <Input
        placeholder="Search test..."
        mb={6}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CONTENT */}
      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="lg" />
        </Flex>
      ) : filteredTests.length === 0 ? (
        <Text>No tests found</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {filteredTests.map((test) => (
            <Box
              key={test._id}
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
            >
              <Heading size="md" mb={2}>
                {test.title}
              </Heading>

              <Text fontSize="sm" color="gray.600">
                Course: {test.course?.title}
              </Text>

              <Text fontSize="sm" color="gray.600" mb={2}>
                Instructor: {test.instructor?.name || "N/A"}
              </Text>

              <Badge colorScheme="purple" mb={3}>
                {test.questions?.length || 0} questions
              </Badge>

              <Text fontWeight="bold" mb={4}>
                Total: {test.totalMarks} marks
              </Text>

              <Flex gap={2} wrap="wrap">
                {/* EDIT - chỉ instructor */}
                {user?.role === "INSTRUCTOR" && (
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    onClick={() =>
                      navigate(`/dashboard/tests/${test._id}`)
                    }
                  >
                    Edit
                  </Button>
                )}

                {/* DELETE */}
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(test._id)}
                >
                  Delete
                </Button>

                {/* SUBMISSIONS */}
                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={() =>
                    navigate(`/dashboard/test-submissions?testId=${test._id}`)
                  }
                >
                  Submissions
                </Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ManageTestPage;