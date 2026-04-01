import {
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar
} from "@chakra-ui/react";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const Navbar = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

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
    >
      <Text
        fontSize="lg"
        fontWeight="bold"
        cursor="pointer"
        onClick={() => navigate("/")}
      >
        LMS
      </Text>

      {!user ? (
        <Flex gap={3}>
          <Button onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/register")}>Sign Up</Button>
        </Flex>
      ) : (
        <Menu>
          <MenuButton>
            <Avatar size="sm" name={user?.name} />
          </MenuButton>

          <MenuList>
            <MenuItem onClick={() => navigate("/")}>Home</MenuItem>

            {user?.role === "ADMIN" && (
              <>
                <MenuItem onClick={() => navigate("/admin")}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => navigate("/admin/users")}>
                  Manage Users
                </MenuItem>
              </>
            )}

            <MenuItem
              onClick={() => {
                logout?.();
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