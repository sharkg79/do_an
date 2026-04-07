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
import axios from "axios";

const API = "http://localhost:5000/api/reports/dashboard";

const SystemOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ================= FETCH DATA =================
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ================= UI =================
  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>System Overview</Heading>

      {/* STATS */}
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} mb={8}>
        <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel>Total Users</StatLabel>
          <StatNumber>{data.totalUsers}</StatNumber>
          <StatHelpText>Registered in the system</StatHelpText>
        </Stat>

        <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel>Total Courses</StatLabel>
          <StatNumber>{data.totalCourses}</StatNumber>
          <StatHelpText>Created in the system</StatHelpText>
        </Stat>

        <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel>Total Classes</StatLabel>
          <StatNumber>{data.totalClasses}</StatNumber>
          <StatHelpText>Across all courses</StatHelpText>
        </Stat>

        <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
          <StatLabel>Revenue</StatLabel>
          <StatNumber>${data.totalRevenue || 0}</StatNumber>
          <StatHelpText>Total earnings</StatHelpText>
        </Stat>
      </SimpleGrid>

      
    </Box>
  );
};

export default SystemOverviewPage;