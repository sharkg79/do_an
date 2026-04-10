import {
  Box,
  Heading,
  Input,
  Button,
  Grid,
  useToast,
  Spinner,
  Textarea,
  Text,
  Flex,
  IconButton,
} from "@chakra-ui/react";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  createTestAPI,
  updateTestAPI,
} from "../../api/test.api";

const CreateTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const test = location.state?.test; // 👈 edit mode
  const query = new URLSearchParams(location.search);
  const classIdFromQuery = query.get("classId");

  const isEdit = !!test;

  const [form, setForm] = useState({
    title: "",
    class: classIdFromQuery || "",
    dueDate: "",
    totalMarks: 100,
    questions: [],
  });

  const [loading, setLoading] = useState(false);

  // ================= INIT EDIT =================
  useEffect(() => {
    if (isEdit) {
      setForm({
        title: test.title || "",
        class: test.class?._id || test.class,
        dueDate: test.dueDate
          ? new Date(test.dueDate).toISOString().slice(0, 10)
          : "",
        totalMarks: test.totalMarks || 100,
        questions: test.questions || [],
      });
    }
  }, [test]);

  // ================= QUESTION HANDLER =================
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

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...form.questions];
    updated[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: updated });
  };

  const addOption = (qIndex) => {
    const updated = [...form.questions];
    updated[qIndex].options.push("");
    setForm({ ...form, questions: updated });
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...form.questions];
    if (updated[qIndex].options.length <= 2) return;

    updated[qIndex].options.splice(oIndex, 1);
    setForm({ ...form, questions: updated });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.class) {
      toast({
        title: "Title & Class required",
        status: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await updateTestAPI(test._id, form);

        toast({
          title: "Updated successfully",
          status: "success",
        });
      } else {
        await createTestAPI(form);

        toast({
          title: "Created successfully",
          status: "success",
        });
      }

      navigate(-1);
    } catch (err) {
      toast({
        title: err.message || "Save failed",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <Box maxW="900px" mx="auto" mt={10}>
      <Heading size="lg" mb={6}>
        {isEdit ? "Update Test" : "Create Test"}
      </Heading>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="1fr" gap={4}>
            {/* TITLE */}
            <Input
              placeholder="Test title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            {/* DUE DATE */}
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />

            {/* TOTAL MARKS */}
            <Input
              type="number"
              placeholder="Total marks"
              value={form.totalMarks}
              onChange={(e) =>
                setForm({
                  ...form,
                  totalMarks: e.target.value,
                })
              }
            />

            {/* QUESTIONS */}
            <Box>
              <Flex justify="space-between" mb={3}>
                <Heading size="md">Questions</Heading>
                <Button size="sm" onClick={addQuestion}>
                  + Add Question
                </Button>
              </Flex>

              {form.questions.length === 0 && (
                <Text>No questions yet</Text>
              )}

              {form.questions.map((q, qIndex) => (
                <Box
                  key={qIndex}
                  border="1px solid #ddd"
                  p={4}
                  borderRadius="md"
                  mb={4}
                >
                  <Flex justify="space-between" mb={2}>
                    <Text fontWeight="bold">
                      Question {qIndex + 1}
                    </Text>
                    <IconButton
                      size="sm"
                      icon={<DeleteIcon />}
                      onClick={() => removeQuestion(qIndex)}
                    />
                  </Flex>

                  {/* QUESTION TEXT */}
                  <Textarea
                    placeholder="Question text"
                    value={q.questionText}
                    onChange={(e) =>
                      updateQuestion(
                        qIndex,
                        "questionText",
                        e.target.value
                      )
                    }
                    mb={3}
                  />

                  {/* OPTIONS */}
                  {q.options.map((opt, oIndex) => (
                    <Flex key={oIndex} mb={2} gap={2}>
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) =>
                          updateOption(
                            qIndex,
                            oIndex,
                            e.target.value
                          )
                        }
                      />

                      <Button
                        size="sm"
                        colorScheme={
                          q.correctOption === oIndex
                            ? "green"
                            : "gray"
                        }
                        onClick={() =>
                          updateQuestion(
                            qIndex,
                            "correctOption",
                            oIndex
                          )
                        }
                      >
                        Correct
                      </Button>

                      <IconButton
                        size="sm"
                        icon={<DeleteIcon />}
                        onClick={() =>
                          removeOption(qIndex, oIndex)
                        }
                      />
                    </Flex>
                  ))}

                  <Button
                    size="sm"
                    leftIcon={<AddIcon />}
                    onClick={() => addOption(qIndex)}
                  >
                    Add Option
                  </Button>
                </Box>
              ))}
            </Box>

            {/* SUBMIT */}
            <Button
              colorScheme="teal"
              type="submit"
              isLoading={loading}
            >
              {isEdit ? "Update Test" : "Create Test"}
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

export default CreateTestPage;