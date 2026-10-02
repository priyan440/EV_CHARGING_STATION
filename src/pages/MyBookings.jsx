import { useState } from "react";
import BookingCard from "../components/BookingCard";

function MyBookings() {

  const [search, setSearch] = useState("");

  const bookings = [

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

  const filteredBookings =
    bookings.filter((booking) =>
      booking.bookingId
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <div className="page">

      <h1>
        📅 My Bookings
      </h1>

      <input
        className="search-input"
        placeholder="Search Booking ID..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div>

        {filteredBookings.length === 0 ? (

          <p>
            No bookings found.
          </p>

        ) : (

          filteredBookings.map((booking) => (

            <BookingCard
              key={booking.bookingId}
              booking={booking}
            />

          ))

        )}

      </div>

    </div>

  );
}

export default MyBookings;