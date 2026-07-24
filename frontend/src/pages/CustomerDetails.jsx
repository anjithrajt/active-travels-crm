import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Phone,
  Mail,
  Globe,
  FileText,
  Calendar,
  User,
} from "lucide-react";

function CustomerDetails() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, []);

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

  if (!customer) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="space-y-8">

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">

              {customer.name.charAt(0).toUpperCase()}

            </div>

            <div>

              <h1 className="text-4xl font-bold">

                {customer.name}

              </h1>

              <p className="text-green-600 font-semibold mt-2">

                ● Active Customer

              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="font-bold text-xl mb-4">

            Personal Information

          </h2>

          <div className="space-y-4">

            <div className="flex gap-3">

              <Phone />

              {customer.phone}

            </div>

            <div className="flex gap-3">

              <Mail />

              {customer.email || "No Email"}

            </div>

            <div className="flex gap-3">

              <Globe />

              {customer.destination}

            </div>

            <div className="flex gap-3">

              <FileText />

              {customer.passport_number || "No Passport"}

            </div>

            <div className="flex gap-3">

              <Calendar />

              {customer.passport_expiry
                ? new Date(
                    customer.passport_expiry
                  ).toLocaleDateString()
                : "Not Available"}

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="font-bold text-xl mb-4">

            Quick Actions

          </h2>

          <div className="grid gap-4">

            <button className="bg-blue-600 text-white p-3 rounded-xl">
              Edit Customer
            </button>

            <button className="bg-green-600 text-white p-3 rounded-xl">
              Add Follow Up
            </button>

            <button className="bg-purple-600 text-white p-3 rounded-xl">
              Create Visa
            </button>

            <button className="bg-pink-600 text-white p-3 rounded-xl">
              Book Flight
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CustomerDetails;