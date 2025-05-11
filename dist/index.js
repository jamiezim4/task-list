import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { prisma } from './db.js';
import { schema } from './schema.js';
// const server = new ApolloServer<ContextValue>({
//   typeDefs,
//   resolvers,
// });
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async () => {
//     return {
//       prismaClient: prisma,
//     };
//   },
// });
//console.log(`🚀  Server ready at: ${url}graphql`);
const server = new ApolloServer({
    schema,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => {
        return {
            prismaClient: prisma,
        };
    }
});
console.log(`🚀  Server started on: ${url}graphql`);
