import { z } from "zod";

export const addTeamSchema = z.object({
  teamName: z
    .string({
      required_error: "Team name is required",
    })
    .min(3, { message: "Must be more than 2 characters" }),
  points: z.preprocess(
    (value) => {
      const parsedValue = parseInt(z.string().parse(value), 10);
      return isNaN(parsedValue) ? undefined : parsedValue;
    },
    z
      .number({
        required_error: "Required field",
        invalid_type_error: "Invalid number",
      })
      .nonnegative("Must be a non-negative number")
  ),
});

export const betSchema = z.object({
  bet: z.preprocess(
    (value) => {
      const parsedValue = parseFloat(z.string().parse(value));
      return isNaN(parsedValue) ? undefined : parsedValue;
    },
    z
      .number({
        required_error: "Required field",
        invalid_type_error: "Invalid number",
      })
      .nonnegative("Must be a non-negative number")
  ),
});
