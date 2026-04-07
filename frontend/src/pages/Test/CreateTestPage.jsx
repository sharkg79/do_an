import {
  Box,
  Heading,
  Input,
  Button,
  Textarea,
  Flex,
  VStack,
  HStack,
  useToast,
  Select,
  IconButton,
} from "@chakra-ui/react";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createTestAPI,
  updateTestAPI,
} from "../../api/test.api";

import axiosInstance from "../../api/axios";

const CreateTestPage = () => {
  const { id } = useParams();
  const isEdit = !!id;

  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);

  const [form, setForm] = useState({
    title: "",
    course: "",
    class: "",
    totalMarks: 100,
    dueDate: "",
    questions: [],
  });

  // ================= LOAD COURSES =================
  const fetchCourses = async () => {
    const res = await axiosInstance.get("/api/courses");
    setCourses(res.data);
  };

  // ================= LOAD CLASSES =================
  const fetchClasses = async (courseId) => {
    if (!courseId) return;
    const res = await axiosInstance.get(
      `/api/classes?course=${courseId}`
    );
    setClasses(res.data);
  };

  // ================= LOAD TEST (EDIT) =================
  const fetchTest = async () => {
    const res = await axiosInstance.get(`/api/tests/${id}`);
    const data = res.data;

    setForm({
      title: data.title,
      course: data.course,
      class: data.class,
      totalMarks: data.totalMarks,
      dueDate: data.dueDate?.slice(0, 16) || "",
      questions: data.questions || [],
    });

    fetchClasses(data.course);
  };

  useEffect(() => {
    fetchCourses();
    if (isEdit) fetchTest();
  }, []);

  // ================= FORM CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "course") {
      fetchClasses(e.target.value);
    }
  };

  // ================= QUESTIONS =================
  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          questionText: "",
          options: ["", ""],
          correctOption: 0,
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updated = [...form.questions];
    updated.splice(index, 1);
    setForm({ ...form, questions: updated });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...form.questions];
    updated[index][field] = value;
    setForm({ ...form, questions: updated });
  };

  // ================= OPTIONS =================
  const addOption = (qIndex) => {
    const updated = [...form.questions];
    updated[qIndex].options.push("");
    setForm({ ...form, questions: updated });
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...form.questions];
    updated[qIndex].options.splice(oIndex, 1);
    setForm({ ...form, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...form.questions];
    updated[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: updated });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.title || !form.course || !form.class) {
        return toast({
          title: "Missing required fields",
          status: "warning",
        });
      }

      if (form.questions.length === 0) {
        return toast({
          title: "Add at least 1 question",
          status: "warning",
        });
      }

      if (isEdit) {
        await updateTestAPI(id, form);
        toast({ title: "Updated successfully", status: "success" });
      } else {
        await createTestAPI(form);
        toast({ title: "Created successfully", status: "success" });
      }

      navigate("/dashboard/tests");

    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <Box>
      <Heading mb={6}>
        {isEdit ? "Update Test" : "Create Test"}
      </Heading>

      <VStack spacing={4} align="stretch">

        <Input
          placeholder="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <Select
          placeholder="Select Course"
          name="course"
          value={form.course}
          onChange={handleChange}
        >
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Select Class"
          name="class"
          value={form.class}
          onChange={handleChange}
        >
          {classes.map((cl) => (
            <option key={cl._id} value={cl._id}>
              {cl.name}
            </option>
          ))}
        </Select>

        <Input
          type="number"
          name="totalMarks"
          value={form.totalMarks}
          onChange={handleChange}
        />

        <Input
          type="datetime-local"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        {/* QUESTIONS */}
        <Heading size="md">Questions</Heading>

        {form.questions.map((q, qIndex) => (
          <Box key={qIndex} borderWidth="1px" p={4} borderRadius="md">
            <Flex justify="space-between">
              <Heading size="sm">Question {qIndex + 1}</Heading>
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => removeQuestion(qIndex)}
              />
            </Flex>

            <Textarea
              mt={2}
              placeholder="Question text"
              value={q.questionText}
              onChange={(e) =>
                updateQuestion(qIndex, "questionText", e.target.value)
              }
            />

            {/* OPTIONS */}
            {q.options.map((opt, oIndex) => (
              <HStack key={oIndex} mt={2}>
                <Input
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) =>
                    updateOption(qIndex, oIndex, e.target.value)
                  }
                />

                <Select
                  value={q.correctOption}
                  onChange={(e) =>
                    updateQuestion(
                      qIndex,
                      "correctOption",
                      Number(e.target.value)
                    )
                  }
                >
                  {q.options.map((_, idx) => (
                    <option key={idx} value={idx}>
                      Correct
                    </option>
                  ))}
                </Select>

                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => removeOption(qIndex, oIndex)}
                />
              </HStack>
            ))}

            <Button mt={2} onClick={() => addOption(qIndex)}>
              + Add Option
            </Button>
          </Box>
        ))}

        <Button leftIcon={<AddIcon />} onClick={addQuestion}>
          Add Question
        </Button>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
        >
          {isEdit ? "Update Test" : "Create Test"}
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateTestPage;