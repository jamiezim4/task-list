import { builder } from './builder.js';
import { prisma } from './db.js';
const Task = builder.prismaObject('Task', {
    fields: (t) => ({
        id: t.exposeID('id'),
        title: t.exposeString('title'),
        completed: t.exposeBoolean('completed'),
        createdAt: t.expose('createdAt', { type: 'DateTime' }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    }),
});
builder.queryField('tasks', (t) => t.field({
    type: [Task],
    args: {
        search: t.arg.string(),
    },
    resolve: async (_parent, args, ctx) => {
        const tasks = await prisma.task.findMany({
            where: {
                title: {
                    contains: args.search || '',
                },
            },
        });
        return tasks.map(task => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        }));
    },
}));
builder.queryField('task', (t) => t.field({
    type: Task,
    args: {
        id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
        const task = await prisma.task.findUnique({
            where: {
                id: args.id,
            },
        });
        if (!task) {
            return null;
        }
        return task;
    },
}));
/*
builder.queryFields((t) => ({
    task: t.prismaField({
      type: 'Task',
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, root, args, ctx, info) => {
        const task = await prisma.task.findUnique({
            where: {
              id: args.id,
            },
          });
          if (!task) {
            return null;
          }
          return task;
      },
    }),
  }))
*/
builder.mutationField('addTask', (t) => t.field({
    type: Task,
    args: {
        title: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, _ctx) => {
        const task = await prisma.task.create({
            data: {
                title: args.title,
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
        return task;
    }
}));
builder.mutationField('toggleTask', (t) => t.field({
    type: Task,
    args: {
        id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, _ctx) => {
        const task = await prisma.task.findUnique({
            where: {
                id: args.id,
            },
        });
        if (!task) {
            return null;
        }
        const status = task.completed;
        const toggledTask = await prisma.task.update({
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
}));
builder.mutationField('deleteTask', (t) => t.field({
    type: Task,
    args: {
        id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, _ctx) => {
        const deletedTask = await prisma.task.delete({
            where: {
                id: args.id,
            },
        });
        return deletedTask;
    },
}));
