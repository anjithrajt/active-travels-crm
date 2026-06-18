import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/notifications"
      );

      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Notifications
      </h2>

      <div className="bg-white p-4 rounded shadow">
        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="border-b py-3"
            >
              <h3 className="font-bold">
                {item.title}
              </h3>

              <p>{item.message}</p>

              <small>
                {new Date(
                  item.created_at
                ).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
