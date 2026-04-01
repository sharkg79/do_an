import { Box, Text, Icon } from "@chakra-ui/react";
import { FaQuoteLeft } from "react-icons/fa";

const QuoteBox = ({ 
  quote, 
  bgGradient = "linear(to-r, purple.500, pink.500)" 
}) => {
  return (
    <Box
      position="relative"
      maxW="1200px"
      mx="auto"
      mt={12}
      px={8}
      py={10}
      borderRadius="2xl"
      bgGradient={bgGradient}
      color="white"
      textAlign="center"
      boxShadow="lg"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
      }}
    >
      {/* Icon */}
      <Icon
        as={FaQuoteLeft}
        position="absolute"
        top="16px"
        left="20px"
        boxSize={6}
        opacity={0.3}
      />

      {/* Text */}
      <Text
        fontWeight="600"
        fontSize={["18px", "22px", "26px"]}
        lineHeight="1.6"
      >
        {quote || `"Education is the most powerful weapon which you can use to change the world."`}
      </Text>
    </Box>
  );
};

export default QuoteBox;