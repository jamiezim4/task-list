import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { prisma } from './db.js';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => {
        return {
            prismaClient: prisma,
        };
    },
});
console.log(`🚀  Server ready at: ${url}graphql`);
