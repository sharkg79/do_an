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

import { useEffect, useState, useContext } from "react";
import {
  getSubmissionsByAssignmentAPI,
  deleteSubmissionAPI,
  gradeSubmissionAPI,
} from "../../api/submission.api";

import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ManageSubmissionPage = () => {
  const { assignmentId } = useParams();
  const { user } = useContext(AuthContext);

  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const toast = useToast();

  // ================= FETCH =================
  const fetchSubmissions = async () => {
    try {
      const data = await getSubmissionsByAssignmentAPI(assignmentId);
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (err) {
      toast({
        title: "Error loading submissions",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = submissions.filter((s) =>
      s.student?.name.toLowerCase().includes(search.toLowerCase())
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
        title: "Submission deleted",
        status: "success",
      });
    } catch (err) {
      toast({
        title: "Delete failed",
        status: "error",
      });
    }
  };

  // ================= GRADE =================
  const handleGrade = async (id) => {
    const score = prompt("Enter score (0-100):");
    if (score === null) return;

    const feedback = prompt("Enter feedback:");

    try {
      await gradeSubmissionAPI(id, {
        score: Number(score),
        feedback,
      });

      toast({
        title: "Graded successfully",
        status: "success",
      });

      fetchSubmissions();
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Grade failed",
        status: "error",
      });
    }
  };

  // ================= UI =================
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
      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="lg" />
        </Flex>
      ) : filteredSubmissions.length === 0 ? (
        <Text>No submissions found</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {filteredSubmissions.map((s) => (
            <Box
              key={s._id}
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
            >
              {/* STUDENT */}
              <Heading size="sm" mb={2}>
                {s.student?.name}
              </Heading>

              <Text fontSize="sm" color="gray.600" mb={2}>
                {s.student?.email}
              </Text>

              {/* FILE */}
              <Text fontSize="sm" mb={2}>
                File:{" "}
                <a
                  href={`http://localhost:5000${s.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.fileName || "View"}
                </a>
              </Text>

              {/* SCORE */}
              <Text fontWeight="bold" mb={2}>
                Score: {s.score}
              </Text>

              {/* DATE */}
              <Text fontSize="xs" color="gray.500" mb={4}>
                {new Date(s.createdAt).toLocaleString()}
              </Text>

              {/* ACTIONS */}
              <Flex gap={2} wrap="wrap">
                {/* INSTRUCTOR ONLY */}
                {user?.role === "INSTRUCTOR" && (
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleGrade(s._id)}
                  >
                    Grade
                  </Button>
                )}

                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(s._id)}
                >
                  Delete
                </Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ManageSubmissionPage;