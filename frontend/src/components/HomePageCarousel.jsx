import React, { useEffect, useState } from "react";
import { Box, Text, Image, Badge, HStack } from "@chakra-ui/react";
import Slider from "react-slick";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
// 🔹 import API wrapper
import { getCoursesAPI } from "../api/course.api";

// Custom arrows
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

const HomePageCarousel = ({ category }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let data = await getCoursesAPI();
        // 🔹 filter theo category nếu cần
        if (category && category !== "all") {
  data = data.filter(
    (c) => c.category?.toLowerCase() === category.toLowerCase()
  );
}

        // 🔹 fallback fields nếu backend chưa có
        const coursesWithDefaults = data.map((c) => ({
          ...c,
          level: c.level || "N/A",
          rating: c.rating || 0,
          image: c.image || "https://picsum.photos/300/200",
        }));

        setCourses(coursesWithDefaults);
      } catch (err) {
        console.error("Fetch courses error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category]);

  if (loading) return <Text>Loading courses...</Text>;

  const filteredCourses = courses || [];

  const settings = {
    dots: false,
    infinite: filteredCourses.length > 4,
    speed: 500,
    slidesToShow: Math.min(4, filteredCourses.length),
    slidesToScroll: 1,
    arrows: filteredCourses.length > 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, filteredCourses.length) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(2, filteredCourses.length) } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (filteredCourses.length <= 4) {
    return (
      <Box display="flex" gap={4}>
        {filteredCourses.map((course) => (
          <Box key={course._id} w="250px">
            <Box
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              _hover={{ transform: "translateY(-5px)" }}
              transition="0.3s"
              cursor="pointer"
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              <Image
                src={course.image}
                w="100%"
                h="150px"
                objectFit="cover"
              />
              <Box p={3}>
                <Text fontWeight="bold" mb={1}>{course.title}</Text>
                <HStack justify="space-between">
                  <Badge colorScheme="green">{course.level}</Badge>
                  <Text fontSize="sm" color="gray.500">⭐ {course.rating}</Text>
                </HStack>
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
        {filteredCourses.map((course) => (
          <Box key={course._id} p={2}>
            <Box
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              _hover={{ transform: "translateY(-5px)" }}
              transition="0.3s"
              cursor="pointer"
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              <Image
                src={course.image}
                w="100%"
                h="150px"
                objectFit="cover"
              />
              <Box p={3}>
                <Text fontWeight="bold" mb={1}>{course.title}</Text>
                <HStack justify="space-between">
                  <Badge colorScheme="green">{course.level}</Badge>
                  <Text fontSize="sm" color="gray.500">⭐ {course.rating}</Text>
                </HStack>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HomePageCarousel;