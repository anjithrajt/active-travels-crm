import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [customers, setCustomers] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">
        Active Travels CRM
      </h1>

      <div className="bg-white shadow rounded-lg p-6">

        <h2 className="text-xl font-semibold mb-4">
          Customers
        </h2>

        <table className="w-full border-collapse">

          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Destination</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
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
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default App;
