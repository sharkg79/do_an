import {
  Box,
  Text,
  Spinner,
  VStack,
  HStack,
  Badge,
  Divider,
  Link,
  Button
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

  // ================= HELPER =================

  const getYoutubeEmbed = (url) => {
    if (!url) return "";

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }

    return url;
  };

  const getDrivePreview = (url) => {
    if (!url) return "";

    if (url.includes("drive.google.com")) {
      return url.replace("/view", "/preview");
    }

    return url;
  };

  const getContentType = (url) => {
    if (!url) return "unknown";

    if (url.includes("youtube") || url.includes("youtu.be")) {
      return "youtube";
    }

    if (url.includes("drive.google.com")) {
      return "drive";
    }

    if (url.endsWith(".mp4") || url.includes(".mp4")) {
      return "video";
    }

    if (url.endsWith(".pdf")) {
      return "pdf";
    }

    return "link";
  };

  // ================= UI =================

  if (loading) return <Spinner size="xl" />;

  if (!lesson) return <Text>Lesson not found</Text>;

  const type = getContentType(lesson.contentUrl);

  return (
    <Box maxW="900px" mx="auto" mt={6} p={6} borderWidth="1px" borderRadius="lg">
      <VStack align="start" spacing={4}>

        {/* Title */}
        <Text fontSize="2xl" fontWeight="bold">
          {lesson.title}
        </Text>

        {/* Meta */}
        <HStack spacing={4}>
          <Badge colorScheme="blue">
            {lesson.contentType || type}
          </Badge>

          <Text fontSize="sm" color="gray.500">
            {new Date(lesson.createdAt).toLocaleString()}
          </Text>
        </HStack>

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

        {/* CONTENT */}
        <Box
          w="100%"
          p={4}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
        >
          <Text fontWeight="semibold" mb={3}>
            Nội dung bài học
          </Text>

          {/* 🎥 YouTube */}
          {type === "youtube" && (
            <iframe
              width="100%"
              height="400"
              src={getYoutubeEmbed(lesson.contentUrl)}
              title="YouTube video"
              frameBorder="0"
              allowFullScreen
            />
          )}

          {/* 📂 Google Drive */}
          {type === "drive" && (
  <Box position="relative" w="100%">
    
    {/* 👇 IFRAME PREVIEW */}
    <iframe
      src={getDrivePreview(lesson.contentUrl)}
      width="100%"
      height="500"
      title="Drive preview"
      style={{ pointerEvents: "none" }} // 🔥 QUAN TRỌNG
    />

    {/* 👇 CLICK LAYER */}
    <Box
      position="absolute"
      top="0"
      left="0"
      w="100%"
      h="100%"
      cursor="pointer"
      onClick={() => window.open(lesson.contentUrl, "_blank")}
    />
  </Box>
)}

          {/* 🎬 MP4 */}
          {type === "video" && (
            <video width="100%" controls>
              <source src={lesson.contentUrl} type="video/mp4" />
            </video>
          )}

          {/* 📄 PDF */}
          {type === "pdf" && (
            <iframe
              src={lesson.contentUrl}
              width="100%"
              height="500"
              title="PDF preview"
            />
          )}

          {/* 🔗 Fallback */}
          {type === "link" && (
            <Text>
              Không preview được. Hãy mở file bên dưới 👇
            </Text>
          )}
        </Box>

      </VStack>
    </Box>
  );
};

export default LessonDetail;