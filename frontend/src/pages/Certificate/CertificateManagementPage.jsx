import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Spinner,
  useToast,
  Button,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getAllCertificatesAPI,
  deleteCertificateAPI,
} from "../../api/certificate.api";

import { useAuth } from "../../context/AuthContext";

const ManageCertificatePage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  // ================= FETCH =================
  const fetchCertificates = async () => {
    try {
      const data = await getAllCertificatesAPI();
      setCertificates(data);
    } catch (err) {
      toast({
        title: err.message || "Fetch failed",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;

    try {
      await deleteCertificateAPI(id);

      const updated = certificates.filter((c) => c._id !== id);
      setCertificates(updated);

      toast({
        title: "Deleted successfully",
        status: "success",
      });
    } catch (err) {
      toast({
        title: err.message || "Delete failed",
        status: "error",
      });
    }
  };

  // ================= LOADING =================
  if (loading || authLoading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manage Certificates</Heading>
      </Flex>

      {/* CONTENT */}
      {certificates.length === 0 ? (
        <Text>No certificates found</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {certificates.map((cert) => (
            <Box
              key={cert._id}
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
            >
              {/* STUDENT */}
              <Text fontWeight="bold" mb={2}>
                {cert.student?.name}
              </Text>

              <Text fontSize="sm" color="gray.500" mb={2}>
                {cert.student?.email}
              </Text>

              {/* COURSE */}
              <Text fontSize="md" mb={2}>
                Course: {cert.course?.title}
              </Text>

              {/* GRADE */}
              <Text fontSize="sm" mb={2}>
                Grade: {cert.grade ?? "N/A"}
              </Text>

              {/* DATE */}
              <Text fontSize="sm" color="gray.500" mb={4}>
                Issued:{" "}
                {new Date(cert.issuedAt).toLocaleDateString()}
              </Text>

              {/* ACTION */}
              <Flex gap={2}>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(cert._id)}
                >
                  Delete
                </Button>

                {cert.certificateUrl && (
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() =>
                      window.open(cert.certificateUrl, "_blank")
                    }
                  >
                    View
                  </Button>
                )}
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ManageCertificatePage;