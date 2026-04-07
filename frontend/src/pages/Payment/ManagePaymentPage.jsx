import {
  Box,
  Heading,
  Input,
  Flex,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getPaymentsAPI,
} from "../../api/payment.api";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PaymentManagementPage = () => {
  const { user } = useContext(AuthContext);

  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const toast = useToast();

  // ================= FETCH =================
  const fetchPayments = async () => {
    try {
      let data;

      if (user.role === "ADMIN") {
        data = await getPaymentsAPI();
      } else {
        
      }

      setPayments(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error loading payments",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const f = payments.filter((p) =>
      p.course?.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, payments]);

  // ================= STATUS COLOR =================
  const getStatus = (p) => {
    if (p.isPaid) return "Paid";
    return "Pending";
  };

  const getColor = (p) => {
    if (p.isPaid) return "green";
    return "orange";
  };

  // ================= UI =================
  return (
    <Box>
      <Heading size="lg" mb={6}>
        Payment Management
      </Heading>

      <Input
        placeholder="Search by course..."
        mb={6}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <Flex justify="center" mt={10}>
          <Spinner size="lg" />
        </Flex>
      ) : filtered.length === 0 ? (
        <Text>No payments found</Text>
      ) : (
        <Table variant="simple" bg="white" borderRadius="lg">
          <Thead>
            <Tr>
              <Th>Student</Th>
              <Th>Course</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Method</Th>
              <Th>Paid At</Th>
            </Tr>
          </Thead>

          <Tbody>
            {filtered.map((p) => (
              <Tr key={p._id}>
                <Td>{p.student?.name}</Td>

                <Td>{p.course?.title}</Td>

                <Td>${p.course?.price || 0}</Td>

                <Td>
                  <Badge colorScheme={getColor(p)}>
                    {getStatus(p)}
                  </Badge>
                </Td>

                <Td>{p.paymentMethod || "N/A"}</Td>

                <Td>
                  {p.paidAt
                    ? new Date(p.paidAt).toLocaleString()
                    : "-"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default PaymentManagementPage;