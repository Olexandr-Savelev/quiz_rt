import { z } from "zod";

export const addTeamSchema = z.object({
  teamName: z.string().min(3),
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
