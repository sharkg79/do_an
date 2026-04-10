import {
  Box,
  Heading,
  Input,
  Select,
  Button,
  Grid,
  Textarea,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";

const CreateLessonPage = () => {
  const { id } = useParams(); // 👈 edit mode
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    class: "",
    contentType: "video",
    contentUrl: "",
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();

  // ================= FETCH CLASSES =================
  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/api/classes");
      setClasses(res.data.data || res.data);
    } catch (err) {
      toast({
        title: "Load classes failed",
        status: "error",
      });
    } finally {
      setLoadingClasses(false);
    }
  };

  // ================= FETCH LESSON (EDIT) =================
  const fetchLesson = async () => {
    try {
      const res = await axiosInstance.get(`/api/lessons/${id}`);
      const data = res.data;

      setForm({
        title: data.title || "",
        description: data.description || "",
        class: data.class?._id || data.class || "",
        contentType: data.contentType || "video",
        contentUrl: data.contentUrl || "",
      });
    } catch (err) {
      toast({
        title: "Load lesson failed",
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchClasses();
    if (isEdit) fetchLesson();
  }, [id]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.class) {
      toast({
        title: "Please fill required fields",
        status: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await axiosInstance.put(`/api/lessons/${id}`, form);

        toast({
          title: "Lesson updated successfully",
          status: "success",
        });
      } else {
        await axiosInstance.post("/api/lessons", form);

        toast({
          title: "Lesson created successfully",
          status: "success",
        });
      }

      navigate(-1);
    } catch (err) {
      toast({
        title:
          err.response?.data?.message ||
          (isEdit ? "Update failed" : "Create failed"),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  if (loadingClasses) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box maxW="700px" mx="auto" mt={10}>
      <Heading size="lg" mb={6}>
        {isEdit ? "Update Lesson" : "Create Lesson"}
      </Heading>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="1fr" gap={4}>
            {/* TITLE */}
            <Input
              placeholder="Lesson title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            {/* DESCRIPTION */}
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            {/* CLASS */}
            <Select
              placeholder="Select class"
              value={form.class}
              onChange={(e) =>
                setForm({ ...form, class: e.target.value })
              }
              required
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </Select>

            {/* CONTENT TYPE */}
            <Select
              value={form.contentType}
              onChange={(e) =>
                setForm({ ...form, contentType: e.target.value })
              }
            >
              <option value="video">Video</option>
              <option value="document">Document</option>
            </Select>

            {/* CONTENT URL */}
            <Input
              placeholder="Content URL (video link or file link)"
              value={form.contentUrl}
              onChange={(e) =>
                setForm({ ...form, contentUrl: e.target.value })
              }
            />

            {/* SUBMIT */}
            <Button
              colorScheme="teal"
              type="submit"
              isLoading={loading}
            >
              {isEdit ? "Update Lesson" : "Create Lesson"}
            </Button>

            {/* CANCEL */}
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default CreateLessonPage;