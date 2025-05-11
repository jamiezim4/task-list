import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { prisma } from './db.js';
import { DateTimeResolver } from 'graphql-scalars'


interface BuilderType {
    Scalars: {
        DateTime: {
            Input: Date
            Output: Date
        }
    }
    PrismaTypes: PrismaTypes
}

export const builder = new SchemaBuilder<BuilderType>({
      plugins: [PrismaPlugin],
      prisma: {
        client: prisma,
      },
    });

builder.queryType({})
builder.mutationType({})
builder.addScalarType('DateTime', DateTimeResolver, {})
