import {
  Box,
  Button,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Badge,
  Spinner,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";

const TestListPage = () => {
  const { courseId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchTests = async () => {
    try {
      const res = await axios.get(`/tests/course/${courseId}`);
      setTests(res.data);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load tests",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [courseId]);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="60vh">
        <Spinner size="xl" color="#A435F0" />
      </Flex>
    );
  }

  return (
    <Box bg="#f7f9fa" minH="100vh" p={6}>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading size="lg">Course Tests</Heading>

        <Button
          as={Link}
          to={`/tests/create/${courseId}`}
          bg="#A435F0"
          color="white"
          _hover={{ bg: "#8710D8" }}
          borderRadius="md"
        >
          Create Test
        </Button>
      </Flex>

      {tests.length === 0 ? (
        <Box
          bg="white"
          p={10}
          borderRadius="lg"
          boxShadow="lg"
          textAlign="center"
        >
          <Text fontSize="lg">No tests available</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {tests.map((test) => (
            <Box
              key={test._id}
              bg="white"
              p={6}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "lg"
              }}
            >
              <Flex justify="space-between" align="center" mb={3}>
                <Heading size="md">{test.title}</Heading>

                <Badge colorScheme="purple">
                  {test.questions?.length || 0} Questions
                </Badge>
              </Flex>

              <Text color="gray.600" mb={3}>
                Total Marks: {test.totalMarks}
              </Text>

              {test.dueDate && (
                <Text color="gray.500" fontSize="sm" mb={4}>
                  Due: {new Date(test.dueDate).toLocaleDateString()}
                </Text>
              )}

              <Flex gap={3}>
                <Button
                  as={Link}
                  to={`/tests/${test._id}`}
                  flex={1}
                  bg="#A435F0"
                  color="white"
                  _hover={{ bg: "#8710D8" }}
                  borderRadius="md"
                >
                  Take Test
                </Button>

                <Button
                  as={Link}
                  to={`/tests/${test._id}/submissions`}
                  variant="outline"
                  borderColor="#A435F0"
                  color="#A435F0"
                  _hover={{ bg: "purple.50" }}
                  borderRadius="md"
                >
                  Results
                </Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default TestListPage;
