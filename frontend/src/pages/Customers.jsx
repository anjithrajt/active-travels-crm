import { useEffect, useState } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    destination: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

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
        "http://localhost:5000/customers",
        formData
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        destination: "",
      });

      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/customers/${id}`
      );

      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.destination
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Customers
      </h2>

      <input
        type="text"
        placeholder="🔍 Search by name, phone or destination"
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="w-full border p-3 rounded mb-4"
      />

      <p className="mb-4 text-gray-600">
        Showing {filteredCustomers.length} customer(s)
      </p>

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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Add Customer
        </button>
      </form>

      <div className="bg-white shadow rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Destination</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b"
                >
                  <td className="p-3">
                    {customer.name}
                  </td>

                  <td className="p-3">
                    {customer.phone}
                  </td>

                  <td className="p-3">
                    {customer.email}
                  </td>

                  <td className="p-3">
                    {customer.destination}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        deleteCustomer(customer.id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4"
                >
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
