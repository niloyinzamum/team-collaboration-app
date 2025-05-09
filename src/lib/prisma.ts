import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();

if (process.env.NODE_END !== "production") {
  globalThis.prisma = prismadb;
}

export const prisma = prismadb;