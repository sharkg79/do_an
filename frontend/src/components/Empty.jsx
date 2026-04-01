import { Flex, Text, VStack, Icon } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const Empty = ({ text = "No data found" }) => {
  return (
    <Flex justify="center" align="center" minH="60vh">
      <VStack spacing={4}>
        <Icon as={SearchIcon} boxSize={10} color="gray.400" />
        <Text fontSize="lg" color="gray.500">
          {text}
        </Text>
      </VStack>
    </Flex>
  );
};

export default Empty;