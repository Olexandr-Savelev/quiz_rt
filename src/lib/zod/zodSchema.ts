import { z } from "zod";

export const addTeamSchema = z.object({
  teamName: z
    .string({
      required_error: "Team name is required",
    })
    .min(3, { message: "Must be more than 2 characters" }),
  points: z.coerce
    .number({
      required_error: "Required field",
      invalid_type_error: "Invalid number",
    })
    .positive("Must be a positive number"),
  bet: z.coerce.number().nonnegative("Must be non-negative number").optional(),
});

export const betSchema = z.object({
  bet: z.coerce
    .number({
      required_error: "Required field",
      invalid_type_error: "Invalid number",
    })
    .positive("Must be a positive number"),
});
