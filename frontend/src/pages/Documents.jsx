import { useEffect, useState } from "react";
import axios from "axios";

function Documents() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/documents"
      );

      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Documents
      </h2>

      <div className="bg-white p-6 rounded shadow">
        {documents.length === 0 ? (
          <p>No documents uploaded.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">
                  Customer
                </th>

                <th className="text-left p-3">
                  File Name
                </th>

                <th className="text-left p-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b"
                >
                  <td className="p-3">
                    {doc.name}
                  </td>

                  <td className="p-3">
                    {doc.file_name}
                  </td>

                  <td className="p-3">
                    <a
                      href={`http://localhost:5000/uploads/${doc.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Documents;
