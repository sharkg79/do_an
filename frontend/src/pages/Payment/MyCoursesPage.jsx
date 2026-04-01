import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Badge,
  Button,
  Image,
  Stack,
  Flex,
  Spinner
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyCoursesPage = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get("/api/enrollments/my-courses");
      setCourses(res.data.courses);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  if (loading)
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="lg" />
      </Flex>
    );

  return (
    <Box bg="#f7f9fa" minH="100vh" py={10}>
      <Container maxW="container.xl">
        
        <Heading mb={8}>
          My Learning
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {courses.map((course) => (
            <Card
              key={course._id}
              bg="white"
              shadow="lg"
              border="1px"
              borderColor="gray.200"
              borderRadius="lg"
              transition="0.2s"
              _hover={{
                transform: "translateY(-6px)",
                shadow: "xl"
              }}
            >
              <CardBody>

                <Stack spacing={4}>
                  
                  {/* Thumbnail */}
                  <Image
                    src={
                      course.thumbnail ||
                      "https://via.placeholder.com/400x200"
                    }
                    borderRadius="md"
                  />

                  {/* Title */}
                  <Heading size="md">
                    {course.title}
                  </Heading>

                  {/* Instructor */}
                  <Text color="gray.600">
                    {course.instructor?.name}
                  </Text>

                  {/* Categories */}
                  <Flex gap={2} flexWrap="wrap">
                    {course.categories?.map((cat) => (
                      <Badge
                        key={cat}
                        colorScheme="purple"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </Flex>

                  {/* Button */}
                  <Button
                    bg="#A435F0"
                    color="white"
                    _hover={{ bg: "#8710d8" }}
                    borderRadius="md"
                    onClick={() =>
                      navigate(`/courses/${course._id}/learn`)
                    }
                  >
                    Continue Learning
                  </Button>

                </Stack>

              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

      </Container>
    </Box>
  );
};

export default MyCoursesPage;