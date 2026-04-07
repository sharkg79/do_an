import { Flex, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <Box flex="1" bg="#F7F9FA">
        <Navbar />

        <Box p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;