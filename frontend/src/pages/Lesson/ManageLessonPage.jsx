import {
  Box,
  Heading,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Spinner,
  useToast,
  Text,
  Flex,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const ManageLessonPage = () => {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { classId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // ================= FETCH =================
  const fetchData = async () => {
  setLoading(true);
  try {
    let res;

    if (classId) {
      res = await axiosInstance.get(`/api/lessons/class/${classId}`);
    } else {
      res = await axiosInstance.get("/api/lessons");
    }

    const lessonsData = res.data.lessons;

    setLessons(lessonsData);
    setFilteredLessons(lessonsData);

  } catch (err) {
    console.error("ERROR:", err);
    console.error("RESPONSE:", err.response);

    toast({
      title: err.response?.data?.message || "Load lessons failed",
      status: "error",
    });
  } finally {
    setLoading(false); // ✅ QUAN TRỌNG
  }
};

  useEffect(() => {
    fetchData();
  }, [classId]);

  // ================= SEARCH =================
  useEffect(() => {
    const result = lessons.filter((l) =>
      l.title?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLessons(result);
    setCurrentPage(1);
  }, [search, lessons]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);

  const paginatedLessons = filteredLessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;

    try {
      await axiosInstance.delete(`/api/lessons/${id}`);

      toast({
        title: "Deleted successfully",
        status: "success",
      });

      fetchData();
    } catch {
      toast({
        title: "Delete failed",
        status: "error",
      });
    }
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
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">
          Manage Lessons {classId && "(Class View)"}
        </Heading>

        {role === "instructor" && (
          <Button
            colorScheme="teal"
            onClick={() =>
              navigate(`/dashboard/create-lesson/${classId}`)
            }
          >
            + Add Lesson
          </Button>
        )}
      </Flex>

      {/* SEARCH */}
      <Box mb={4}>
        <Input
          placeholder="Search lesson..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* TABLE */}
      <Box bg="white" p={4} borderRadius="lg" boxShadow="md">
        {filteredLessons.length === 0 ? (
          <Text>No lessons found</Text>
        ) : (
          <>
            <Table>
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Class</Th>
                  <Th>Content</Th>
                  <Th>Created At</Th>
                  <Th isNumeric>Actions</Th>
                </Tr>
              </Thead>

              <Tbody>
                {paginatedLessons.map((lesson) => (
                  <Tr key={lesson._id}>
                    <Td>{lesson.title}</Td>

                    <Td>{lesson.class?.title || "N/A"}</Td>

                    {/* ✅ FIX content */}
                    <Td>
                      {lesson.contentUrl
                        ? lesson.contentUrl.slice(0, 50) + "..."
                        : "No content"}
                    </Td>

                    <Td>
                      {lesson.createdAt
                        ? new Date(lesson.createdAt).toLocaleDateString()
                        : "N/A"}
                    </Td>

                    <Td isNumeric>
                      <HStack justify="flex-end">
                        {role === "instructor" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/dashboard/edit-lesson/${lesson._id}`
                              )
                            }
                          >
                            Edit
                          </Button>
                        )}

                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() =>
                            handleDelete(lesson._id)
                          }
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* PAGINATION */}
            <Flex justify="space-between" mt={4} align="center">
              <Text>
                Page {currentPage} / {totalPages || 1}
              </Text>

              <HStack>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  isDisabled={currentPage === 1}
                >
                  Prev
                </Button>

                <Button
                  size="sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  isDisabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ManageLessonPage;