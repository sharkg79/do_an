import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { getCoursesAPI } from "../../api/course.api";
import { getAllCertificatesAPI } from "../../api/certificate.api";

const InstructorOverviewPage = () => {
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const [courseData, certData] = await Promise.all([
        getCoursesAPI(),
        getAllCertificatesAPI(),
      ]);

      setCourses(courseData);
      setCertificates(certData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= CALCULATE =================
  const totalClasses = courses.reduce(
    (sum, c) => sum + (c.classes?.length || 0),
    0
  );

  const totalLessons = courses.reduce(
    (sum, c) =>
      sum +
      (c.classes?.reduce((lessonSum, cls) => lessonSum + (cls.lessons?.length || 0), 0) || 0),
    0
  );

  const totalStudents = courses.reduce(
    (sum, c) =>
      sum +
      (c.classes?.reduce((clsSum, cls) => clsSum + (cls.students?.length || 0), 0) || 0),
    0
  );

  const totalTests = courses.reduce(
    (sum, c) =>
      sum +
      (c.classes?.reduce((tSum, cls) => tSum + (cls.tests?.length || 0), 0) || 0),
    0
  );

  const totalCertificates = certificates.length;

  // Collect ungraded assignments for the list
  const ungradedAssignments = courses.flatMap((course) =>
    course.classes?.flatMap((cls) =>
      cls.assignments
        ?.filter((a) => !a.graded)
        .map((a) => ({
          ...a,
          className: cls.title,
          courseTitle: course.title,
          pendingSubmissions: a.submissions?.filter((s) => !s.graded).length || 0,
        })) || []
    ) || []
  );

  // ================= UI =================
  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box>
      <Heading mb={6}>Instructor Dashboard</Heading>

      {/* STATS */}
      <SimpleGrid columns={[1, 2, 3, 5]} spacing={6} mb={8}>
        <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel>Classes</StatLabel>
          <StatNumber>{totalClasses}</StatNumber>
          <StatHelpText>Total in your courses</StatHelpText>
        </Stat>

        <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel>Lessons</StatLabel>
          <StatNumber>{totalLessons}</StatNumber>
          <StatHelpText>Across all classes</StatHelpText>
        </Stat>

        <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel>Students</StatLabel>
          <StatNumber>{totalStudents}</StatNumber>
          <StatHelpText>Enrolled in your classes</StatHelpText>
        </Stat>

        <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel>Tests</StatLabel>
          <StatNumber>{totalTests}</StatNumber>
          <StatHelpText>Created</StatHelpText>
        </Stat>

        <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel>Certificates</StatLabel>
          <StatNumber>{totalCertificates}</StatNumber>
          <StatHelpText>Issued</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* UNGRADED ASSIGNMENTS */}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>
          Ungraded Assignments
        </Heading>

        {ungradedAssignments.length === 0 ? (
          <Text>No ungraded assignments</Text>
        ) : (
          ungradedAssignments.map((a) => (
            <Box
              key={a._id}
              p={4}
              mb={3}
              border="1px solid #eee"
              borderRadius="md"
            >
              <Text fontWeight="bold">{a.title}</Text>
              <Text fontSize="sm" color="gray.500">
                Course: {a.courseTitle} | Class: {a.className} | Pending submissions: {a.pendingSubmissions}
              </Text>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default InstructorOverviewPage;