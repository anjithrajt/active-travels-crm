import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CustomerProfile() {
  const { id } = useParams();

  const [customer, setCustomer] =
    useState(null);

  useEffect(() => {
    fetchCustomer();
    fetchFollowUps();
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

    </div>
    
  );
}

export default CustomerProfile;
