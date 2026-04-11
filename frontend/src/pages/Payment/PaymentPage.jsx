import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  Spinner,
  Center,
  Badge,
  Select,
} from "@chakra-ui/react";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  createPaymentAPI,
  confirmPaymentAPI,
} from "../../api/enrollment.api";

const PaymentPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [classData, setClassData] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");

  useEffect(() => {
    fetchData();
  }, [classId]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/classes/${classId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API:", res.data);

      // ✅ FIX CHÍNH Ở ĐÂY
      setClassData(res.data);
      setCourse(res.data.course);

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Không load được dữ liệu lớp");
    } finally {
      setLoading(false);
    }
  };

  // ================= PAYMENT =================
  const handlePayment = async () => {
    try {
      setProcessing(true);

      const res = await createPaymentAPI(
        {
          classId,
          courseId: course._id,
          paymentMethod: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const enrollmentId = res.data.enrollmentId;

      await confirmPaymentAPI(
        {
          enrollmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Thanh toán thành công!");
      navigate(`/courses/${course._id}`);

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  // ================= LOADING =================
  if (loading || !classData || !course) {
    return (
      <Center h="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="5xl" py={10}>
      <Heading mb={6}>Checkout</Heading>

      <Box p={6} bg="white" borderRadius="lg" boxShadow="lg">
        <VStack align="stretch" spacing={4}>
          
          {/* COURSE */}
          <Box>
            <Heading size="sm">Course name</Heading>
            <Heading size="md">{course.title}</Heading>

          </Box>

          <Divider />

          {/* CLASS */}
          <Box>
            <Heading size="sm">Class name</Heading>

            <Text fontWeight="bold">{classData.title}</Text>

            <Text fontSize="sm" color="gray.600">
              Instructor: {classData?.instructor?.name || "Unknown"}
            </Text>
          </Box>

          <Divider />
<Box>
  <Text fontWeight="bold" mb={2}>
    Payment Method
  </Text>

  <Select
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
  >
    <option value="STRIPE">Stripe</option>
    <option value="MOMO">Momo</option>
    <option value="VNPAY">VNPay</option>
  </Select>
</Box>
          {/* PRICE */}
          <HStack justify="space-between">
            <Text fontWeight="bold">Price</Text>
            <Heading size="md">
              ${course.price || 0}
            </Heading>
          </HStack>

          <Button
            size="lg"
            colorScheme="purple"
            onClick={handlePayment}
            isLoading={processing}
          >
            Proceed to Payment
          </Button>

          <Text fontSize="sm" color="gray.500">
            Full lifetime access
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default PaymentPage;