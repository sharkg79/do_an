import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Flex,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getAllCertificatesAPI,
  createCertificateAPI,
  deleteCertificateAPI,
} from "../../api/certificate.api";

import { useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const CertificateManagementPage = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [grade, setGrade] = useState("");

  const { user } = useContext(AuthContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // ================= FETCH =================
  const fetchCerts = async () => {
    try {
      const data = await getAllCertificatesAPI();
      setCerts(data);
    } catch (err) {
      toast({ title: "Error loading", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      await createCertificateAPI({
        studentId,
        courseId,
        grade,
      });

      toast({ title: "Created", status: "success" });
      onClose();
      fetchCerts();
    } catch (err) {
      toast({ title: "Create failed", status: "error" });
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    try {
      await deleteCertificateAPI(id);
      toast({ title: "Deleted", status: "success" });
      fetchCerts();
    } catch {
      toast({ title: "Delete failed", status: "error" });
    }
  };

  // ================= UI =================
  return (
    <Box>
      <Flex justify="space-between" mb={6}>
        <Heading>Certificate Management</Heading>

        {user?.role === "INSTRUCTOR" && (
          <Button colorScheme="blue" onClick={onOpen}>
            + Create
          </Button>
        )}
      </Flex>

      {loading ? (
        <Spinner />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Student</Th>
              <Th>Course</Th>
              <Th>Grade</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>

          <Tbody>
            {certs.map((c) => (
              <Tr key={c._id}>
                <Td>{c.student?.name}</Td>
                <Td>{c.course?.title}</Td>
                <Td>{c.grade}</Td>

                <Td>
                  {user?.role === "ADMIN" && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Certificate</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              placeholder="Student ID"
              mb={3}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <Input
              placeholder="Course ID"
              mb={3}
              onChange={(e) => setCourseId(e.target.value)}
            />
            <Input
              placeholder="Grade"
              onChange={(e) => setGrade(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCreate}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CertificateManagementPage;