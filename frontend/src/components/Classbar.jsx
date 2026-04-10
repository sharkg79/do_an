import { Flex, Text } from "@chakra-ui/react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const Classbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { classId } = useParams(); // ✅ lấy classId từ URL

  const menu = [
    { name: "Lesson", path: "lessons" },
    { name: "Assignment", path: "assignments" },
    { name: "Member", path: "users" }
  ];

  return (
    <Flex
      px={6}
      py={3}
      bg="gray.50"
      borderBottom="1px solid #E5E7EB"
      gap={6}
      align="center"
    >
      {menu.map((item) => {
        const fullPath = `/classes/${classId}/${item.path}`;
        const isActive = location.pathname.includes(item.path);

        return (
          <Text
            key={item.name}
            cursor="pointer"
            fontWeight={isActive ? "bold" : "medium"}
            color={isActive ? "blue.500" : "gray.600"}
            borderBottom={isActive ? "2px solid #3182CE" : "none"}
            pb={1}
            _hover={{ color: "blue.400" }}
            onClick={() => navigate(fullPath)} // ✅ FIX
          >
            {item.name}
          </Text>
        );
      })}
    </Flex>
  );
};

export default Classbar;