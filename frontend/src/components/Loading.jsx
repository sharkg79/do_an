import { Flex, Spinner } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Flex
      justify="center"
      align="center"
      minH="60vh"
    >
      <Spinner
        size="xl"
        thickness="4px"
        speed="0.65s"
        color="brand.500"
      />
    </Flex>
  );
};

export default Loading;