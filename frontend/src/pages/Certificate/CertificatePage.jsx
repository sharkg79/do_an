import { useEffect, useState } from "react";
import axios from "axios";

const CertificatePage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("/api/certificates/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setCertificates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading certificates...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        My Certificates
      </h1>

      {certificates.length === 0 ? (
        <div className="text-gray-500">
          You don’t have any certificates yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6"
            >
              {/* Course Title */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {cert.course?.title}
              </h2>

              {/* Score */}
              <p className="text-gray-600 mb-1">
                Score: <span className="font-medium">{cert.grade}</span>
              </p>

              {/* Date */}
              <p className="text-gray-500 text-sm mb-4">
                Issued: {new Date(cert.createdAt).toLocaleDateString()}
              </p>

              {/* Button */}
              <a
                href={`http://localhost:5000${cert.certificateUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full text-center bg-[#A435F0] text-white py-2 rounded-md font-medium hover:bg-[#8710d8] transition"
              >
                View Certificate
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatePage;