import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import { prisma } from './db.js';
import { DateTimeResolver } from 'graphql-scalars';
export const builder = new SchemaBuilder({
    plugins: [PrismaPlugin],
    prisma: {
        client: prisma,
    },
});
// This will create an empty Query {} and Mutation{} type in our SDL 
// schema. 
builder.queryType({});
builder.mutationType({});
builder.addScalarType('DateTime', DateTimeResolver, {});
