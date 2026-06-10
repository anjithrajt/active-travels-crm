import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    destinations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/dashboard/stats"
      );

      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Dashboard
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">
            Total Customers
          </h3>

          <p className="text-4xl font-bold">
            {stats.totalCustomers}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">
            Destinations
          </h3>

          <p className="text-4xl font-bold">
            {stats.destinations}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
