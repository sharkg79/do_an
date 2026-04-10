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

      setClassData(res.data.class);
      setCourse(res.data.class.course);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= PAYMENT =================
 const handlePayment = async () => {
  try {
    setProcessing(true);

    // 1. tạo enrollment
    const res = await createPaymentAPI({
      classId: classId,
      courseId: course._id,
    });

    const enrollmentId = res.data.enrollmentId;

    // 2. confirm payment (fake)
    await confirmPaymentAPI({
      enrollmentId,
    });

    alert("Thanh toán thành công!");

    // 3. quay về course detail
    navigate(`/courses/${course._id}`);

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  } finally {
    setProcessing(false);
  }
};

  return (
    <Container maxW="5xl" py={10}>
      <Heading mb={6}>Checkout</Heading>

      <Box
        p={6}
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack align="stretch" spacing={4}>
          
          {/* COURSE */}
          <Box>
            <Heading size="md">{course?.title}</Heading>

            <HStack mt={2}>
              <Badge colorScheme="purple">
                {course?.category}
              </Badge>

              <Badge colorScheme="green">
                {course?.level}
              </Badge>
            </HStack>

            <Text mt={2} color="gray.600">
              {course?.description}
            </Text>
          </Box>

          <Divider />

          {/* CLASS */}
          <Box>
            <Heading size="sm">Class</Heading>

            <Text fontWeight="bold">
              {classData?.title}
            </Text>

            <Text fontSize="sm" color="gray.600">
              Instructor: {classData?.instructor?.name}
            </Text>
          </Box>

          <Divider />

          {/* PRICE */}
          <HStack justify="space-between">
            <Text fontWeight="bold">Price</Text>
            <Heading size="md">
              ${course?.price}
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