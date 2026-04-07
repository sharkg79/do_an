import { Box, VStack, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminSidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const role = user?.role;

  const adminMenu = [
    { name: "Overview", path: "/dashboard/overview" },
    { name: "Users", path: "/dashboard/users" },
    { name: "Courses", path: "/dashboard/courses" },
    { name: "Classes", path: "/dashboard/classes" },
    { name: "Lessons", path: "/dashboard/class/lessons" },
    { name: "Payments", path: "/dashboard/payments" },
    { name: "Certificates", path: "/dashboard/certificates" },
    { name: "Assignments", path: "/dashboard/assignments" },
    { name: "Submissions", path: "/dashboard/submissions" },
    { name: "Tests", path: "/dashboard/tests" },
    { name: "Test Submissions", path: "/dashboard/test-submissions" },
  ];

  const instructorMenu = [
    { name: "Overview", path: "/dashboard/instructor-overview" },
    { name: "Classes", path: "/dashboard/classes" },
    { name: "Lessons", path: "/dashboard/class/lessons" },
    { name: "Assignments", path: "/dashboard/assignments" },
    { name: "Submissions", path: "/dashboard/submissions" },
    { name: "Tests", path: "/dashboard/tests" },
    { name: "Test Submissions", path: "/dashboard/test-submissions" },
  ];

  const menu = role === "ADMIN" ? adminMenu : instructorMenu;

  return (
    <Box w="250px" bg="gray.900" color="white" p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={6}>
        Dashboard
      </Text>

      <VStack align="start" spacing={3}>
        {menu.map((item) => (
          <Link key={item.path} to={item.path}>
            <Box
              px={3}
              py={2}
              borderRadius="md"
              bg={
                location.pathname === item.path
                  ? "blue.500"
                  : "transparent"
              }
              _hover={{ bg: "gray.700" }}
            >
              {item.name}
            </Box>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default AdminSidebar;