import { Prisma, PrismaClient } from '@prisma/client';
import { CreateBlogInput } from '../generated/resolvers-types';

export const BlogModel = {
  blogExists: async (handle: string, prisma: PrismaClient) => {
    const blog = await prisma.blog.findUnique({
      where: {
        handle: handle,
      },
    });
    return Boolean(blog?.id);
  },

  findBlogByHandle: async (handle: string, prisma: PrismaClient) => {
    return await prisma.blog.findUnique({
      where: {
        handle: handle,
      },
      include: {
        posts: true,
      },
    });
  },

  createBlog: async (input: CreateBlogInput, prisma: PrismaClient) => {
    const blogToCreate: Prisma.BlogCreateInput = {
      name: input.name,
      handle: input.handle,
    };
    if (input.posts) {
      blogToCreate['posts'] = {
        createMany: {
          data: input.posts.map((post) => ({
            title: post.title,
            content: post.content,
          })),
        },
      };
    }

    const created = await prisma.blog.create({
      data: blogToCreate,
      include: {
        posts: true,
      },
    });
    return created;
  },
};
