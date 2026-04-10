import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  Text,
  Flex,
  Spinner,
  useToast,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getTestSubmissionsAPI,
  deleteTestSubmissionAPI,
  gradeTestSubmissionAPI,
} from "../../api/testSubmission.api";

import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ManageTestSubmissionPage = () => {
  const { testId } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ modal state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTestSubmissionsAPI(testId);
        setSubmissions(data);
        setFilteredSubmissions(data);
      } catch (err) {
        toast({
          title: err.message || "Fetch failed",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [testId]);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = submissions.filter((s) => {
      const name = s.student?.name || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredSubmissions(filtered);
  }, [search, submissions]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;

    try {
      await deleteTestSubmissionAPI(id);

      const updated = submissions.filter((s) => s._id !== id);
      setSubmissions(updated);
      setFilteredSubmissions(updated);

      toast({ title: "Deleted", status: "success" });
    } catch (err) {
      toast({ title: err.message || "Delete failed", status: "error" });
    }
  };

  // ================= OPEN MODAL =================
  const handleViewDetail = (submission) => {
    setSelectedSubmission(submission);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSubmission(null);
  };

  // ================= PERMISSION =================
  const canManage = (submission) => {
    if (user?.role?.toUpperCase() === "ADMIN") return true;

    if (user?.role?.toUpperCase() === "INSTRUCTOR") {
      return (
        submission.test?.instructor?.toString() ===
        user._id?.toString()
      );
    }

    return false;
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
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manage Test Submissions</Heading>
      </Flex>

      <Input
        placeholder="Search by student name..."
        mb={6}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredSubmissions.length === 0 ? (
        <Text>No submissions found</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {filteredSubmissions.map((submission) => (
            <Box
              key={submission._id}
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
            >
              <Heading size="sm" mb={2}>
                {submission.test?.title || "Test"}
              </Heading>

              <Text fontSize="sm">Student: {submission.student?.name || "Unknown"}</Text>
              <Text fontSize="sm">Score: {submission.score} / {submission.totalQuestions}</Text>

              <Text fontSize="sm" mb={2}>
                {new Date(submission.createdAt).toLocaleDateString()}
              </Text>

              <Flex gap={2} wrap="wrap">
                <Button
                  size="sm"
                  onClick={() => handleViewDetail(submission)}
                >
                  View Details
                </Button>

                {canManage(submission) && (
                  <>
                    
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(submission._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* ================= MODAL ================= */}
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submission Details</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {selectedSubmission?.answers?.length > 0 ? (
              <VStack align="start" spacing={3}>
                {selectedSubmission.answers.map((ans, index) => (
                  <Box
                    key={ans._id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    w="100%"
                  >
                    <Text>Question #{index + 1}</Text>
                    <Text>Question ID: {ans.questionId}</Text>
                    <Text>Selected: {ans.selectedOption}</Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No answers</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageTestSubmissionPage;