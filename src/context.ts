import { PrismaClient } from '../generated/prisma/index.js';

export interface ContextValue {
    prismaClient: PrismaClient;
}