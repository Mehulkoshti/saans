import { z } from "zod";

export const lifestyleInputSchema = z.object({
  cityQuery: z
    .string()
    .trim()
    .min(2, "Enter a city name with at least 2 characters.")
    .max(100, "City name is too long.")
    .regex(/^[\p{L}\p{N}\s,.'-]+$/u, "City name contains unsupported characters."),
  household: z.object({
    adults: z.number().int().min(0).max(20),
    children: z.number().int().min(0).max(20),
    elderly: z.number().int().min(0).max(20),
    hasRespiratoryCondition: z.boolean(),
    hasPregnantMember: z.boolean(),
  }),
  commute: z.enum([
    "walk_cycle",
    "two_wheeler",
    "car_solo",
    "car_pool",
    "public_transport",
    "work_from_home",
  ]),
  outdoorHoursPerDay: z.number().min(0).max(24),
  hasAirPurifier: z.boolean(),
  activityLevel: z.enum(["sedentary", "moderate", "active"]),
});

export type LifestyleInputParsed = z.infer<typeof lifestyleInputSchema>;
