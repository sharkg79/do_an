import {
  Box,
  Heading,
  Input,
  Select,
  Button,
  Grid,
  useToast,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios";

const CreateClassPage = () => {
  const { id } = useParams(); // 👈 dùng cho update
  const isEdit = !!id;
const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({
    title: "",
    course: "",
    instructor: "",
    startDate: "",
    endDate: "",
  });

  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();
const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "";

  return d.toISOString().slice(0, 10);
};
  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/api/courses");
      setCourses(res.data.data || res.data);
    } catch (err) {
      toast({
        title: "Load courses failed",
        status: "error",
      });
    } finally {
      setLoadingCourses(false);
    }
  };

  // ================= FETCH CLASS (EDIT MODE) =================
  const fetchClass = async () => {
    try {
      const res = await axiosInstance.get(`/api/classes/${id}`);
      const data = res.data.class;

      setForm({
  title: data?.title || "",
  course: data?.course?._id || data?.course || "",
  instructor: data?.instructor?._id || data?.instructor || "",
  startDate: formatDate(data?.startDate),
  endDate: formatDate(data?.endDate),
});

      setInstructor(data.instructor); // 👈 lấy instructor
    } catch (err) {
      toast({
        title: "Load class failed",
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors(); 
    if (isEdit) fetchClass();
  }, [id]);
  // ================= FETCH INSTRUCTORS (ADMIN ONLY) =================
const fetchInstructors = async () => {
  try {
    const res = await axiosInstance.get("/api/users?role=INSTRUCTOR");
    setInstructors(res.data.data || res.data);
  } catch (err) {
    toast({
      title: "Load instructors failed",
      status: "error",
    });
  }
};
  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.course) {
      toast({
        title: "Please fill all required fields",
        status: "warning",
      });
      return;
    }

    if (form.startDate && form.endDate) {
      if (new Date(form.startDate) > new Date(form.endDate)) {
        toast({
          title: "Start date must be before end date",
          status: "error",
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (isEdit) {
        await axiosInstance.put(`/api/classes/${id}`, form);

        toast({
          title: "Class updated successfully",
          status: "success",
        });
      } else {
        await axiosInstance.post("/api/classes", form);

        toast({
          title: "Class created successfully",
          status: "success",
        });
      }

      navigate("/dashboard/classes");
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

  // ================= UI =================
  if (loadingCourses) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box maxW="700px" mx="auto" mt={10}>
      <Heading size="lg" mb={6}>
        {isEdit ? "Update Class" : "Create New Class"}
      </Heading>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="1fr" gap={4}>
            {/* TITLE */}
            <Input
              placeholder="Class title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            {/* COURSE */}
            <Select
              placeholder="Select course"
              value={form.course}
              onChange={(e) =>
                setForm({ ...form, course: e.target.value })
              }
              required
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </Select>

            <Select
  placeholder="Select instructor"
  value={form.instructor || ""}
  onChange={(e) =>
    setForm({ ...form, instructor: e.target.value })
  }
>
  {instructors.map((i) => (
    <option key={i._id} value={i._id}>
      {i.name} - {i.email}
    </option>
  ))}
</Select>

            {/* START DATE */}
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />

            {/* END DATE */}
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
            />

            {/* SUBMIT */}
            <Button
              colorScheme="teal"
              type="submit"
              isLoading={loading}
            >
              {isEdit ? "Update Class" : "Create Class"}
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

export default CreateClassPage;