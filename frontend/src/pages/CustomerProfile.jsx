import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CustomerProfile() {
const [documents, setDocuments] = useState([]);
const [selectedFile, setSelectedFile] = useState(null);
const [visaApplications, setVisaApplications] =
  useState([]);
  const { id } = useParams();

  const [customer, setCustomer] =
    useState(null);

  useEffect(() => {
  fetchCustomer();
  fetchFollowUps();
  fetchDocuments();
  fetchVisaApplications();
}, []);
const fetchDocuments = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/customers/${id}/documents`
    );

    setDocuments(res.data);
  } catch (err) {
    console.error(err);
  }
};
const uploadDocument = async () => {
  console.log("Upload button clicked");

  if (!selectedFile) {
    console.log("No file selected");
    return;
  }

  const formData = new FormData();

  formData.append("file", selectedFile);
  formData.append("customer_id", id);

  try {
    const res = await axios.post(
      "http://localhost:5000/documents/upload",
      formData
    );

    console.log(res.data);

    setSelectedFile(null);

    fetchDocuments();
  } catch (err) {
    console.error(err);
  }
};
  const fetchCustomer = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/customers/${id}`
      );

      setCustomer(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [followups, setFollowups] = useState([]);
  const fetchFollowUps = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/customers/${id}/followups`
    );

    setFollowups(res.data);
  } catch (err) {
    console.error(err);
  }
};
const fetchVisaApplications =
  async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/customers/${id}/visa-applications`
      );

      setVisaApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  if (!customer) {
    return <p>Loading...</p>;
  }

  return (
  
    <div>

      <h2 className="text-3xl font-bold mb-6">
        Customer Profile
      </h2>

      <div className="bg-white p-6 rounded shadow">
	<h3 className="text-xl font-bold mb-4">
    Follow Ups
  </h3>

  {followups.length === 0 ? (
    <p>No follow ups found.</p>
  ) : (
    <ul>
      {followups.map((item) => (
        <li
          key={item.id}
          className="border-b py-2"
        >
          <strong>{item.task}</strong>

          <br />

          Status: {item.status}
        </li>
      ))}
    </ul>
  )}
        <p>
          <strong>Name:</strong>{" "}
          {customer.name}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {customer.phone}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {customer.email}
        </p>

        <p>
          <strong>Passport Number:</strong>{" "}
          {customer.passport_number}
        </p>

        <p>
          <strong>Passport Expiry:</strong>{" "}
          {customer.passport_expiry
            ? new Date(
                customer.passport_expiry
              ).toLocaleDateString()
            : "N/A"}
        </p>

       <p>
  <strong>Destination:</strong>{" "}
  {customer.destination}
</p>

</div>

{/* Documents Section */}

<div className="bg-white p-6 rounded shadow mt-6">

  <h3 className="text-xl font-bold mb-4">
    Documents
  </h3>

  <div className="flex gap-4 mb-4">

    <input
      type="file"
      onChange={(e) =>
        setSelectedFile(e.target.files[0])
      }
    />

    <button
      onClick={uploadDocument}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Upload
    </button>

  </div>

  {documents.length === 0 ? (
    <p>No documents uploaded.</p>
  ) : (
    <ul>
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="border-b py-2"
        >
          <a
            href={`http://localhost:5000/uploads/${doc.file_path}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {doc.file_name}
          </a>
        </li>
      ))}
    </ul>
  )}

</div>
<div className="bg-white p-6 rounded shadow mt-6">

  <h3 className="text-xl font-bold mb-4">
    Visa Applications
  </h3>

  {visaApplications.length === 0 ? (
    <p>No visa applications.</p>
  ) : (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">
            Country
          </th>

          <th className="text-left p-2">
            Visa Type
          </th>

          <th className="text-left p-2">
            Status
          </th>
        </tr>
      </thead>

      <tbody>
        {visaApplications.map((visa) => (
          <tr
            key={visa.id}
            className="border-b"
          >
            <td className="p-2">
              {visa.country}
            </td>

            <td className="p-2">
              {visa.visa_type}
            </td>

            <td className="p-2">
              {visa.status}
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

export default CustomerProfile;
