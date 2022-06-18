import { Prisma, PrismaClient } from '@prisma/client';
import { randomString } from './random';

export const getBlog = async (prisma: PrismaClient, handle: string) => {
  return await prisma.blog.findUnique({ where: { handle: handle }, include: { posts: true } });
};

export const createBlogObject = (partialBlog?: Partial<Prisma.BlogCreateInput>): Prisma.BlogCreateInput => {
  return {
    name: randomString(15),
    handle: randomString(15),
    ...partialBlog,
  };
};

export const createBlog = async (prisma: PrismaClient, partialBlog?: Partial<Prisma.BlogCreateInput>) => {
  const blogObject = createBlogObject(partialBlog);

  return await prisma.blog.create({ data: blogObject });
};

export const createBlogWithPosts = async (prisma: PrismaClient, partialBlog?: Partial<Prisma.BlogCreateInput>) => {
  const blogObject = createBlogObject(partialBlog);

  return await prisma.blog.create({ data: blogObject, include: { posts: true } });
};
