import { Box, Image, Text, Badge, Button } from "@chakra-ui/react";

const CourseCard = ({ course }) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      border="1px solid #e2e8f0"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "lg",
      }}
      transition="all 0.2s"
    >
      <Image
        src="https://via.placeholder.com/300x160"
        alt={course.title}
      />

      <Box p={4}>
        <Text fontWeight="bold" noOfLines={2}>
          {course.title}
        </Text>

        <Text fontSize="sm" color="gray.500">
          {course.instructor?.name}
        </Text>

        <Badge colorScheme="purple" mt={2}>
          {course.categories || "General"}
        </Badge>

        <Text mt={2} fontWeight="bold">
          ${course.price}
        </Text>

        <Button
          mt={3}
          w="full"
          bg="#A435F0"
          color="white"
          _hover={{ bg: "#8710d8" }}
        >
          Enroll Now
        </Button>
      </Box>
    </Box>
  );
};

export default CourseCard;