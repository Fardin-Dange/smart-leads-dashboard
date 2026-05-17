import dotenv from "dotenv";

dotenv.config();

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? "5000");

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
};

const parseCorsOrigins = (value: string | undefined): string | string[] => {
  if (!value || value === "*") {
    return "*";
  }

  const origins = value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 1) {
    const [origin] = origins;
    return origin ?? "*";
  }

  return origins.length > 0 ? origins : "*";
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT),
  mongoUri: getRequiredEnv("MONGO_URI"),
  corsOrigin: parseCorsOrigins(process.env.CORS_ORIGIN),
  jwtSecret: getRequiredEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d"
} as const;
