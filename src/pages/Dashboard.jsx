import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import BookingCard from "../components/BookingCard";

function Dashboard() {

  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);

  useEffect(() => {

    const demoBookings = [

      {
        bookingId: "BK000001",
        station: "Chennai EV Station",
        vehicle: "TN 58 AB 1234",
        chargingType: "DC Fast",
        date: "2026-08-10",
        duration: 1,
        status: "Confirmed"
      },

      {
        bookingId: "BK000002",
        station: "Kovilpatti Charging Hub",
        vehicle: "TN 58 AB 1234",
        chargingType: "AC",
        date: "2026-08-12",
        duration: 2,
        status: "Completed"
      }

    ];

    setBookings(demoBookings);

  }, []);

  return (
    <div className="dashboard">

      <div className="welcome">

        <h1>
          Good Morning, {user?.name}! ⚡
        </h1>

        <p>
          Manage your EV charging activities from here.
        </p>

      </div>

      <div className="stats">

        <div className="stat-card">
          <span>📅</span>
          <h2>{bookings.length}</h2>
          <p>Total Bookings</p>
        </div>

        <div className="stat-card">
          <span>⚡</span>
          <h2>2</h2>
          <p>Active Sessions</p>
        </div>

        <div className="stat-card">
          <span>🔋</span>
          <h2>84</h2>
          <p>Energy Used (kWh)</p>
        </div>

        <div className="stat-card">
          <span>💰</span>
          <h2>₹1,240</h2>
          <p>Total Spent</p>
        </div>

      </div>

      <div className="dashboard-section">

        <h2>
          Upcoming Charging
        </h2>

        {bookings
          .filter(
            (booking) =>
              booking.status === "Confirmed"
          )
          .map((booking) => (

            <BookingCard
              key={booking.bookingId}
              booking={booking}
            />

          ))}

      </div>

    </div>
  );
}

export default Dashboard;