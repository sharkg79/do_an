import React, { useEffect, useState } from "react";
import { Box, Text, Image, Progress, Badge } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Slider from "react-slick";

// 🔥 Custom arrows
const NextArrow = ({ onClick }) => (
  <Box
    position="absolute"
    right="-10px"
    top="40%"
    transform="translateY(-50%)"
    zIndex="2"
    bg="white"
    p={2}
    borderRadius="full"
    boxShadow="md"
    cursor="pointer"
    _hover={{ bg: "gray.100" }}
    onClick={onClick}
  >
    <ChevronRightIcon boxSize={6} />
  </Box>
);

const PrevArrow = ({ onClick }) => (
  <Box
    position="absolute"
    left="-10px"
    top="40%"
    transform="translateY(-50%)"
    zIndex="2"
    bg="white"
    p={2}
    borderRadius="full"
    boxShadow="md"
    cursor="pointer"
    _hover={{ bg: "gray.100" }}
    onClick={onClick}
  >
    <ChevronLeftIcon boxSize={6} />
  </Box>
);

const InProgressCarousel = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses"); // API backend
        const data = await res.json();

        // Nếu backend chưa có progress, gán mặc định 0
        const coursesWithProgress = data.map((c) => ({
          ...c,
          progress: c.progress || 0,
        }));

        setCourses(coursesWithProgress);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <Text>Loading courses...</Text>;

  const settings = {
    dots: false,
    infinite: courses.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, courses.length),
    slidesToScroll: 1,
    arrows: courses.length > 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, courses.length) },
      },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  if (courses.length <= 3) {
    return (
      <Box display="flex" gap={4}>
        {courses.map((course) => (
          <Box key={course._id} w="250px">
            <Box
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              _hover={{ transform: "translateY(-5px)" }}
              transition="0.3s"
            >
              <Image
                src={course.image || "https://picsum.photos/300/200"}
                h="150px"
                w="100%"
                objectFit="cover"
              />

              <Box p={3}>
                <Text fontWeight="bold" mb={1}>
                  {course.title}
                </Text>

                <Badge colorScheme="blue" mb={2}>
                  {course.level || "Beginner"}
                </Badge>

                <Progress
                  value={course.progress}
                  size="sm"
                  borderRadius="md"
                  mb={1}
                />

                <Text fontSize="sm" color="gray.500">
                  {course.progress}% completed
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box position="relative">
      <Slider {...settings}>
        {courses.map((course) => (
          <Box key={course._id} p={2}>
            <Box
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              _hover={{ transform: "translateY(-5px)" }}
              transition="0.3s"
            >
              <Image
                src={course.image || "https://picsum.photos/300/200"}
                h="150px"
                w="100%"
                objectFit="cover"
              />

              <Box p={3}>
                <Text fontWeight="bold" mb={1}>
                  {course.title}
                </Text>

                <Badge colorScheme="blue" mb={2}>
                  {course.level || "Beginner"}
                </Badge>

                <Progress
                  value={course.progress}
                  size="sm"
                  borderRadius="md"
                  mb={1}
                />

                <Text fontSize="sm" color="gray.500">
                  {course.progress}% completed
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default InProgressCarousel;