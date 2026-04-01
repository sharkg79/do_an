import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  VStack,
  HStack,
  Divider,
  Badge,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getLessonsByCourse } from "../../services/lessonService";

const CourseDetailPage = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/courses/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCourse(res.data.course);
      setClasses(res.data.classes);

      const lessonData = await getLessonsByCourse(id);
      setLessons(lessonData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="80vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!course) {
    return <Text>Course not found</Text>;
  }

  return (
    <Box bg="#f7f9fa" minH="100vh">
      {/* HERO */}
      <Box bg="white" py={10} borderBottom="1px solid #e2e8f0">
        <Container maxW="7xl">
          <Heading mb={3}>{course.title}</Heading>

          <Text color="gray.600" mb={2}>
            {course.description}
          </Text>

          <HStack spacing={4}>
            <Text fontWeight="bold">
              Instructor: {course.instructor?.name}
            </Text>

            <Badge colorScheme="purple">
              {course.categories || "General"}
            </Badge>
          </HStack>
        </Container>
      </Box>

      {/* CONTENT */}
      <Container maxW="7xl" py={10}>
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
          
          {/* LEFT */}
          <GridItem>
            {/* CLASSES */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="lg">
              <Heading size="md" mb={4}>
                Classes
              </Heading>

              <VStack align="stretch" spacing={3}>
                {classes.length === 0 && <Text>No classes</Text>}

                {classes.map((cls) => (
                  <Box
                    key={cls._id}
                    p={4}
                    border="1px solid #e2e8f0"
                    borderRadius="md"
                    _hover={{ bg: "#fafafa" }}
                  >
                    <Text fontWeight="bold">{cls.title}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {cls.instructor?.name}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* LESSONS */}
            <Box
              bg="white"
              p={6}
              mt={6}
              borderRadius="lg"
              boxShadow="lg"
            >
              <Heading size="md" mb={4}>
                Lessons
              </Heading>

              <VStack align="stretch" spacing={3}>
                {lessons.length === 0 && <Text>No lessons</Text>}

                {lessons.map((lesson) => (
                  <Box
                    key={lesson._id}
                    p={4}
                    border="1px solid #e2e8f0"
                    borderRadius="md"
                    _hover={{ bg: "#fafafa" }}
                  >
                    <Text fontWeight="bold">{lesson.title}</Text>

                    <Text fontSize="sm" color="gray.500">
                      {lesson.description}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </GridItem>

          {/* RIGHT SIDEBAR */}
          <GridItem>
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="lg"
              position="sticky"
              top="100px"
            >
              <Heading size="lg" mb={4}>
                ${course.price}
              </Heading>

              <Button
                w="full"
                bg="#A435F0"
                color="white"
                size="lg"
                _hover={{ bg: "#8710d8" }}
              >
                Enroll Now
              </Button>

              <Divider my={4} />

              <Text fontSize="sm" color="gray.500">
                Full lifetime access
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseDetailPage;