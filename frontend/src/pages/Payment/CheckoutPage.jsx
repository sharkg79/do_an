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

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // GET COURSE
  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${courseId}`);
      setCourse(res.data.course);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  // PAY COURSE
  const handleCheckout = async () => {
    try {
      setPaying(true);

      const res = await axios.post(
        `/api/payments/${courseId}/pay`
      );

      // FREE COURSE
      if (res.data.enrollment) {
        toast({
          title: "Enroll success",
          status: "success",
          duration: 3000
        });

        navigate(`/courses/${courseId}`);
      }

      // PAID COURSE
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }

    } catch (error) {
      toast({
        title: error.response?.data?.message || "Error",
        status: "error"
      });
    } finally {
      setPaying(false);
    }
  };

  if (loading)
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="lg" />
      </Flex>
    );

  return (
    <Box bg="#f7f9fa" minH="100vh" py={10}>
      <Container maxW="container.lg">

        <Heading mb={8}>
          Checkout
        </Heading>

        <Flex gap={8} flexWrap="wrap">

          {/* LEFT */}
          <Box flex="2">
            <Card
              shadow="lg"
              border="1px"
              borderColor="gray.200"
              borderRadius="lg"
              bg="white"
            >
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
                      <Badge
                        key={cat}
                        colorScheme="purple"
                      >
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
              borderRadius="lg"
              bg="white"
              position="sticky"
              top="100px"
            >
              <CardBody>

                <Stack spacing={4}>

                  <Heading size="md">
                    Order Summary
                  </Heading>

                  <Flex justify="space-between">
                    <Text>Price</Text>
                    <Text fontWeight="bold">
                      ${course.price}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex justify="space-between">
                    <Text fontWeight="bold">
                      Total
                    </Text>
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color="#A435F0"
                    >
                      ${course.price}
                    </Text>
                  </Flex>

                  <Button
                    bg="#A435F0"
                    color="white"
                    size="lg"
                    borderRadius="md"
                    _hover={{
                      bg: "#8710d8"
                    }}
                    isLoading={paying}
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>

                  <Text
                    fontSize="sm"
                    color="gray.500"
                    textAlign="center"
                  >
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