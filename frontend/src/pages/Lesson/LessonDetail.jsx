import {
  Box,
  Text,
  Spinner,
  VStack,
  HStack,
  Badge,
  Divider,
  Link
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLessonByIdAPI } from "../../api/lesson.api";
const LessonDetail = () => {
  const { lessonId } = useParams();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const res = await getLessonByIdAPI(lessonId);
      setLesson(res.lesson);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner size="xl" />;

  if (!lesson) return <Text>Lesson not found</Text>;

  return (
    <Box maxW="900px" mx="auto" mt={6} p={6} borderWidth="1px" borderRadius="lg">
      <VStack align="start" spacing={4}>

        {/* Title */}
        <Text fontSize="2xl" fontWeight="bold">
          {lesson.title}
        </Text>

        {/* Meta info */}
        <HStack spacing={4}>
          <Badge colorScheme="blue">
            {lesson.contentType}
          </Badge>

          <Text fontSize="sm" color="gray.500">
            {new Date(lesson.createdAt).toLocaleString()}
          </Text>
        </HStack>

        {/* Instructor */}
        <Text>
          <b>Giảng viên:</b> {lesson.instructor?.name}
        </Text>

        {/* Class */}
        <Text>
          <b>Lớp:</b> {lesson.class?.title || "N/A"}
        </Text>

        <Divider />

        {/* Description */}
        <Box>
          <Text fontWeight="semibold" mb={1}>
            Mô tả
          </Text>
          <Text color="gray.700">
            {lesson.description || "Không có mô tả"}
          </Text>
        </Box>

        {/* Content preview */}
        {lesson.contentType === "video" && lesson.contentUrl && (
          <Box w="100%">
            <Text fontWeight="semibold" mb={2}>
              Video
            </Text>
            <video width="100%" controls>
              <source src={lesson.contentUrl} />
            </video>
          </Box>
        )}

        {/* FILE URL BOX (yêu cầu của bạn) */}
        <Box
          w="100%"
          p={4}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
        >
          <Text fontWeight="semibold" mb={2}>
            Tài nguyên bài học
          </Text>

          {lesson.contentUrl ? (
            <Link
              href={lesson.contentUrl}
              color="blue.500"
              isExternal
            >
              {lesson.contentUrl}
            </Link>
          ) : (
            <Text color="gray.500">Không có file</Text>
          )}
        </Box>

      </VStack>
    </Box>
  );
};

export default LessonDetail;