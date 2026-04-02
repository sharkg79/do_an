import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Stack,
  Badge,
  Divider,
  Spinner,
  useToast
} from "@chakra-ui/react";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CheckoutPage = () => {
  const { id } = useParams(); // 🔥 FIX: đúng với route /checkout/:id
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // 🔥 LẤY classId từ query
  const query = new URLSearchParams(location.search);
  const classId = query.get("classId");

  // ================= FETCH COURSE =================
  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCourse(res.data.course);
    } catch (error) {
      console.log(error);
      toast({
        title: "Cannot load course",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  // ================= HANDLE CHECKOUT =================
  const handleCheckout = async () => {
    if (!classId) {
      toast({
        title: "Vui lòng chọn lớp",
        status: "warning"
      });
      return;
    }

    try {
      setPaying(true);

      const res = await axios.post(
  `http://localhost:5000/api/payments/${id}/pay`,
  {
    classId: classId   
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);

      // FREE COURSE
      if (res.data.enrollment) {
        toast({
          title: "Enroll success",
          status: "success",
          duration: 3000
        });

        navigate(`/classes/${res.data.classId}`);
      }

      // PAID COURSE
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }

    } catch (error) {
      console.error(error);
      toast({
        title: error.response?.data?.message || "Payment failed",
        status: "error"
      });
    } finally {
      setPaying(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  // ================= NULL SAFETY =================
  if (!course) {
    return (
      <Flex justify="center" mt={20}>
        <Text>Course not found</Text>
      </Flex>
    );
  }

  // ================= UI =================
  return (
    <Box bg="#f7f9fa" minH="100vh" py={10}>
      <Container maxW="container.lg">

        <Heading mb={8}>Checkout</Heading>

        <Flex gap={8} flexWrap="wrap">

          {/* LEFT */}
          <Box flex="2">
            <Card shadow="lg" border="1px" borderColor="gray.200" bg="white">
              <CardBody>
                <Stack spacing={4}>

                  <Heading size="md">
                    {course.title}
                  </Heading>

                  <Text color="gray.600">
                    {course.description}
                  </Text>

                  <Flex gap={2}>
                    {course.categories?.map((cat) => (
                      <Badge key={cat} colorScheme="purple">
                        {cat}
                      </Badge>
                    ))}
                  </Flex>

                </Stack>
              </CardBody>
            </Card>
          </Box>

          {/* RIGHT */}
          <Box flex="1">
            <Card
              shadow="lg"
              border="1px"
              borderColor="gray.200"
              bg="white"
              position="sticky"
              top="100px"
            >
              <CardBody>
                <Stack spacing={4}>

                  <Heading size="md">Order Summary</Heading>

                  <Flex justify="space-between">
                    <Text>Price</Text>
                    <Text fontWeight="bold">
                      ${course.price?.toLocaleString()}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Total</Text>
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color="#A435F0"
                    >
                      ${course.price?.toLocaleString()}
                    </Text>
                  </Flex>

                  <Button
                    bg="#A435F0"
                    color="white"
                    size="lg"
                    _hover={{ bg: "#8710d8" }}
                    isLoading={paying}
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>

                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    30-Day Money-Back Guarantee
                  </Text>

                </Stack>
              </CardBody>
            </Card>
          </Box>

        </Flex>

      </Container>
    </Box>
  );
};

export default CheckoutPage;