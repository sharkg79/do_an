import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLessonsByClassAPI } from "../../api/lesson.api";
import Classbar from "../../components/Classbar";
const LessonList = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, [classId]);

  const fetchLessons = async () => {
    try {
      const res = await getLessonsByClassAPI(classId);
      setLessons(res.lessons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box maxW="900px" mx="auto" mt={6}>
        <Classbar/>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Danh sách bài học
      </Text>

      <VStack spacing={4} align="stretch">
        {lessons.map((lesson) => (
          <Box
            key={lesson._id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            onClick={() => navigate(`/lessons/${lesson._id}`)}
          >
            <HStack justify="space-between">
              <Text fontWeight="medium">{lesson.title}</Text>

              <Text fontSize="sm" color="gray.500">
                {new Date(lesson.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default LessonList;