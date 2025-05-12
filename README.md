# Task List API
This project is a simple Task List GraphQL API. It's written in Typescript and Node, and harnesses Apollo Server, Pothos as the resolver-schema builder, and Prisma as the database client. You can create tasks, mark them as completed, search for them by the task's title, and delete them (as well as getting all tasks or getting a task by its ID). 

## Running Locally
This project requires npm version 18.18.
Create an `.env` file with
```
DATABASE_URL="file:./dev.db"
```
Then run `npx prisma migrate dev` to create a local dev.db database. This enables you to run the project entirely locally.

To compile the project into a build, run `npm i && npm run build` to install node modules, generate the project's Prisma dependencies, and compile the typescript.

Finally run `npm start` to deploy the server. You should see something like:
 `🚀  Server started on: http://localhost:4000/graphql` , which means you're ready to go!

## Example Calls
Get All Tasks (no search)
```
curl --location 'http://localhost:4000/graphql' \
--header 'content-type: application/json' \
--data '{"query":"query GetTasks($search: String) {\n tasks(search: $search) {\n id\n title\n completed\n createdAt\n updatedAt\n }\n}","variables":{}}'
```

Get All Tasks (search specified)
```
curl --location 'http://localhost:4000/graphql' \
--header 'Content-Type: application/json' \
--data '{"query":"query GetTasks($search: String) {\n    tasks(search: $search) {\n        id\n        title\n        completed\n        createdAt\n        updatedAt\n    }\n}","variables":{"search":"pet"}}'
```

Get Task By Id
```
curl --location 'http://localhost:4000/graphql' \
--header 'Content-Type: application/json' \
--data '{"query":"query GetTaskById($id: ID!) {\n    task(id: $id) {\n        id\n        title\n        completed\n        createdAt\n        updatedAt\n    }\n}","variables":{"id":"cmakcracs0000ttapttwt4y9x"}}'
```

Add a Task
```
curl --location 'http://localhost:4000/graphql' \
--header 'Content-Type: application/json' \
--data '{"query":"mutation CreateTask($newTitle: String!) {\n    addTask(title: $newTitle) {\n        id\n        title\n        completed\n        createdAt\n        updatedAt\n    }\n}","variables":{"newTitle":"Pet Dog"}}'
```

Toggle a Task
```
curl --location 'http://localhost:4000/graphql' \
--header 'Content-Type: application/json' \
--data '{"query":"mutation ToggleTask($id: ID!) {\n    toggleTask(id: $id) {\n        id\n        title\n        completed\n        createdAt\n        updatedAt\n    }\n}","variables":{"id":"cmakcracs0000ttapttwt4y9x"}}'
```

Delete a Task
```
curl --location 'http://localhost:4000/graphql' \
--header 'Content-Type: application/json' \
--data '{"query":"mutation DeleteTask($id: ID!) {\n    deleteTask(id: $id) {\n        id\n        title\n        completed\n        createdAt\n        updatedAt\n    }\n}","variables":{"id":"cmakcracs0000ttapttwt4y9x"}}'
```

## Discussion
I am pretty unfamiliar to Apollo server and Pothos but from what I've learned, the benefit of using a tool like Pothos is that it is resolver-first, meaning your schema is defined programmatically and in conjunction with the resolvers that support it. While this can discourage designing a system with Schema definition as the first step, it gives a lot more flexibility to evolve your API as your needs change over time. It is also much more developer-friendly, as the schema definition code and resolver code can reside right next to each other. 

## Growth opportunities
- **Zod Validation**: There is a [zod-pothos plugin](https://pothos-graphql.dev/docs/plugins/zod) that validates input arguments. I would use this to better safeguard my API and provide better error messaging to the caller. For operations that require a title as the input, like the create operation or search-by-title operation, I would validate that the title is not too long (100 characters seems enough). For all operations that accept an input argument (string or ID), I would verify that all characters are alpha-numeric, as I've used the pothos-prisma default for IDs.
- **Better Error Handling**: At present, all errors look like GraphQL errors, not reasonable API errors, and the stack trace gets returned in the response, which I find unnecessary. I think I might do something like including various errors in the return type of queries or mutations. Instead of returning a Task, I would return a TaskResponse type, which includes an `errors` array. I think this would allow for easier integration, as the error schema could be known ahead of time. However, I truthfully don't know a lot of best practices on error-handling in GraphQL, so I'd love to learn.
- **Search functionality**: The spec specifically stated: "optional search argument which filters tasks on the title by the search term provided" which I was unsure meant "get all tasks then filter by title" or "get tasks that have this title". I was also unsure if the title had to match exactly - I am of the opinion that it should not have to match exactly as searching for "dog" should bring up your "Adopt dog" task, but this does have the drawback of searching for "p" and getting the "Adopt dog" task.
- **Provide Prisma as context to the Apollo server**: Apollo standalone server accepts a `context` argument where you can pass in authentication, data sources, or other APIs that your resolvers can have shared access to. The context function is both asynchronous and gets called for every request, so in the context I could establish a new database connection and wait for it to be live. This seems a bit wasteful on memory resources and somewhat slow but I think it would make the API strongly-consistent, as opposed to eventually-consistent and fast.
- **Unit Tests**: I would write unit tests. In typescript/node projects I often prefer vitest as I find it easier to read and write. I might also write integration tests; in another node project I would write a pretty simple script to fetch the endpoints in a flow and see that they all work together.