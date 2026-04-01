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
  Input,
  Spinner,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const SubmitAssignmentPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const fetchAssignment = async () => {
    try {
      const res = await axios.get(`/assignments/${assignmentId}`);
      setAssignment(res.data);
    } catch (error) {
      toast({
        title: "Error loading assignment",
        status: "error",
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const handleSubmit = async () => {
    if (!file) {
      return toast({
        title: "Please select file",
        status: "warning"
      });
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`/submissions/${assignmentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast({
        title: "Submitted successfully",
        status: "success",
        duration: 3000
      });

      navigate(-1);

    } catch (error) {
      toast({
        title: error.response?.data?.message || "Submit failed",
        status: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
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
      <Flex mb={6} align="center" justify="space-between">
        <Heading size="lg">Submit Assignment</Heading>

        <Button
          variant="outline"
          borderColor="#A435F0"
          color="#A435F0"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Flex>

      <Stack spacing={6}>
        {/* Assignment Info */}
        <MotionCard
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          shadow="sm"
          whileHover={{ y: -3 }}
          _hover={{ shadow: "lg" }}
        >
          <CardBody>
            <Heading size="md" mb={2}>
              {assignment?.title}
            </Heading>

            <Text color="gray.600" mb={3}>
              {assignment?.description}
            </Text>

            <Badge colorScheme="purple" borderRadius="md">
              Due: {formatDate(assignment?.dueDate)}
            </Badge>
          </CardBody>
        </MotionCard>

        {/* Upload */}
        <MotionCard
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          shadow="sm"
        >
          <CardBody>
            <Stack spacing={4}>
              <Heading size="md">Upload your work</Heading>

              <Input
                type="file"
                p={1}
                onChange={(e) => setFile(e.target.files[0])}
              />

              {file && (
                <Box
                  bg="purple.50"
                  p={3}
                  borderRadius="md"
                >
                  <Text fontSize="sm">
                    Selected: {file.name}
                  </Text>
                </Box>
              )}

              <Flex justify="flex-end">
                <Button
                  bg="#A435F0"
                  color="white"
                  _hover={{ bg: "#8710d8" }}
                  isLoading={submitting}
                  onClick={handleSubmit}
                >
                  Submit Assignment
                </Button>
              </Flex>
            </Stack>
          </CardBody>
        </MotionCard>
      </Stack>
    </Box>
  );
};

export default SubmitAssignmentPage;
