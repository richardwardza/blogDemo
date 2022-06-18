import { Prisma, PrismaClient } from '@prisma/client';
import { CreatePostInput } from '../generated/resolvers-types';

export const PostModel = {
  getPostCount: async (blogHandle: string, prisma: PrismaClient) => {
    const count = await prisma.blog.findUnique({
      where: { handle: blogHandle },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    return count?._count.posts || 0;
  },

  createPost: async (input: CreatePostInput, prisma: PrismaClient) => {
    const postToCreate: Prisma.PostCreateInput = {
      ...(input.title && { title: input.title }),
      content: input.content,
      blog: {
        connect: {
          handle: input.blogHandle,
        },
      },
    };
    return await prisma.post.create({
      data: postToCreate,
    });
  },
};
