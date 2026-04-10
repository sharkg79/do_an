import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Spinner,
  Flex,
  useToast,
  Select,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getCertificateByIdAPI,
  updateCertificateAPI,
} from "../../api/certificate.api";

import { getUsersAPI } from "../../api/user.api";
import { getCoursesAPI } from "../../api/course.api";

const CertificateEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    student: "",
    course: "",
    grade: "",
    certificateUrl: "",
    issuedAt: "",
  });

  // ================= LOAD =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cert, userList, courseList] = await Promise.all([
          getCertificateByIdAPI(id),
          getUsersAPI(),
          getCoursesAPI(),
        ]);

        setUsers(userList);
        setCourses(courseList);

        setForm({
          student: cert.student?._id || "",
          course: cert.course?._id || "",
          grade: cert.grade ?? "",
          certificateUrl: cert.certificateUrl ?? "",
          issuedAt: cert.issuedAt
            ? cert.issuedAt.substring(0, 10)
            : "",
        });
      } catch (err) {
        toast({
          title: err.message || "Load failed",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.student || !form.course) {
      toast({
        title: "Student & Course are required",
        status: "warning",
      });
      return;
    }

    if (form.grade && (form.grade < 0 || form.grade > 100)) {
      toast({
        title: "Grade must be 0 - 100",
        status: "warning",
      });
      return;
    }

    try {
      setSaving(true);

      await updateCertificateAPI(id, {
        student: form.student,
        course: form.course,
        grade: Number(form.grade),
        certificateUrl: form.certificateUrl,
        issuedAt: form.issuedAt,
      });

      toast({
        title: "Updated successfully",
        status: "success",
      });

      navigate("/manage-certificates");
    } catch (err) {
      toast({
        title:
          err.response?.data?.message ||
          "Update failed (maybe duplicate student + course)",
        status: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box maxW="600px" mx="auto">
      <Heading size="lg" mb={6}>
        Edit Certificate
      </Heading>

      <form onSubmit={handleSubmit}>
        {/* STUDENT */}
        <FormControl mb={4}>
          <FormLabel>Student</FormLabel>
          <Select
            name="student"
            value={form.student}
            onChange={handleChange}
          >
            <option value="">Select student</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </Select>
        </FormControl>

        {/* COURSE */}
        <FormControl mb={4}>
          <FormLabel>Course</FormLabel>
          <Select
            name="course"
            value={form.course}
            onChange={handleChange}
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* GRADE */}
        <FormControl mb={4}>
          <FormLabel>Grade</FormLabel>
          <Input
            type="number"
            name="grade"
            value={form.grade}
            onChange={handleChange}
          />
        </FormControl>

        {/* URL */}
        <FormControl mb={4}>
          <FormLabel>Certificate URL</FormLabel>
          <Input
            name="certificateUrl"
            value={form.certificateUrl}
            onChange={handleChange}
          />
        </FormControl>

        {/* DATE */}
        <FormControl mb={6}>
          <FormLabel>Issued Date</FormLabel>
          <Input
            type="date"
            name="issuedAt"
            value={form.issuedAt}
            onChange={handleChange}
          />
        </FormControl>

        {/* ACTION */}
        <Flex gap={3}>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={saving}
          >
            Save
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default CertificateEditPage;