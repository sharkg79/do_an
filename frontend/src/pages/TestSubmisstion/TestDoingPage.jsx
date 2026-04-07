import {
  Box,
  Button,
  Heading,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Flex,
  Spinner,
  useToast,
  Progress
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const TestDoingPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTest = async () => {
    try {
      const res = await axios.get(`/tests/${testId}`);
      setTest(res.data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load test",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTest();
  }, [testId]);

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== questionId);
      return [...filtered, { questionId, selectedOption }];
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const res = await axios.post(`/tests/${testId}/submit`, {
        answers
      });

      toast({
        title: "Submitted",
        description: `Score: ${res.data.score}`,
        status: "success",
        duration: 4000,
        isClosable: true
      });

      navigate(-1);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Submit failed",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="60vh">
        <Spinner size="xl" color="#A435F0" />
      </Flex>
    );
  }

  const answeredCount = answers.length;
  const total = test.questions.length;
  const progress = (answeredCount / total) * 100;

  return (
    <Box bg="#f7f9fa" minH="100vh" p={6}>
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        mb={6}
      >
        <Heading size="lg" mb={2}>
          {test.title}
        </Heading>

        <Text color="gray.600" mb={4}>
          Total Marks: {test.totalMarks}
        </Text>

        <Progress
          value={progress}
          size="sm"
          borderRadius="md"
          colorScheme="purple"
        />

        <Text mt={2} fontSize="sm" color="gray.500">
          {answeredCount} / {total} answered
        </Text>
      </Box>

      <Stack spacing={6}>
        {test.questions.map((q, index) => (
          <Box
            key={q._id}
            bg="white"
            p={6}
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
          >
            <Heading size="sm" mb={4}>
              {index + 1}. {q.question}
            </Heading>

            <RadioGroup
              onChange={(val) => handleAnswer(q._id, val)}
              value={
                answers.find((a) => a.questionId === q._id)
                  ?.selectedOption || ""
              }
            >
              <Stack>
                {q.options.map((opt, i) => (
                  <Radio key={i} value={i}>
                    {opt}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
        ))}
      </Stack>

      <Flex justify="flex-end" mt={8}>
        <Button
          bg="#A435F0"
          color="white"
          _hover={{ bg: "#8710D8" }}
          borderRadius="md"
          size="lg"
          onClick={handleSubmit}
          isLoading={submitting}
        >
          Submit Test
        </Button>
      </Flex>
    </Box>
  );
};

export default TestDoingPage;
