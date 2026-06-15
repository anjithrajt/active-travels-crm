import { useEffect, useState } from "react";
import axios from "axios";

function FlightBookings() {
  const [bookings, setBookings] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    airline: "",
    pnr: "",
    departure_city: "",
    arrival_city: "",
    travel_date: "",
    fare: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/flight-bookings"
      );

      setBookings(res.data);
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
        "http://localhost:5000/flight-bookings",
        formData
      );

      setFormData({
        customer_id: "",
        airline: "",
        pnr: "",
        departure_city: "",
        arrival_city: "",
        travel_date: "",
        fare: "",
      });

      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/flight-bookings/${id}/status`,
        { status }
      );

      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Flight Bookings
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-4 gap-4 mb-6"
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
          name="airline"
          placeholder="Airline"
          value={formData.airline}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="pnr"
          placeholder="PNR"
          value={formData.pnr}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="departure_city"
          placeholder="Departure"
          value={formData.departure_city}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="arrival_city"
          placeholder="Arrival"
          value={formData.arrival_city}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="travel_date"
          value={formData.travel_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="fare"
          placeholder="Fare"
          value={formData.fare}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Add Booking
        </button>
      </form>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Airline</th>
              <th className="p-2 text-left">PNR</th>
              <th className="p-2 text-left">Route</th>
              <th className="p-2 text-left">Fare</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="p-2">
                  {booking.name}
                </td>

                <td className="p-2">
                  {booking.airline}
                </td>

                <td className="p-2">
                  {booking.pnr}
                </td>

                <td className="p-2">
                  {booking.departure_city}
                  {" → "}
                  {booking.arrival_city}
                </td>

                <td className="p-2">
                  ₹{booking.fare}
                </td>

                <td className="p-2">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      updateStatus(
                        booking.id,
                        e.target.value
                      )
                    }
                    className="border p-1 rounded"
                  >
                    <option>Reserved</option>
                    <option>Ticketed</option>
                    <option>Travelled</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FlightBookings;
