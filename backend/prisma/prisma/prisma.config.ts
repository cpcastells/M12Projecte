import { PrismaConfig } from "@prisma/client";

const config: PrismaConfig = {
  adapter: process.env.DATABASE_URL,
};

export default config;
