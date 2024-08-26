import * as z from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    department: z.string().min(1, {
      message: "Department is required",
    }),
    matricno: z.string().nullable().optional(),
    password: z
      .string()
      .min(6, {
        message: "Minimum of 6 characters required",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase, one lowercase, one number, and one special character",
        }
      ),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine(
    (data) => {
      if (data.confirmPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.password && !data.confirmPassword) {
        return false;
      }

      return true;
    },
    {
      message: "You need to confirm your password!",
      path: ["confirmPassword"],
    }
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const UpdatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, {
        message: "Minimum of 6 characters required",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase, one lowercase, one number, and one special character",
        }
      ),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine(
    (data) => {
      if (data.confirmPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.password && !data.confirmPassword) {
        return false;
      }

      return true;
    },
    {
      message: "You need to confirm your password!",
      path: ["confirmPassword"],
    }
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const AvailabilitySchema = z.object({
  slots: z.array(
    z.object({
      day: z.enum([
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]),
      startTime: z.string().regex(/^\d{2}:\d{2}$/), // Validate time format HH:MM
      endTime: z.string().regex(/^\d{2}:\d{2}$/), // Validate time format HH:MM
    })
  ),
});

export const BookingSchema = z.object({
  date: z.string().refine(
    (date) => {
      const bookingDate = new Date(date);
      const currentDate = new Date();
      // Calculate the difference in milliseconds between the booking date and the current date
      const timeDiff = bookingDate.getTime() - currentDate.getTime();

      // Convert the difference from milliseconds to hours
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      return hoursDiff >= 24;
    },
    {
      message: "You must book at least a day in advance",
    }
  ),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, {
    message: "Invalid start time format, must be HH:MM",
  }),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, {
    message: "Invalid end time format, must be HH:MM",
  }),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  department: z.string().min(1, "Department is required"),
  matricNo: z.string().optional(), // Only for students
});
