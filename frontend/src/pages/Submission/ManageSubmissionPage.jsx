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
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getSubmissionsAPI,
  deleteSubmissionAPI,
  gradeSubmissionAPI,
} from "../../api/submission.api";

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ManageSubmissionPage = () => {
  const { assignmentId } = useParams(); // ✅ QUAN TRỌNG
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { user, loading: authLoading } = useAuth();

  const navigate = useNavigate();
  const toast = useToast();

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSubmissionsAPI(assignmentId); // ✅ dùng chung API
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
  }, [assignmentId]);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = submissions.filter((s) =>
      s.student?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  }, [search, submissions]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;

    try {
      await deleteSubmissionAPI(id);

      const updated = submissions.filter((s) => s._id !== id);
      setSubmissions(updated);
      setFilteredSubmissions(updated);

      toast({
        title: "Deleted",
        status: "success",
      });
    } catch (err) {
      toast({
        title: err.message || "Delete failed",
        status: "error",
      });
    }
  };

  // ================= GRADE =================
  const handleGrade = async (submission) => {
    const score = prompt("Enter score:");
    if (score === null) return;

    try {
      const updated = await gradeSubmissionAPI(submission._id, {
        score,
      });

      const newList = submissions.map((s) =>
        s._id === submission._id ? updated.submission : s
      );

      setSubmissions(newList);
      setFilteredSubmissions(newList);

      toast({
        title: "Graded",
        status: "success",
      });
    } catch (err) {
      toast({
        title: err.message || "Grade failed",
        status: "error",
      });
    }
  };

  // ================= PERMISSION =================
  const canManage = (submission) => {
    if (user?.role?.toUpperCase() === "ADMIN") return true;

    if (user?.role?.toUpperCase() === "INSTRUCTOR") {
      return (
        submission.assignment?.instructor?.toString() ===
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
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manage Submissions</Heading>
      </Flex>

      {/* SEARCH */}
      <Input
        placeholder="Search by student name..."
        mb={6}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CONTENT */}
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
                {submission.assignment?.title || "Assignment"}
              </Heading>

              <Text fontSize="sm" mb={2}>
                Student: {submission.student?.name}
              </Text>

              <Text fontSize="sm" mb={2}>
                Email: {submission.student?.email}
              </Text>

              <Text fontSize="sm" mb={2}>
                Score: {submission.score || 0}
              </Text>

              <Text fontSize="sm" mb={2}>
                Submitted:{" "}
                {new Date(submission.createdAt).toLocaleDateString()}
              </Text>

              {/* FILE */}
              <Button
                size="sm"
                colorScheme="blue"
                mb={3}
                onClick={() =>
                  window.open(
                    `http://localhost:5000${submission.fileUrl}`,
                    "_blank"
                  )
                }
              >
                View File
              </Button>

              {/* ACTION */}
              <Flex gap={2} wrap="wrap">
                {canManage(submission) && (
                  <>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => handleGrade(submission)}
                    >
                      Grade
                    </Button>

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
    </Box>
  );
};

export default ManageSubmissionPage;