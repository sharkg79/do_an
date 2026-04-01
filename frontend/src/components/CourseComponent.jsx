import React from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import HomePageCarousel from "./HomePageCarousel";
import InProgressCarousel from "./InProgressCarousel";

const sections = [
  { title: "All English Courses", type: "all" },
  { title: "Your Learning Progress", type: "progress" },

  // Theo kỹ năng
  { title: "Top Courses in Speaking", type: "speaking" },
  { title: "Top Courses in Listening", type: "listening" },
  { title: "Top Courses in Reading", type: "reading" },
  { title: "Top Courses in Writing", type: "writing" },

  // Theo mục tiêu
  { title: "IELTS Preparation", type: "ielts" },
  { title: "TOEIC Preparation", type: "toeic" },
  { title: "Business English", type: "business" },
  { title: "English for Beginners", type: "beginner" },
];

const CourseComponent = () => {
  return (
    <Box px={[4, 6, 10]} py={6}>
      {sections.map((section, index) => (
        <Stack key={index} spacing={4} mb={10}>
          <Heading as="h2" size="lg">
            {section.title}
          </Heading>

          {section.type === "progress" ? (
            <InProgressCarousel />
          ) : (
            <HomePageCarousel category={section.type} />
          )}
        </Stack>
      ))}
    </Box>
  );
};

export default CourseComponent;