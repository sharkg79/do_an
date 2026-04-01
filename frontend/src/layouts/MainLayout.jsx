import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <Box bg="#F7F9FA" minH="100vh">
      <Navbar />
      <Box p={6}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;