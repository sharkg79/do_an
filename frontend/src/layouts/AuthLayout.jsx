import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Box
      bg="#F7F9FA"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        w="360px"
        boxShadow="lg"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;