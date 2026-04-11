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
import { checkEnrollmentAPI } from "../../api/enrollment.api";
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
  const [enrolledClass, setEnrolledClass] = useState(null);

  useEffect(() => {
  setEnrolledClass(null);
  fetchData();
}, [id]);

  const fetchData = async () => {
  try {
    setLoading(true);

    // 1. Lấy course + classes
    const res = await axios.get(
      `http://localhost:5000/api/courses/${id}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    setCourse(res.data.course);
    setClasses(res.data.classes || []);

    // 2. 🔥 GỌI CHECK ENROLLMENT
    if (token) {
      const enrollRes = await checkEnrollmentAPI(id);

      if (enrollRes.data.enrolled) {
        setEnrolledClass(enrollRes.data.classId); // nhớ backend phải trả classId
      } else {
        setEnrolledClass(null);
      }
    }

  } catch (err) {
    console.error("❌ FETCH COURSE DETAIL:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};
  const handleEnroll = () => {
    if (!selectedClass) {
      alert("Vui lòng chọn lớp");
      return;
    }

    navigate(`/payment/${selectedClass}`);
  };

  if (loading)
    return (
      <Center h="80vh">
        <Spinner size="xl" />
      </Center>
    );

  if (!course) return <Text>Course not found</Text>;

  return (
    <>
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
          <VStack align="start" spacing={4}>
            <HStack>
              <Badge colorScheme="purple">{course?.category}</Badge>
              <Badge colorScheme="green">{course?.level}</Badge>
            </HStack>
            <Heading>{course?.title}</Heading>
          </VStack>
        </Container>
      </Box>

      {/* CONTENT */}
      <Container maxW="7xl" py={10}>
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
          
          {/* LEFT */}
          <GridItem>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="lg">
              <Heading size="md" mb={4}>
                Description
              </Heading>
              <Text>{course.description}</Text>
            </Box>
          </GridItem>

          {/* RIGHT */}
          <GridItem>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="lg">
              <Heading mb={4}>${course.price}</Heading>

              {enrolledClass ? (
                <Button
                  w="full"
                  colorScheme="green"
                  size="lg"
                  onClick={() =>
                    navigate(`/classes/${enrolledClass}/lessons`)
                  }
                >
                  Go to Class
                </Button>
              ) : (
                <>
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

                  <Box mt={4}>
                    <Text fontWeight="bold" mb={2}>
                      Select Class
                    </Text>

                    <VStack align="stretch">
                      {classes.map((cls) => {
                        const isSelected = selectedClass === cls._id;

                        return (
                          <Box
                            key={cls._id}
                            p={3}
                            border="1px solid"
                            borderColor={
                              isSelected ? "purple.500" : "#e2e8f0"
                            }
                            borderRadius="md"
                            cursor="pointer"
                            onClick={() => setSelectedClass(cls._id)}
                          >
                            <Text fontWeight="bold">{cls.title}</Text>
                            <Text fontSize="sm">
                              created by {cls.instructor?.name}
                            </Text>
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                </>
              )}

              <Divider my={4} />
              <Text fontSize="sm">Full lifetime access</Text>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};

export default CourseDetailPage;