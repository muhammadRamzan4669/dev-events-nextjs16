/**
 * Database Models Export Index
 * 
 * Centralized export file for all Mongoose models
 * Allows importing models from a single location throughout the application
 * 
 * Usage:
 * import { Event, Booking } from '@/database';
 * // or
 * import { Event } from '@/database';
 * import { Booking } from '@/database';
 */

// Import models
import Event from './event.model';
import Booking from './booking.model';

// Import TypeScript interfaces
import type { IEvent } from './event.model';
import type { IBooking } from './booking.model';

// Export models for use throughout the application
export { Event, Booking };

// Export TypeScript interfaces for type safety
export type { IEvent, IBooking };

// Default export object containing all models
export default {
  Event,
  Booking
};