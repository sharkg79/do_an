import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  Stack,
  Spinner,
  Button,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";

const TestResultPage = () => {
  const { testId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`/tests/${testId}/submissions`);
      setSubmissions(res.data);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load submissions",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [testId]);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="60vh">
        <Spinner size="xl" color="#A435F0" />
      </Flex>
    );
  }

  return (
    <Box bg="#f7f9fa" minH="100vh" p={6}>
      <Heading mb={6}>Test Results</Heading>

      {submissions.length === 0 ? (
        <Box bg="white" p={10} borderRadius="lg" boxShadow="lg" textAlign="center">
          <Text fontSize="lg">No submissions yet</Text>
        </Box>
      ) : (
        <Stack spacing={6}>
          {submissions.map((sub) => (
            <Box
              key={sub._id}
              bg="white"
              p={6}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="sm"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold">{sub.student.name}</Text>
                <Badge colorScheme="purple">Score: {sub.score}</Badge>
              </Flex>

              <Text color="gray.600" mb={3}>{sub.student.email}</Text>

              <Button
                as={Link}
                to={`/tests/${testId}/submission/${sub._id}`}
                size="sm"
                bg="#A435F0"
                color="white"
                _hover={{ bg: "#8710D8" }}
                borderRadius="md"
              >
                View Submission
              </Button>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TestResultPage;