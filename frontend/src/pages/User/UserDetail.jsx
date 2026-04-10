import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  Divider,
  Center,
  Badge
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getUsersByClassAPI } from "../../api/user.api";
import Classbar from "../../components/Classbar";

const UserDetail = () => {
  const { classId } = useParams();

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [classId]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersByClassAPI(classId);

      // 👇 tùy backend trả về
      setTeachers(res.instructors || []);
      setStudents(res.students || []);

    } catch (err) {
      console.error("Fetch users error:", err);
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

      {/* ===== TEACHERS ===== */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Giáo viên
      </Text>

      {teachers.length === 0 ? (
        <Text color="gray.500">Chưa có giáo viên</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {teachers.map((t) => (
            <Box
              key={t._id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="purple.50"
            >
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">{t.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {t.email}
                  </Text>
                </Box>

                <Badge colorScheme="purple">
                  {t.role}
                </Badge>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      {/* ===== DIVIDER ===== */}
      <Divider my={8} />

      {/* ===== STUDENTS ===== */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Học sinh
      </Text>

      {students.length === 0 ? (
        <Text color="gray.500">Chưa có học sinh</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {students.map((s) => (
            <Box
              key={s._id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              _hover={{ bg: "gray.50" }}
            >
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">{s.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {s.email}
                  </Text>
                </Box>

                <Badge colorScheme="blue">
                  {s.role}
                </Badge>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default UserDetail;