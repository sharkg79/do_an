import { Box, Flex, Text, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="gray.800" color="white" py={10}>
      <Flex direction={["column","row"]} justify="space-between" maxW="7xl" mx="auto" px={6}>
        <Text fontWeight="bold" mb={[4,0]}>LMS © 2026</Text>
        <Flex gap={4}>
          <Link href="/about" _hover={{textDecoration:"underline"}}>About</Link>
          <Link href="/contact" _hover={{textDecoration:"underline"}}>Contact</Link>
          <Link href="/privacy" _hover={{textDecoration:"underline"}}>Privacy</Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;