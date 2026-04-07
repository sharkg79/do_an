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
  getCoursesAPI,
  deleteCourseAPI,
} from "../../api/course.api";

import { useNavigate } from "react-router-dom";

const ManageCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  // ================= FETCH =================
  const fetchCourses = async () => {
    try {
      const data = await getCoursesAPI();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error loading courses",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = courses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [search, courses]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await deleteCourseAPI(id);

      const updated = courses.filter((c) => c._id !== id);
      setCourses(updated);
      setFilteredCourses(updated);

      toast({
        title: "Course deleted",
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
        <Heading size="lg">Manage Courses</Heading>

        <Button
          colorScheme="blue"
          onClick={() => navigate("/dashboard/create-course")}
        >
          + Create Course
        </Button>
      </Flex>

      {/* SEARCH */}
      <Input
        placeholder="Search course..."
        mb={6}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CONTENT */}
      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="lg" />
        </Flex>
      ) : filteredCourses.length === 0 ? (
        <Text>No courses found</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {filteredCourses.map((course) => (
            <Box
              key={course._id}
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
            >
              <Heading size="md" mb={2}>
                {course.title}
              </Heading>

              <Text fontSize="sm" color="gray.600" mb={3}>
                {course.description}
              </Text>

              <Text fontWeight="bold" mb={4}>
                ${course.price || 0}
              </Text>

              <Flex gap={2} wrap="wrap">
                {/* EDIT */}
                <Button
                  size="sm"
                  colorScheme="yellow"
                  onClick={() =>
                    navigate(`/dashboard/create-course/${course._id}`)
                  }
                >
                  Edit
                </Button>

                {/* DELETE */}
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </Button>

                {/* MANAGE CLASS */}
                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={() =>
                    navigate(`/dashboard/courses/${course._id}/classes`)
                  }
                >
                  Classes
                </Button>
              </Flex>
            </Box>
          ))}
          
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ManageCoursePage;