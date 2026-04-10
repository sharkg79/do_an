import {
  Box,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Button,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { submitTestAPI } from "../../api/test.api";

const TestDetail = () => {
  const { testId } = useParams();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTest();
  }, []);

  const fetchTest = async () => {
    try {
      const res = await axiosInstance.get(`/api/tests/${testId}`);
      setTest(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => {
      const exist = prev.find((a) => a.questionId === questionId);

      if (exist) {
        return prev.map((a) =>
          a.questionId === questionId
            ? { ...a, selectedOption: Number(value) }
            : a
        );
      }

      return [
        ...prev,
        { questionId, selectedOption: Number(value) },
      ];
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await submitTestAPI(testId, answers);
      alert(`Điểm: ${res.score}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi");
    }
  };

  if (loading) return <Spinner />;

  if (!test) return <Text>Không tìm thấy bài test</Text>;

  return (
    <Box maxW="800px" mx="auto" mt={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        {test.title}
      </Text>

      <VStack align="stretch" spacing={6}>
        {test.questions.map((q, index) => (
          <Box key={q._id} p={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="medium" mb={2}>
              Câu {index + 1}: {q.questionText}
            </Text>

            <RadioGroup
              onChange={(val) => handleSelect(q._id, val)}
            >
              <VStack align="start">
                {q.options.map((opt, i) => (
                  <Radio key={i} value={i.toString()}>
                    {opt}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
          </Box>
        ))}
      </VStack>

      <Button mt={6} colorScheme="blue" onClick={handleSubmit}>
        Nộp bài
      </Button>
    </Box>
  );
};

export default TestDetail;