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
  getAssignmentsAPI,
  deleteAssignmentAPI,
} from "../../api/assignment.api";

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ManageAssignmentPage = () => {
  const { classId } = useParams();

  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { user, loading: authLoading } = useAuth();

  const navigate = useNavigate();
  const toast = useToast();

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAssignmentsAPI(classId);
        setAssignments(data);
        setFilteredAssignments(data);
      } catch (err) {
        toast({
          title: err?.response?.data?.message || err.message,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId]);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = assignments.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAssignments(filtered);
  }, [search, assignments]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      await deleteAssignmentAPI(id);

      const updated = assignments.filter((a) => a._id !== id);
      setAssignments(updated);
      setFilteredAssignments(updated);

      toast({
        title: "Assignment deleted",
        status: "success",
      });
    } catch (err) {
      toast({
        title: err?.response?.data?.message || err.message,
        status: "error",
      });
    }
  };

  // ✅ FIX: chỉ check role
  const canEdit = () => {
    return ["ADMIN", "INSTRUCTOR"].includes(
      user?.role?.toUpperCase()
    );
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
        <Heading size="lg">Manage Assignments</Heading>

        {canEdit() && (
          <Button
            colorScheme="blue"
            onClick={() =>
              navigate(`/dashboard/create-assignment/${classId}`)
            }
          >
            + Create Assignment
          </Button>
        )}
      </Flex>

      {/* SEARCH */}
      <Input
        placeholder="Search assignment..."
        mb={6}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CONTENT */}
      {filteredAssignments.length === 0 ? (
        <Text>No assignments found</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {filteredAssignments.map((assignment) => (
            <Box
              key={assignment._id}
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
            >
              <Heading size="md" mb={2}>
                {assignment.title}
              </Heading>

              <Text fontSize="sm" color="gray.600" mb={3}>
                {assignment.description}
              </Text>

              <Text fontSize="sm" mb={2}>
                Due:{" "}
                {assignment.dueDate
                  ? new Date(assignment.dueDate).toLocaleDateString()
                  : "N/A"}
              </Text>

              <Text fontSize="sm" color="gray.500" mb={4}>
                Created by: {assignment.instructor?.name}
              </Text>

              <Flex gap={2} wrap="wrap">
                {canEdit() && (
                  <>
                    <Button
                      size="sm"
                      colorScheme="yellow"
                      onClick={() =>
                        navigate(
                          `/dashboard/create-assignment/${classId}`,
                          { state: { assignment } }
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(assignment._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}

                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={() =>
                    navigate(
                      `/dashboard/assignments/${assignment._id}/submissions`
                    )
                  }
                >
                  Submissions
                </Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ManageAssignmentPage;