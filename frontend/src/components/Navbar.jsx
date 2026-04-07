import {
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/courses?search=${keyword}`);
  };

  const role = user?.role;

  return (
    <Flex
      px={6}
      py={4}
      bg="white"
      borderBottom="1px solid #E5E7EB"
      align="center"
      justify="space-between"
      position="sticky"
      top="0"
      zIndex="1000"
      gap={6}
    >
      {/* Logo */}
      <Text
        fontSize="xl"
        fontWeight="bold"
        cursor="pointer"
        onClick={() => navigate("/")}
      >
        🎓 LMS
      </Text>

      {/* 🔍 Search */}
      <InputGroup maxW="400px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon onClick={handleSearch} cursor="pointer" />
        </InputLeftElement>
        <Input
          placeholder="Search courses..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </InputGroup>

      {/* Auth */}
      {!user ? (
        <Flex gap={3}>
          <Button onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/register")}>Sign Up</Button>
        </Flex>
      ) : (
        <Menu>
          <MenuButton>
            <Avatar
              size="sm"
              name={user?.name}
              src={user?.avatar}
              cursor="pointer"
            />
          </MenuButton>

          <MenuList>
            {/* Common */}
            <MenuItem onClick={() => navigate("/profile")}>
              Profile
            </MenuItem>

            {/* Role-based */}
            {role === "ADMIN" && (
              <>
                <MenuItem onClick={() => navigate("dashboard/admin-overview")}>
                  Dashboard
                </MenuItem>
              </>
            )}

            {role === "INSTRUCTOR" && (
              <>
                <MenuItem onClick={() => navigate("dashboard/instructor-overview")}>
                  Dashboard
                </MenuItem>
              </>
            )}

            {role === "STUDENT" && (
              <>
              <MenuItem onClick={() => navigate("/student-dashboard")}>
                Student Dashboard
              </MenuItem>
              <MenuItem onClick={() => navigate("/certificates")}>
                Chứng chỉ
              </MenuItem>
              </>
            )}

            {/* Logout */}
            <MenuItem
              onClick={async () => {
                await logout?.();
                navigate("/login");
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};

export default Navbar;