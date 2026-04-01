import React from "react";
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

const courses = [
  {
    id: 1,
    title: "IELTS Speaking Mastery",
    level: "Intermediate",
    image: "https://picsum.photos/300/200?21",
    progress: 60,
  },
  {
    id: 2,
    title: "Basic English for Beginners",
    level: "Beginner",
    image: "https://picsum.photos/300/200?22",
    progress: 30,
  },
  {
    id: 3,
    title: "Advanced English Writing",
    level: "Advanced",
    image: "https://picsum.photos/300/200?23",
    progress: 80,
  },
  {
    id: 4,
    title: "TOEIC Listening Practice",
    level: "Intermediate",
    image: "https://picsum.photos/300/200?24",
    progress: 45,
  },
];

const InProgressCarousel = () => {
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
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  // 🔥 fallback nếu ít course (giống component kia)
  if (courses.length <= 3) {
    return (
      <Box display="flex" gap={4}>
        {courses.map((course) => (
          <Box key={course.id} w="250px">
            <Box
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              _hover={{ transform: "translateY(-5px)" }}
              transition="0.3s"
            >
              <Image
                src={course.image}
                h="150px"
                w="100%"
                objectFit="cover"
              />

              <Box p={3}>
                <Text fontWeight="bold" mb={1}>
                  {course.title}
                </Text>

                <Badge colorScheme="blue" mb={2}>
                  {course.level}
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
          <Box key={course.id} p={2}>
            <Box
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              _hover={{ transform: "translateY(-5px)" }}
              transition="0.3s"
            >
              <Image
                src={course.image}
                h="150px"
                w="100%"
                objectFit="cover"
              />

              <Box p={3}>
                <Text fontWeight="bold" mb={1}>
                  {course.title}
                </Text>

                <Badge colorScheme="blue" mb={2}>
                  {course.level}
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