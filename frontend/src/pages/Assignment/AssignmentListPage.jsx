import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  Stack,
  Badge,
  Spinner,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const AssignmentListPage = () => {
  const { courseId } = useParams();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`/assignments/course/${courseId}`);
      setAssignments(res.data);
    } catch (error) {
      toast({
        title: "Error loading assignments",
        status: "error",
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <Flex h="70vh" align="center" justify="center">
        <Spinner size="xl" color="#A435F0" />
      </Flex>
    );
  }

  return (
    <Box bg="#f7f9fa" minH="100vh" p={8}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.800">
          Assignments
        </Heading>

        <Button
          bg="#A435F0"
          color="white"
          _hover={{ bg: "#8710d8" }}
          borderRadius="md"
        >
          Create Assignment
        </Button>
      </Flex>

      {/* List */}
      <Stack spacing={4}>
        {assignments.length === 0 && (
          <Card bg="white" shadow="sm" border="1px" borderColor="gray.200">
            <CardBody textAlign="center" py={10}>
              <Text color="gray.500">No assignments yet</Text>
            </CardBody>
          </Card>
        )}

        {assignments.map((assignment) => (
          <MotionCard
            key={assignment._id}
            bg="white"
            border="1px"
            borderColor="gray.200"
            shadow="sm"
            borderRadius="lg"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            _hover={{ shadow: "lg" }}
          >
            <CardBody>
              <Flex justify="space-between" align="start">
                <Box>
                  <Heading size="md" mb={2} color="gray.800">
                    {assignment.title}
                  </Heading>

                  <Text color="gray.600" mb={3}>
                    {assignment.description}
                  </Text>

                  <Flex gap={3} align="center">
                    <Badge colorScheme="purple" borderRadius="md">
                      Due: {formatDate(assignment.dueDate)}
                    </Badge>

                    <Text fontSize="sm" color="gray.500">
                      By {assignment.instructor?.name}
                    </Text>
                  </Flex>
                </Box>

                <Flex gap={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="#A435F0"
                    color="#A435F0"
                    _hover={{ bg: "purple.50" }}
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    bg="#A435F0"
                    color="white"
                    _hover={{ bg: "#8710d8" }}
                  >
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </CardBody>
          </MotionCard>
        ))}
      </Stack>
    </Box>
  );
};

export default AssignmentListPage;
