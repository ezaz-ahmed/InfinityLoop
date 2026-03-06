import { z } from "zod";

const envSchema = z.object({
  APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  NODE_ENV: z.enum(["development", "production"]).optional(),
  PORT: z.coerce.number().default(8080),
  FRONTEND_URL: z.string().url(),
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  REDIS_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:");
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();
