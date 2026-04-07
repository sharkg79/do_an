import {
  Box,
  Heading,
  Input,
  Button,
  Grid,
  useToast,
  Spinner,
  Textarea,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";

const CreateCoursePage = () => {
  const { id } = useParams(); // 👈 dùng cho update
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  const toast = useToast();
  const navigate = useNavigate();

  // ================= FETCH COURSE (EDIT MODE) =================
  const fetchCourse = async () => {
    try {
      const res = await axiosInstance.get(`/api/courses/${id}`);
      const data = res.data.course || res.data;

      setForm({
        title: data?.title || "",
        description: data?.description || "",
        price: data?.price || "",
      });
    } catch (err) {
      toast({
        title: "Load course failed",
        status: "error",
      });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isEdit) fetchCourse();
  }, [id]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title) {
      toast({
        title: "Title is required",
        status: "warning",
      });
      return;
    }

    if (form.price && Number(form.price) < 0) {
      toast({
        title: "Price must be >= 0",
        status: "error",
      });
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await axiosInstance.put(`/api/courses/${id}`, form);

        toast({
          title: "Course updated successfully",
          status: "success",
        });
      } else {
        await axiosInstance.post("/api/courses", form);

        toast({
          title: "Course created successfully",
          status: "success",
        });
      }

      navigate("/instructor/courses");
    } catch (err) {
      console.error(err);

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

  // ================= LOADING =================
  if (loadingData) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Box maxW="700px" mx="auto" mt={10}>
      <Heading size="lg" mb={6}>
        {isEdit ? "Update Course" : "Create New Course"}
      </Heading>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="1fr" gap={4}>
            {/* TITLE */}
            <Input
              placeholder="Course title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            {/* DESCRIPTION */}
            <Textarea
              placeholder="Course description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            {/* PRICE */}
            <Input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            {/* SUBMIT */}
            <Button
              colorScheme="teal"
              type="submit"
              isLoading={loading}
            >
              {isEdit ? "Update Course" : "Create Course"}
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

export default CreateCoursePage;