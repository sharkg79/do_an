import {
  Box,
  Text,
  Spinner,
  VStack,
  HStack,
  Badge,
  Divider,
  Link,
  Input,
  Button,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { submitAssignmentAPI } from "../../api/assignment.api";

const AssignmentDetail = () => {
  const { assignmentId } = useParams();
  const toast = useToast();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/assignments/${assignmentId}`
      );
      setAssignment(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      return toast({
        title: "Chưa chọn file",
        status: "warning",
      });
    }

    try {
      await submitAssignmentAPI(assignmentId, file);

      toast({
        title: "Nộp bài thành công",
        status: "success",
      });
    } catch (err) {
      toast({
        title: err.message || "Submit lỗi",
        status: "error",
      });
    }
  };

  if (loading) return <Spinner size="xl" />;

  if (!assignment) return <Text>Assignment not found</Text>;

  return (
    <Box maxW="900px" mx="auto" mt={6} p={6} borderWidth="1px" borderRadius="lg">

      <VStack align="start" spacing={4}>
        {/* Title */}
        <Text fontSize="2xl" fontWeight="bold">
          {assignment.title}
        </Text>

        {/* Meta */}
        <HStack spacing={4}>
          <Badge colorScheme="purple">
            Assignment
          </Badge>

          <Text fontSize="sm" color="gray.500">
            {assignment.dueDate
              ? "Hạn: " + new Date(assignment.dueDate).toLocaleString()
              : "Không có hạn"}
          </Text>
        </HStack>

        {/* Instructor */}
        <Text>
          <b>Giảng viên:</b> {assignment.instructor?.name}
        </Text>

        {/* Class */}
        <Text>
          <b>Lớp:</b> {assignment.classId?.name}
        </Text>

        <Divider />

        {/* Description */}
        <Box>
          <Text fontWeight="semibold" mb={1}>
            Mô tả
          </Text>
          <Text color="gray.700">
            {assignment.description || "Không có mô tả"}
          </Text>
        </Box>

        {/* FILE BÀI TẬP (sau này backend thêm) */}
        <Box
          w="100%"
          p={4}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
        >
          <Text fontWeight="semibold" mb={2}>
            File bài tập
          </Text>

          <Link href="#" color="blue.500">
            Xem / tải đề bài
          </Link>
        </Box>

        {/* UPLOAD */}
        <Box w="100%">
          <Text fontWeight="semibold" mb={2}>
            Upload bài làm
          </Text>

          <Input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Box>

        {/* BUTTON */}
        <Button colorScheme="blue" onClick={handleSubmit}>
          Nộp bài
        </Button>
      </VStack>
    </Box>
  );
};

export default AssignmentDetail;