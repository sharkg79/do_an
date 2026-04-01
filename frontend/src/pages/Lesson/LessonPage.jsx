import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Stack,
  Badge,
  IconButton,
  Spinner
} from "@chakra-ui/react";

import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const LessonPage = () => {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    try {
      const res = await axios.get(
        `/api/lessons/course/${courseId}`
      );

      setLessons(res.data.lessons);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  if (loading)
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="lg" />
      </Flex>
    );

  return (
    <Box bg="#f7f9fa" minH="100vh" p={6}>
      
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
      >
        <Heading size="lg">
          Course Lessons
        </Heading>

        <Button
          leftIcon={<AddIcon />}
          bg="#A435F0"
          color="white"
          _hover={{ bg: "#8710d8" }}
          borderRadius="md"
        >
          Create Lesson
        </Button>
      </Flex>

      {/* Lesson List */}
      <Stack spacing={5}>
        {lessons.map((lesson) => (
          <Card
            key={lesson._id}
            bg="white"
            shadow="lg"
            border="1px"
            borderColor="gray.200"
            borderRadius="lg"
            transition="0.2s"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "xl"
            }}
          >
            <CardBody>
              <Flex justify="space-between">
                
                {/* Left */}
                <Box>
                  <Heading size="md" mb={2}>
                    {lesson.title}
                  </Heading>

                  <Text color="gray.600" mb={3}>
                    {lesson.description}
                  </Text>

                  <Badge
                    colorScheme="purple"
                    borderRadius="md"
                  >
                    {lesson.contentType}
                  </Badge>
                </Box>

                {/* Right */}
                <Flex gap={2}>
                  <IconButton
                    icon={<EditIcon />}
                    colorScheme="purple"
                    variant="ghost"
                  />

                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                  />
                </Flex>

              </Flex>
            </CardBody>
          </Card>
        ))}
      </Stack>

    </Box>
  );
};

export default LessonPage;