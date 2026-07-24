import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


import {
  User,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Trash2,
  Eye,
} from "lucide-react";


function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    destination: "",
    passport_number: "",
    passport_expiry: "",
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
        passport_number: "",
        passport_expiry: "",
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
      setShowModal(false);
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Customers
          </h1>

          <p className="text-gray-500">
            Manage all your travel customers
          </p>
        </div>

        <div className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow">
          Total : {filteredCustomers.length}
        </div>
      </div>
      <div className="flex justify-between items-center mb-8">

  <div>
    <h1 className="text-4xl font-bold">
      Customers
    </h1>

    <p className="text-gray-500">
      Manage all your travel customers
    </p>
  </div>

  <button
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg"
  >
    <button
  onClick={() => setShowModal(true)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all"
>
  + Add Customer
</button>
  </button>

</div>
      <input
        type="text"
        placeholder="🔍 Search by name, phone or destination"
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="w-full border p-3 rounded-lg mb-6"
      />
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  {customer.name
                    ? customer.name.charAt(0).toUpperCase()
                    : "?"}
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {customer.name}
                  </h2>

                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <Phone size={16} />
                    {customer.phone || "No phone"}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <Mail size={16} />
                    {customer.email || "No email"}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <Globe size={16} />
                    {customer.destination || "No destination"}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <CreditCard size={16} />
                    {customer.passport_number || "No passport"}
                  </div>
                </div>
              </div>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full h-fit">
                Active
              </span>
            </div>

            <div className="flex gap-3 mt-6">
              <Link
                to={`/customers/${customer.id}`}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Eye size={18} />
                View
              </Link>

              <button
                onClick={() => deleteCustomer(customer.id)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Add New Customer
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-2xl text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

      </div>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-5"
      >

        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded-xl p-3"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="border rounded-xl p-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="border rounded-xl p-3"
        />

        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          className="border rounded-xl p-3"
        />

        <input
          type="text"
          name="passport_number"
          placeholder="Passport Number"
          value={formData.passport_number}
          onChange={handleChange}
          className="border rounded-xl p-3"
        />

        <input
          type="date"
          name="passport_expiry"
          value={formData.passport_expiry}
          onChange={handleChange}
          className="border rounded-xl p-3"
        />

        <div className="md:col-span-2 flex justify-end gap-4 mt-4">

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Customer
          </button>

        </div>

      </form>

    </div>

  </div>
)}
    </div>
  );
}

export default Customers;