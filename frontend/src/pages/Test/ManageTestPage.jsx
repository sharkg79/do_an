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
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getTestsAPI,
  deleteTestAPI,
} from "../../api/test.api";

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ManageTestPage = () => {
  const { classId } = useParams(); // ✅ giống assignment
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { user, loading: authLoading } = useAuth();

  const navigate = useNavigate();
  const toast = useToast();

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTestsAPI(classId);
        setTests(data);
        setFilteredTests(data);
      } catch (err) {
        toast({
          title: err.message || "Fetch failed",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId]);

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
      toast({
        title: err.message || "Delete failed",
        status: "error",
      });
    }
  };

  // ================= PERMISSION =================
  const canEdit = (test) => {
    if (user?.role?.toUpperCase() === "ADMIN") return true;

    if (user?.role?.toUpperCase() === "INSTRUCTOR") {
      return (
        test.instructor?._id?.toString() ===
        user._id?.toString()
      );
    }

    return false;
  };

  // ================= LOADING =================
  if (loading || authLoading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manage Tests</Heading>

        {(user?.role?.toUpperCase() === "INSTRUCTOR" ||
          user?.role?.toUpperCase() === "ADMIN") && (
          <Button
            colorScheme="blue"
            onClick={() =>
              navigate(`/dashboard/create-test/${classId}`)
            }
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
      {filteredTests.length === 0 ? (
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

              <Text fontSize="sm" color="gray.600" mb={2}>
                Questions: {test.questions?.length || 0}
              </Text>

              <Text fontSize="sm" mb={2}>
                Total Marks: {test.totalMarks}
              </Text>

              <Text fontSize="sm" mb={2}>
                Due:{" "}
                {test.dueDate
                  ? new Date(test.dueDate).toLocaleDateString()
                  : "N/A"}
              </Text>

              <Text fontSize="sm" color="gray.500" mb={4}>
                Created by: {test.instructor?.name}
              </Text>

              <Flex gap={2} wrap="wrap">
                {canEdit(test) && (
                  <>
                    <Button
                      size="sm"
                      colorScheme="yellow"
                      onClick={() =>
                        navigate(
                          `/dashboard/create-test/${classId}`,
                          { state: { test } }
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(test._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}

                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={() =>
                    navigate(
                      `/dashboard/tests/${test._id}/submissions`
                    )
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