import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-lambda';
import { NODE_ENV } from './config';
import { resolvers } from './resolvers/resolvers';
import { typeDefs } from './typedefs/typedefs';

export type Context = {
  prisma: PrismaClient;
};

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  context: (): Context => ({
    prisma,
  }),
  introspection: NODE_ENV === 'dev',
});

exports.handler = server.createHandler();
