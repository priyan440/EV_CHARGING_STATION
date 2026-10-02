function BookingCard({ booking }) {
  return (
    <div className="booking-card">

      <div className="booking-header">

        <h3>
          {booking.bookingId}
        </h3>

        <span className="status">
          {booking.status}
        </span>

      </div>

      <div className="booking-details">

        <p>
          <strong>Station:</strong>{" "}
          {booking.station}
        </p>

        <p>
          <strong>Vehicle:</strong>{" "}
          {booking.vehicle}
        </p>

        <p>
          <strong>Charging:</strong>{" "}
          {booking.chargingType}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {booking.date}
        </p>

        <p>
          <strong>Duration:</strong>{" "}
          {booking.duration} hours
        </p>

      </div>

    </div>
  );
}

export default BookingCard;