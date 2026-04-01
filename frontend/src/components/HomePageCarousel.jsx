import React from "react";
import { Box, Text, Image, Badge, HStack } from "@chakra-ui/react";
import Slider from "react-slick";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
const courses = [
  {
    id: 1,
    title: "IELTS Speaking Band 7+",
    image: "https://picsum.photos/300/200?31",
    category: "ielts",
    level: "Intermediate",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Basic English Communication",
    image: "https://picsum.photos/300/200?32",
    category: "speaking",
    level: "Beginner",
    rating: 4.5,
  },
  {
    id: 3,
    title: "TOEIC Listening Practice",
    image: "https://picsum.photos/300/200?33",
    category: "toeic",
    level: "Intermediate",
    rating: 4.7,
  },
  {
    id: 4,
    title: "English Grammar Foundation",
    image: "https://picsum.photos/300/200?34",
    category: "beginner",
    level: "Beginner",
    rating: 4.6,
  },
  {
    id: 5,
    title: "Advanced Writing Skills",
    image: "https://picsum.photos/300/200?35",
    category: "writing",
    level: "Advanced",
    rating: 4.9,
  },
  {
    id: 6,
    title: "Business English Communication",
    image: "https://picsum.photos/300/200?36",
    category: "business",
    level: "Intermediate",
    rating: 4.7,
  },
  {
    id: 7,
    title: "English Listening Mastery",
    image: "https://picsum.photos/300/200?37",
    category: "listening",
    level: "Intermediate",
    rating: 4.6,
  },
  {
    id: 8,
    title: "Reading Skills for IELTS",
    image: "https://picsum.photos/300/200?38",
    category: "reading",
    level: "Intermediate",
    rating: 4.8,
  },
];
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
  const filteredCourses =
    category === "all"
      ? courses
      : courses.filter((c) => c.category === category);

  // 🔥 settings thông minh
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

  // 🔥 fallback khi ít course (QUAN TRỌNG)
  if (filteredCourses.length <= 4) {
    return (
      <Box display="flex" gap={4}>
        {filteredCourses.map((course) => (
          <Box key={course.id} w="250px">
            <Box
              bg="white"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              _hover={{ transform: "translateY(-5px)" }}
              transition="0.3s"
              cursor="pointer"
            >
              <Image
                src={course.image}
                w="100%"
                h="150px"
                objectFit="cover"
              />

              <Box p={3}>
                <Text fontWeight="bold" mb={1}>
                  {course.title}
                </Text>

                <HStack justify="space-between">
                  <Badge colorScheme="green">{course.level}</Badge>
                  <Text fontSize="sm" color="gray.500">
                    ⭐ {course.rating}
                  </Text>
                </HStack>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  // 🔥 dùng slider khi đủ course
  return (
  <Box position="relative">
    <Slider {...settings}>
      {filteredCourses.map((course) => (
        <Box key={course.id} p={2}>
          <Box
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            _hover={{ transform: "translateY(-5px)" }}
            transition="0.3s"
            cursor="pointer"
          >
            <Image
              src={course.image}
              w="100%"
              h="150px"
              objectFit="cover"
            />

            <Box p={3}>
              <Text fontWeight="bold" mb={1}>
                {course.title}
              </Text>

              <HStack justify="space-between">
                <Badge colorScheme="green">{course.level}</Badge>
                <Text fontSize="sm" color="gray.500">
                  ⭐ {course.rating}
                </Text>
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