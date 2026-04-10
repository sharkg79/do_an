import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  Divider,
  Center
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAssignmentsAPI } from "../../api/assignment.api";
import { getTestsAPI } from "../../api/test.api";

import Classbar from "../../components/Classbar";

const AssignmentList = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [classId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignmentRes, testRes] = await Promise.all([
        getAssignmentsAPI(classId),
        getTestsAPI(classId),
      ]);

      setAssignments(assignmentRes);
      setTests(testRes);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box maxW="900px" mx="auto" mt={6}>
      <Classbar />

      {/* ===== ASSIGNMENTS ===== */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Danh sách bài tập
      </Text>

      {assignments.length === 0 ? (
        <Text color="gray.500">Chưa có bài tập</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {assignments.map((a) => (
            <Box
              key={a._id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              onClick={() => navigate(`/assignments/${a._id}`)}
            >
              <HStack justify="space-between">
                <Text fontWeight="medium">{a.title}</Text>

                <Text fontSize="sm" color="gray.500">
                  {a.dueDate
                    ? new Date(a.dueDate).toLocaleDateString()
                    : "Không có hạn"}
                </Text>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      {/* ===== DIVIDER ===== */}
      <Divider my={8} />

      {/* ===== TESTS ===== */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Bài kiểm tra
      </Text>

      {tests.length === 0 ? (
        <Text color="gray.500">Chưa có bài kiểm tra</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {tests.map((t) => (
            <Box
              key={t._id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              cursor="pointer"
              bg="blue.50"
              _hover={{ bg: "blue.100" }}
              onClick={() => navigate(`/tests/${t._id}`)}
            >
              <HStack justify="space-between">
                <Text fontWeight="medium">{t.title}</Text>

                <Text fontSize="sm" color="gray.500">
                  {t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : "Không có hạn"}
                </Text>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default AssignmentList;