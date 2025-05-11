import { GraphQLScalarType, Kind } from 'graphql';
const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        if (value instanceof Date) {
            return value.getTime(); // Convert outgoing Date to integer for JSON
        }
        throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
        if (typeof value === 'number') {
            return new Date(value); // Convert incoming integer to Date
        }
        throw new Error('GraphQL Date Scalar parser expected a `number`');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            // Convert hard-coded AST string to integer and then to Date
            return new Date(parseInt(ast.value, 10));
        }
        // Invalid hard-coded value (not an integer)
        return null;
    },
});
export const resolvers = {
    Date: dateScalar,
    Query: {
        tasks: async (_parent, args, contextValue) => {
            const search = (args.search || '').trim();
            const tasks = await contextValue.prismaClient.task.findMany({
                where: {
                    title: {
                        contains: search
                    },
                },
            });
            return tasks;
        },
        task: async (_parent, args, contextValue) => {
            const task = await contextValue.prismaClient.task.findUnique({
                where: {
                    id: args.id,
                },
            });
            if (!task) {
                throw new Error(`Task with id ${args.id} not found`);
            }
            return task;
        }
    },
    Mutation: {
        addTask: async (_parent, args, contextValue) => {
            const newTask = await contextValue.prismaClient.task.create({
                data: {
                    title: args.title,
                    completed: false,
                    createdAt: new Date()
                }
            });
            return newTask;
        },
        toggleTask: async (_parent, args, contextValue) => {
            const task = await contextValue.prismaClient.task.findUnique({
                where: {
                    id: args.id,
                },
            });
            const status = task?.completed;
            const toggledTask = await contextValue.prismaClient.task.update({
                where: {
                    id: args.id,
                },
                data: {
                    completed: !status,
                    updatedAt: new Date(),
                },
            });
            return toggledTask;
        },
        deleteTask: async (_parent, args, contextValue) => {
            const deletedTask = await contextValue.prismaClient.task.delete({
                where: {
                    id: args.id,
                },
            });
            return deletedTask;
        }
    }
};
