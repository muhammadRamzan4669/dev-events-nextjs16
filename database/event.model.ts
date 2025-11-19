import mongoose, { CallbackError, Document, Schema } from "mongoose";

/**
 * TypeScript interface for Event document
 * Defines the structure and types for Event data
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event Mongoose Schema
 * Handles event data with automatic slug generation and date normalization
 */
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    overview: {
      type: String,
      required: [true, "Event overview is required"],
      trim: true,
      maxlength: [500, "Overview cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Event image URL is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    mode: {
      type: String,
      required: [true, "Event mode is required"],
      enum: ["online", "offline", "hybrid"],
      lowercase: true,
    },
    audience: {
      type: String,
      required: [true, "Event audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Event agenda is required"],
      validate: {
        validator: (agenda: string[]) => agenda.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Event organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Event tags are required"],
      validate: {
        validator: (tags: string[]) => tags.length > 0,
        message: "Tags must contain at least one item",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false,
  },
);

/**
 * Pre-save hook for slug generation and data normalization
 * Runs before document is saved to database
 */
EventSchema.pre<IEvent>("save", function (next) {
  try {
    // Generate slug only if title is modified or document is new
    if (this.isModified("title") || this.isNew) {
      this.slug = generateSlug(this.title);
    }

    // Normalize and validate date format (convert to ISO format)
    if (this.isModified("date") || this.isNew) {
      this.date = normalizeDate(this.date);
    }

    // Normalize time format (ensure consistent HH:MM format)
    if (this.isModified("time") || this.isNew) {
      this.time = normalizeTime(this.time);
    }

    // Validate required arrays are not empty
    if (this.agenda.length === 0) {
      throw new Error("Agenda cannot be empty");
    }
    if (this.tags.length === 0) {
      throw new Error("Tags cannot be empty");
    }

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

/**
 * Generate URL-friendly slug from title
 * Converts title to lowercase, replaces spaces with hyphens, removes special characters
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Normalize date to ISO format (YYYY-MM-DD)
 * Accepts various date formats and converts to consistent ISO format
 */
function normalizeDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date format. Please use a valid date.");
  }
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
}

/**
 * Normalize time to consistent HH:MM format
 * Accepts various time formats and converts to 24-hour format
 */
function normalizeTime(timeString: string): string {
  // Remove extra spaces and convert to lowercase
  const cleanTime = timeString.trim().toLowerCase();

  // Handle 12-hour format with AM/PM
  if (cleanTime.includes("am") || cleanTime.includes("pm")) {
    const [timePart, period] = cleanTime.split(/\s*(am|pm)\s*/);
    let [hours, minutes] = timePart.split(":").map((num) => parseInt(num, 10));

    // if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    //   throw new Error(
    //     "Invalid time format. Please use HH:MM or HH:MM AM/PM format.",
    //   );
    // }

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 1 ||
      hours > 12 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new Error(
        "Invalid time format. Please use HH:MM or HH:MM AM/PM format.",
      );
    }

    // Convert to 24-hour format
    if (period === "pm" && hours !== 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  // Handle 24-hour format
  const [hours, minutes] = cleanTime.split(":").map((num) => parseInt(num, 10));
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(
      "Invalid time format. Please use HH:MM or HH:MM AM/PM format.",
    );
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

// Add unique index for slug
EventSchema.index({ slug: 1 }, { unique: true });

// Create and export the Event model
const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
