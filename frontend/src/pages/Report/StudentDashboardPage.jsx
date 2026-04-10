import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Flex,
  Button,
  Spinner,
  Stack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignmentsAPI } from "../../api/assignment.api";
import { getTestsAPI } from "../../api/test.api";
import { getMyCertificatesAPI } from "../../api/certificate.api";
import { getAllClassesAPI } from "../../api/class.api";

const StudentDashboardPage = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [tests, setTests] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  const fetchData = async () => {
  try {
    const [classesRes, assignmentsRes, testsRes, certificatesRes] =
      await Promise.all([
        getAllClassesAPI(),
        getAssignmentsAPI(),
        getTestsAPI(),
        getMyCertificatesAPI(),
      ]);

    setClasses(classesRes);
    setAssignments(assignmentsRes);
    setTests(testsRes);
    setCertificates(certificatesRes);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box bg="#f7f9fa" minH="100vh">
      <Container maxW="container.xl" py={8}>
        <Heading mb={8}>Student Dashboard</Heading>

        {/* ================= CLASSES ================= */}
        <Heading size="md" mb={4}>My Classes</Heading>
        {classes.length === 0 ? (
          <Text color="gray.500" mb={10}>
            You are not enrolled in any class
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
            {classes.map((cls) => (
              <Card key={cls._id}>
                <CardBody>
                  <Stack spacing={3}>
                    <Heading size="sm">{cls.title}</Heading>
                    <Text fontSize="sm" color="gray.500">
                      {cls.course?.title}
                    </Text>
                    <Button
                      bg="#A435F0"
                      color="white"
                      _hover={{ bg: "#8710d8" }}
                      onClick={() => navigate(`/classes/${cls._id}`)}
                    >
                      View Class
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* ================= ASSIGNMENTS ================= */}
        <Heading size="md" mb={4}>Pending Assignments</Heading>
        {assignments.length === 0 ? (
          <Text color="gray.500" mb={10}>No pending assignments</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
            {assignments.map((a) => (
              <Card key={a._id}>
                <CardBody>
                  <Stack spacing={3}>
                    <Heading size="sm">{a.title}</Heading>
                    <Text fontSize="sm" color="gray.500">
                      {a.course?.title} | {a.class?.title}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Due: {new Date(a.dueDate).toLocaleDateString()}
                    </Text>
                    <Button
                      bg="#A435F0"
                      color="white"
                      _hover={{ bg: "#8710d8" }}
                      onClick={() => navigate(`/assignments/${a._id}`)}
                    >
                      View Assignment
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* ================= TESTS ================= */}
        <Heading size="md" mb={4}>Pending Tests</Heading>
        {tests.length === 0 ? (
          <Text color="gray.500" mb={10}>No pending tests</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
            {tests.map((t) => (
              <Card key={t._id}>
                <CardBody>
                  <Stack spacing={3}>
                    <Heading size="sm">{t.title}</Heading>
                    <Text fontSize="sm" color="gray.500">
                      {t.course?.title} | {t.class?.title}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </Text>
                    <Button
                      bg="#A435F0"
                      color="white"
                      _hover={{ bg: "#8710d8" }}
                      onClick={() => navigate(`/tests/${t._id}`)}
                    >
                      Take Test
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* ================= CERTIFICATES ================= */}
        <Heading size="md" mb={4}>My Certificates</Heading>
        {certificates.length === 0 ? (
          <Text color="gray.500" mb={10}>
            No certificates issued yet
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {certificates.map((c) => (
              <Card key={c._id}>
                <CardBody>
                  <Stack spacing={3}>
                    <Heading size="sm">{c.title}</Heading>
                    <Text fontSize="sm" color="gray.500">
                      {c.course?.title}
                    </Text>
                    <Button bg="gray.400" color="white" cursor="not-allowed">
                      Issued
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default StudentDashboardPage;