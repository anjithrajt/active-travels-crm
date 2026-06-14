import { useEffect, useState } from "react";
import axios from "axios";

function FollowUps() {
  const [followups, setFollowups] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    task: "",
    due_date: "",
  });

  useEffect(() => {
    fetchFollowUps();
    fetchCustomers();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/followups"
      );

      setFollowups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/customers"
      );

      setCustomers(res.data);
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
        "http://localhost:5000/followups",
        formData
      );

      setFormData({
        customer_id: "",
        task: "",
        due_date: "",
      });

      fetchFollowUps();
    } catch (err) {
      console.error(err);
    }
  };

  const markCompleted = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/followups/${id}`
      );

      fetchFollowUps();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Follow Ups
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-4 gap-4 mb-6"
      >
        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">
            Select Customer
          </option>

          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="task"
          placeholder="Task"
          value={formData.task}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2"
        >
          Add Follow Up
        </button>
      </form>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">
                Customer
              </th>

              <th className="text-left p-2">
                Task
              </th>

              <th className="text-left p-2">
                Due Date
              </th>

              <th className="text-left p-2">
                Status
              </th>

              <th className="text-left p-2">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {followups.map((item) => (
              <tr
                key={item.id}
                className="border-b"
              >
                <td className="p-2">
                  {item.name}
                </td>

                <td className="p-2">
                  {item.task}
                </td>

                <td className="p-2">
                  {new Date(
                    item.due_date
                  ).toLocaleDateString()}
                </td>

                <td className="p-2">
                  {item.status}
                </td>

                <td className="p-2">
                  {item.status !==
                  "Completed" ? (
                    <button
                      onClick={() =>
                        markCompleted(item.id)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Complete
                    </button>
                  ) : (
                    "✓ Done"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FollowUps;
