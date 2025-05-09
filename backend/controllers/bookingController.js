const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Property = require("../Models/propertyModel");
const Booking = require("../Models/bookingModel");
const moment = require("moment");

// Create a Stripe checkout session (Payment Intent)
exports.getCheckOutSession = async (req, res, next) => {
  const {
    amount,
    currency,
    paymentMethodTypes,
    propertyName
  } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses smallest currency unit (e.g., cents)
      currency: currency || "inr",
      payment_method_types: paymentMethodTypes,
      description: "Payment for testing",
      metadata: {
        propertyName: JSON.stringify(propertyName)
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

// Create a booking for a property
exports.createBookings = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("Please login First");
    }

    const {
      property,
      price,
      guests,
      fromDate,
      toDate
    } = req.body;

    const startDate = moment(fromDate);
    const endDate = moment(toDate);
    const numberOfNights = endDate.diff(startDate, 'days');

    const propertyDoc = await Property.findById(property);

    const isAlreadyBooked = propertyDoc.currentBookings.some(booking => {
      return (
        (booking.fromDate <= new Date(fromDate) && new Date(fromDate) <= booking.toDate) ||
        (booking.fromDate <= new Date(toDate) && new Date(toDate) <= booking.toDate)
      );
    });

    if (isAlreadyBooked) {
      return res.status(400).json({
        status: 'fail',
        message: "The property is already booked for the requested dates."
      });
    }

    const newBooking = await Booking.create({
      property,
      price,
      guests,
      fromDate,
      toDate,
      numberOfnights: numberOfNights,
      user: req.user._id
    });

    const updatedProperty = await Property.findByIdAndUpdate(
      property,
      {
        $push: {
          currentBookings: {
            bookingId: newBooking.id,
            fromDate,
            toDate,
            userId: newBooking.user
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        booking: newBooking,
        updatedProperty
      }
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: err.message
    });
  }
};

// Get bookings for the current user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });

    res.status(200).json({
      status: "success",
      data: {
        bookings
      }
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Get details of a single booking by ID
exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    res.status(200).json({
      status: "success",
      data: {
        bookings: booking
      }
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};
