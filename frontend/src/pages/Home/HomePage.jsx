import { Box, Heading, Text, Container, Flex } from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import HomeSlider from "../../components/HomeSlider";
import QuoteBox from "../../components/QuoteBox";
import Footer from "../../layouts/Footer";
import CourseComponent from "../../components/CourseComponent";
const HomePage = () => {
  return (
    <Box bg="#f7f9fa" minH="100vh">
      <Flex></Flex>
      <HomeSlider />
      <CourseComponent />
      <QuoteBox />
      <Container mt="100px" maxW="container.xxl">
        <Footer />
      </Container>
    </Box>
  );
};

export default HomePage;