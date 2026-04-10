import {
  Box,
  Heading,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Spinner,
  useToast,
  Text,
  Flex,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // giả sử có context lưu user

const ManageClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // popup students
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStudents, setSelectedStudents] = useState([]);

  const { courseId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useContext(AuthContext); // lấy role user hiện tại

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/classes");
      const allClasses = res.data.data || res.data;

      const filtered = courseId
        ? allClasses.filter(
            (c) => c.course?._id === courseId || c.course === courseId
          )
        : allClasses;

      setClasses(filtered);
      setFilteredClasses(filtered);
    } catch (err) {
      console.error(err);
      toast({
        title: "Load data failed",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  // ================= SEARCH =================
  useEffect(() => {
    const result = classes.filter((cls) =>
      cls.title?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredClasses(result);
    setCurrentPage(1);
  }, [search, classes]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= DELETE (ADMIN) =================
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa lớp này?")) return;

    try {
      await axiosInstance.delete(`/api/classes/${id}`);
      toast({ title: "Deleted successfully", status: "success" });
      fetchData();
    } catch {
      toast({ title: "Delete failed", status: "error" });
    }
  };

  // ================= OPEN STUDENTS =================
  const handleOpenStudents = (students) => {
    setSelectedStudents(students || []);
    onOpen();
  };

  // ================= UI =================
  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
  <Box p={6}>
    {/* HEADER */}
    <Flex justify="space-between" align="center" mb={6}>
      <Heading size="lg">
        Manage Classes {courseId && "(Course View)"}
      </Heading>

      {user.role === "ADMIN" && (
        <Button
          colorScheme="blue"
          onClick={() => navigate("/dashboard/create-class")}
        >
          + Add Class
        </Button>
      )}
    </Flex>

    {/* SEARCH */}
    <Box mb={4}>
      <Input
        placeholder="Search class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Box>

    {/* TABLE */}
    <Box bg="white" p={4} borderRadius="lg" boxShadow="md">
      {filteredClasses.length === 0 ? (
        <Text>No classes found</Text>
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Course</Th>
                <Th>Instructor</Th>
                <Th>Students</Th>
                <Th>Time</Th>
                <Th isNumeric>Actions</Th>
              </Tr>
            </Thead>

            <Tbody>
              {paginatedClasses.map((cls) => {
                const students = cls.students ?? [];

                return (
                  <Tr key={cls._id}>
                    {/* TITLE */}
                    <Td>{cls.title}</Td>

                    {/* COURSE */}
                    <Td>{cls.course?.title || "N/A"}</Td>

                    {/* INSTRUCTOR */}
                    <Td>
                      <Box>
                        <Text fontWeight="bold">
                          {cls.instructor?.name || "N/A"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {cls.instructor?.email || "N/A"}
                        </Text>
                      </Box>
                    </Td>

                    {/* STUDENTS */}
                    <Td>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenStudents(students)}
                      >
                        {students.length} students
                      </Button>
                    </Td>

                    {/* TIME */}
                    <Td>
                      {cls.startDate
                        ? new Date(cls.startDate).toLocaleDateString()
                        : "N/A"}{" "}
                      -{" "}
                      {cls.endDate
                        ? new Date(cls.endDate).toLocaleDateString()
                        : "N/A"}
                    </Td>

                    {/* ACTION */}
                    <Td isNumeric>
                      <HStack justify="flex-end" spacing={2}>
                        {/* Menu luôn hiển thị */}
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            size="sm"
                          >
                            Go to
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() =>
                                navigate(
                                  `/dashboard/classes/${cls._id}/assignments`
                                )
                              }
                            >
                              Assignments
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                navigate(
                                  `/dashboard/classes/${cls._id}/lessons`
                                )
                              }
                            >
                              Lessons
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                navigate(
                                  `/dashboard/classes/${cls._id}/tests`
                                )
                              }
                            >
                              Tests
                            </MenuItem>
                          </MenuList>
                        </Menu>

                        {/* Chỉ hiển thị Edit/Delete nếu là ADMIN */}
                        {user.role === "ADMIN" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                navigate(`/dashboard/create-class/${cls._id}`)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleDelete(cls._id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>

          {/* PAGINATION */}
          <Flex justify="space-between" mt={4} align="center">
            <Text>
              Page {currentPage} / {totalPages || 1}
            </Text>

            <HStack>
              <Button
                size="sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                isDisabled={currentPage === 1}
              >
                Prev
              </Button>

              <Button
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                isDisabled={currentPage === totalPages}
              >
                Next
              </Button>
            </HStack>
          </Flex>
        </>
      )}
    </Box>

    {/* MODAL STUDENTS */}
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Students List</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {selectedStudents.length === 0 ? (
            <Text>No students</Text>
          ) : (
            <VStack align="stretch" spacing={3}>
              {selectedStudents.map((s) => (
                <Box
                  key={s._id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Text fontWeight="bold">{s.name || "No name"}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {s.email || "No email"}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  </Box>
);}
export default ManageClassPage;