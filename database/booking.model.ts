import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import Event from './event.model';

/**
 * TypeScript interface for Booking document
 * Defines the structure and types for Booking data
 */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking Mongoose Schema
 * Handles event bookings with email validation and event reference verification
 */
const BookingSchema = new Schema<IBooking>({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
    index: true // Index for faster queries on eventId
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email: string): boolean {
        // Email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: 'Please provide a valid email address'
    }
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false
});

/**
 * Pre-save hook for event reference validation
 * Verifies that the referenced event exists before saving booking
 */
BookingSchema.pre<IBooking>('save', async function(next) {
  try {
    // Skip validation if eventId hasn't changed and document is not new
    if (!this.isModified('eventId') && !this.isNew) {
      return next();
    }

    // Verify that the referenced event exists
    const eventExists = await Event.findById(this.eventId);
    if (!eventExists) {
      throw new Error(`Event with ID ${this.eventId} does not exist`);
    }

    // Additional validation: ensure email format is correct
    if (this.isModified('email') || this.isNew) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        throw new Error('Invalid email format');
      }
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

/**
 * Compound index for optimized queries
 * Ensures unique bookings and allows efficient lookups by event and email combination
 */
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });


/**
 * Static method to get all bookings for a specific event
 * Provides a convenient way to fetch event-related bookings
 */
BookingSchema.statics.findByEventId = function(eventId: string | mongoose.Types.ObjectId) {
  return this.find({ eventId }).populate('eventId', 'title date venue');
};

/**
 * Static method to check if user has already booked an event
 * Prevents duplicate bookings for the same event and email
 */
BookingSchema.statics.hasUserBooked = async function(
  eventId: string | mongoose.Types.ObjectId, 
  email: string
): Promise<boolean> {
  const booking = await this.findOne({ eventId, email: email.toLowerCase() });
  return !!booking;
};

// Create and export the Booking model
const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
