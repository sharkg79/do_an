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
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getLessonsByCourse } from "../../services/lessonService";
import Navbar from "../../components/Navbar";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Lấy course
      const courseData = res.data.course;
      setCourse(courseData);

      // Lấy classes từ res.data.classes
      const classesData = res.data.classes || [];
      // Thêm isEnrolled check
      const classesWithEnroll = classesData.map((cls) => ({
        ...cls,
        isEnrolled: cls.students?.some((s) => s._id === currentUser._id) || false,
      }));
      setClasses(classesWithEnroll);

      // Lấy lessons
      const lessonData = await getLessonsByCourse(id);
      setLessons(lessonData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedClass) {
      alert("Vui lòng chọn lớp");
      return;
    }

    const cls = classes.find((c) => c._id === selectedClass);
    if (!cls) return;

    if (cls.isEnrolled) {
      navigate(`/classes/${selectedClass}`);
      return;
    }

    if (course.price === 0) {
      try {
        await axios.post(
          `http://localhost:5000/api/classes/${selectedClass}/enroll`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Bạn đã tham gia lớp thành công!");
        // Update local class state
        setClasses((prev) =>
          prev.map((c) =>
            c._id === selectedClass ? { ...c, isEnrolled: true } : c
          )
        );
        navigate(`/classes/${selectedClass}`);
      } catch (err) {
        alert(err.response?.data?.message || "Enroll lỗi");
      }
    } else {
      navigate(`/checkout/${course._id}?classId=${selectedClass}`);
    }
  };

  if (loading) return <Center h="80vh"><Spinner size="xl" /></Center>;
  if (!course) return <Text>Course not found</Text>;

  return (
    <>
      <Navbar />

      {/* HERO */}
      <Box
        position="relative"
        bgImage={`url(${course?.image})`}
        bgSize="cover"
        bgPosition="center"
        py={20}
        color="white"
      >
        <Box position="absolute" inset="0" bg="blackAlpha.600" />
        <Container maxW="7xl" position="relative" zIndex="1">
          <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={10}>
            <VStack align="start" spacing={5}>
              <HStack>
                <Badge colorScheme="purple">{course?.category}</Badge>
                <Badge colorScheme="green">{course?.level}</Badge>
              </HStack>
              <Heading fontSize={["3xl", "4xl", "5xl"]} lineHeight="1.2">
                {course?.title}
              </Heading>
              <Text fontSize="lg" color="gray.200">{course?.description}</Text>
              <Text fontSize="md">Created by <b>{course?.instructor?.name}</b></Text>
              <HStack spacing={6}>
                <Text>⭐ {course?.rating || 0}</Text>
                <Text>👥 {course?.studentsCount || 0} students</Text>
              </HStack>
              <HStack spacing={5} pt={3}>
                <Heading size="lg" color="yellow.300">${course?.price?.toLocaleString()}</Heading>
              </HStack>
            </VStack>
            <Box display={{ base: "none", md: "block" }} />
          </Grid>
        </Container>
      </Box>

      {/* CONTENT */}
      <Container maxW="7xl" py={10}>
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
          <GridItem>
            {/* CLASSES */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="lg">
              <Heading size="md" mb={4}>Classes</Heading>
              <VStack align="stretch" spacing={3}>
                {classes.length === 0 && <Text>No classes</Text>}
                {classes.map((cls) => {
                  const isSelected = selectedClass === cls._id;
                  return (
                    <Box
                      key={cls._id}
                      p={4}
                      border="1px solid"
                      borderColor={isSelected ? "purple.500" : "#e2e8f0"}
                      borderRadius="md"
                      bg={isSelected ? "purple.50" : "white"}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ bg: "#fafafa" }}
                      onClick={() => setSelectedClass(cls._id)}
                    >
                      <Text fontWeight="bold">{cls.title}</Text>
                      <Text fontSize="sm" color="gray.500">{cls.instructor?.name}</Text>
                      {isSelected && <Text mt={2} fontSize="xs" color="purple.500">✓ Selected</Text>}
                      {cls.isEnrolled && !isSelected && <Text mt={1} fontSize="xs" color="green.500">Already Enrolled</Text>}
                    </Box>
                  );
                })}
              </VStack>
            </Box>

            {/* LESSONS */}
            <Box bg="white" p={6} mt={6} borderRadius="lg" boxShadow="lg">
              <Heading size="md" mb={4}>Lessons</Heading>
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
                    <Text fontSize="sm" color="gray.500">{lesson.description}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </GridItem>

          {/* RIGHT SIDEBAR */}
          <GridItem>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="lg" position="sticky" top="100px">
              <Heading size="lg" mb={4}>${course?.price}</Heading>

              {selectedClass ? (
                classes.find((cls) => cls._id === selectedClass)?.isEnrolled ? (
                  <Button
                    w="full"
                    bg="green.400"
                    color="white"
                    size="lg"
                    _hover={{ bg: "green.500" }}
                    onClick={() => navigate(`/classes/${selectedClass}/lessons`)}
                  >
                    Join Class
                  </Button>
                ) : (
                  <Button
                    w="full"
                    bg="#A435F0"
                    color="white"
                    size="lg"
                    _hover={{ bg: "#8710d8" }}
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                )
              ) : (
                <Button w="full" colorScheme="gray" size="lg" isDisabled>
                  Select a class
                </Button>
              )}

              <Divider my={4} />
              <Text fontSize="sm" color="gray.500">Full lifetime access</Text>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};

export default CourseDetailPage;