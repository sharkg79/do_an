import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  createAssignmentAPI,
  updateAssignmentAPI,
} from "../../api/assignment.api";

const CreateAssignmentPage = () => {
  const { classId: paramClassId } = useParams(); // ✅ rename cho rõ
  const location = useLocation();

  const assignment = location.state?.assignment;

  // ✅ fallback classId khi edit
  const classId = paramClassId || assignment?.classId;

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const navigate = useNavigate();
  const toast = useToast();

  // ================= LOAD EDIT =================
  useEffect(() => {
    if (!assignment) return;

    setForm({
      title: assignment.title || "",
      description: assignment.description || "",
      dueDate: assignment.dueDate
        ? new Date(assignment.dueDate).toISOString().slice(0, 10)
        : "",
    });

    setIsEdit(true);
  }, [assignment]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.title.trim()) {
        return toast({
          title: "Title is required",
          status: "warning",
        });
      }

      if (!classId) {
        return toast({
          title: "Missing classId",
          status: "error",
        });
      }

      setLoading(true);

      if (isEdit) {
        if (!assignment?._id) {
          throw new Error("Missing assignment data");
        }

        await updateAssignmentAPI(assignment._id, {
          ...form,
          classId, // ✅ FIX (quan trọng)
          dueDate: form.dueDate || null,
        });

        toast({
          title: "Assignment updated",
          status: "success",
        });
      } else {
        await createAssignmentAPI({
          ...form,
          classId, // ✅ FIX
          dueDate: form.dueDate || null,
        });

        toast({
          title: "Assignment created",
          status: "success",
        });
      }

      navigate(-1);
    } catch (err) {
      console.error("ERROR:", err);

      toast({
        title: err?.message || "Action failed",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <Box maxW="600px" mx="auto">
      <Heading mb={6}>
        {isEdit ? "Update Assignment" : "Create Assignment"}
      </Heading>

      <VStack spacing={4}>
        <Input
          placeholder="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <Textarea
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <Input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <Button
          colorScheme="blue"
          w="full"
          onClick={handleSubmit}
          isLoading={loading}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateAssignmentPage;