import { useEffect, useState } from "react";
import axios from "axios";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    destination: "",
    notes: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/leads"
      );

      setLeads(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/leads",
        formData
      );

      setFormData({
        name: "",
        phone: "",
        destination: "",
        notes: "",
      });

      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/leads/${id}`
      );

      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

const updateStatus = async (id, status) => {
  try {
    await axios.put(
      `http://localhost:5000/leads/${id}/status`,
      { status }
    );

    fetchLeads();
  } catch (err) {
    console.error(err);
  }
};

const convertLead = async (id) => {
  try {
    await axios.post(
      `http://localhost:5000/leads/${id}/convert`
    );

    fetchLeads();
  } catch (err) {
    console.error(err);
  }
};
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.destination
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Leads
      </h2>

      <input
        type="text"
        placeholder="🔍 Search leads"
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="w-full border p-3 rounded mb-4"
      />

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Add Lead
        </button>
      </form>

      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Destination</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b"
              >
                <td className="p-3">
                  {lead.name}
                </td>

                <td className="p-3">
                  {lead.phone}
                </td>

                <td className="p-3">
                  {lead.destination}
                </td>

                <td className="p-3">
  <select
    value={lead.status}
    onChange={(e) =>
      updateStatus(
        lead.id,
        e.target.value
      )
    }
    className="border rounded p-1"
  >
    <option>New</option>
    <option>Contacted</option>
    <option>Documents Pending</option>
    <option>Visa Processing</option>
    <option>Booked</option>
    <option>Completed</option>
  </select>
</td>

                <td className="p-3 flex gap-2">

  <button
    onClick={() =>
      convertLead(lead.id)
    }
    className="bg-green-600 text-white px-3 py-1 rounded"
  >
    Convert
  </button>

  <button
    onClick={() =>
      deleteLead(lead.id)
    }
    className="bg-red-600 text-white px-3 py-1 rounded"
  >
    Delete
  </button>

</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leads;
