import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Flex,
  Button,
  Spinner,
  Image,
  Stack
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";

const StudentDashboardPage = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [data, setData] = useState({
    totalCourses: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    courses: [],
    completedCourses: [] // Thêm completedCourses
  });
  const [loading, setLoading] = useState(true);

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/assignments/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      const res = await axios.get("/api/reports/student-dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box bg="#f7f9fa" minH="100vh">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        {/* Dashboard Heading */}
        <Heading mb={8}>Student Dashboard</Heading>

        {/* Overview */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          <Card>
            <CardBody>
              <Text color="gray.500">My Courses</Text>
              <Heading>{data?.totalCourses}</Heading>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Text color="gray.500">Assignments</Text>
              <Heading>{data?.totalAssignments}</Heading>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Text color="gray.500">Completed</Text>
              <Heading>{data?.completedAssignments}</Heading>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Continue Learning */}
        <Heading size="md" mb={4}>
          Continue Learning
        </Heading>

        {data.courses.length === 0 ? (
          <Text color="gray.500" mb={10}>
            No courses available
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
            {data.courses.map((course) => (
              <Card key={course._id}>
                <CardBody>
                  <Stack spacing={4}>
                    <Image
                      src={course.thumbnail || "https://via.placeholder.com/400x200"}
                      borderRadius="md"
                    />
                    <Heading size="sm">{course.title}</Heading>
                    <Button
                      bg="#A435F0"
                      color="white"
                      _hover={{ bg: "#8710d8" }}
                      onClick={() => navigate(`/courses/${course._id}/learn`)}
                    >
                      Continue
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Assignments */}
        <Heading size="md" mb={4}>
          Your Assignments
        </Heading>

        {assignments.length === 0 ? (
          <Text color="gray.500" mb={10}>No assignments available</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
            {assignments.map((assignment) => (
              <Card key={assignment._id}>
                <CardBody>
                  <Stack spacing={4}>
                    <Heading size="sm">{assignment.title}</Heading>
                    <Text fontSize="sm" color="gray.600">
                      {assignment.course?.title}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </Text>
                    <Button
                      bg="#A435F0"
                      color="white"
                      _hover={{ bg: "#8710d8" }}
                      onClick={() => navigate(`/assignments/${assignment._id}`)}
                    >
                      View Assignment
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Completed Courses */}
        <Heading size="md" mb={4}>
          Completed Courses
        </Heading>

        {data.completedCourses.length === 0 ? (
          <Text color="gray.500" mb={10}>No completed courses yet</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {data.completedCourses.map((course) => (
              <Card key={course._id}>
                <CardBody>
                  <Stack spacing={4}>
                    <Image
                      src={course.thumbnail || "https://via.placeholder.com/400x200"}
                      borderRadius="md"
                    />
                    <Heading size="sm">{course.title}</Heading>
                    <Button
                      bg="gray.400"
                      color="white"
                      cursor="not-allowed"
                    >
                      Completed
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default StudentDashboardPage;