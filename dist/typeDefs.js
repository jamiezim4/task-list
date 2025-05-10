export const typeDefs = `#graphql
  scalar Date

  type Task {
    id: ID
    title: String
    completed: Boolean
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    tasks(search: String): [Task]!
    task(id: ID!): Task
  }

  type Mutation {
    addTask(title: String): Task
    toggleTask(id: ID!): Task
    deleteTask(id: ID!): Task
  }
`;
