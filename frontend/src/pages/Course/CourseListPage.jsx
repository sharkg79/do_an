import { useEffect, useState } from "react";
import { SimpleGrid, Spinner, Center } from "@chakra-ui/react";
import { getCourses } from "../../services/courseService";
import CourseCard from "../../components/CourseCard";

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </SimpleGrid>
  );
};

export default CourseListPage;