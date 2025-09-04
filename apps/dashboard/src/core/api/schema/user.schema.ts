"use client";

import { z } from "zod";

const userSchema = z.object({
  email: z.email(),
  username: z.string().min(3).max(50),
  hashedPassword: z.string(),
  status: z.boolean(),
  // teams:,
});
