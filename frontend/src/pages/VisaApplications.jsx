import { useEffect, useState } from "react";
import axios from "axios";

function VisaApplications() {
  const [applications, setApplications] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    country: "",
    visa_type: "",
    application_date: "",
    remarks: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/visa-applications"
      );

      setApplications(res.data);
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
        "http://localhost:5000/visa-applications",
        formData
      );

      setFormData({
        customer_id: "",
        country: "",
        visa_type: "",
        application_date: "",
        remarks: "",
      });

      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/visa-applications/${id}/status`,
        { status }
      );

      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Visa Applications
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-5 gap-4 mb-6"
      >
        <input
          type="number"
          name="customer_id"
          placeholder="Customer ID"
          value={formData.customer_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="visa_type"
          placeholder="Visa Type"
          value={formData.visa_type}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="application_date"
          value={formData.application_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Add Visa
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Country</th>
              <th className="text-left p-3">Visa Type</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((item) => (
              <tr
                key={item.id}
                className="border-b"
              >
                <td className="p-3">
                  {item.name}
                </td>

                <td className="p-3">
                  {item.country}
                </td>

                <td className="p-3">
                  {item.visa_type}
                </td>

                <td className="p-3">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateStatus(
                        item.id,
                        e.target.value
                      )
                    }
                    className="border p-1 rounded"
                  >
                    <option>
                      Documents Pending
                    </option>
                    <option>
                      Submitted
                    </option>
                    <option>
                      Processing
                    </option>
                    <option>
                      Approved
                    </option>
                    <option>
                      Rejected
                    </option>
                  </select>
                </td>
                <td className="p-3">
  {item.remarks}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisaApplications;
