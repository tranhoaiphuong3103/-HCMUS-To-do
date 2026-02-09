import { PrismaClient } from "@/app/generated/prisma/client";

const prismaClientSingleton = () => {
  const accelerateUrl = process.env.PRISMA_DATABASE_URL;

  if (!accelerateUrl) {
    throw new Error('PRISMA_DATABASE_URL is required');
  }

  return new PrismaClient({
    accelerateUrl
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
