import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  useToast,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getTestSubmissionsAPI,
  deleteTestSubmissionAPI,
} from "../../api/test.api";

import { useParams } from "react-router-dom";

const ManageTestSubmissionPage = () => {
  const { testId } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const toast = useToast();

  // ================= FETCH =================
  const fetchSubmissions = async () => {
    try {
      const data = await getTestSubmissionsAPI(testId);
      setSubmissions(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
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
  }, [testId]);

  // ================= SEARCH =================
  useEffect(() => {
    const filteredData = submissions.filter((s) =>
      s.student?.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
  }, [search, submissions]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;

    try {
      await deleteTestSubmissionAPI(id);

      const updated = submissions.filter((s) => s._id !== id);
      setSubmissions(updated);
      setFiltered(updated);

      toast({
        title: "Deleted successfully",
        status: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Delete failed",
        status: "error",
      });
    }
  };

  // ================= UI =================
  return (
    <Box>
      <Heading size="lg" mb={6}>
        Manage Test Submissions
      </Heading>

      {/* SEARCH */}
      <Input
        placeholder="Search student..."
        mb={6}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CONTENT */}
      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="lg" />
        </Flex>
      ) : filtered.length === 0 ? (
        <Text>No submissions found</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Student</Th>
              <Th>Email</Th>
              <Th>Score</Th>
              <Th>Date</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>

          <Tbody>
            {filtered.map((s) => (
              <Tr key={s._id}>
                <Td>{s.student?.name}</Td>
                <Td>{s.student?.email}</Td>
                <Td>{s.score}</Td>
                <Td>
                  {new Date(s.createdAt).toLocaleString()}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default ManageTestSubmissionPage;