import { ApolloError, UserInputError } from 'apollo-server-errors';
import { FREE_POST_LIMIT } from '../config';
import { Blog, MutationCreateBlogArgs, MutationCreatePostArgs, QueryBlogArgs } from '../generated/resolvers-types';
import { Context } from '../index';
import { BlogModel } from '../models/blog.model';
import { PostModel } from '../models/post.model';
import { freeTierPostsExceeded } from './libs';

export const resolvers = {
  Query: {
    blog: async (parent, { handle }: QueryBlogArgs, context: Context) => {
      try {
        return await BlogModel.findBlogByHandle(handle, context.prisma);
      } catch (err) {
        console.error('blog Error: ', err);
        throw new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    },
  },

  Mutation: {
    createBlog: async (parent, { input }: MutationCreateBlogArgs, context: Context) => {
      if (input.posts && input.posts.length > FREE_POST_LIMIT) {
        throw new UserInputError('The free tier allows a maximum of 5 posts per blog.');
      }

      const blogExists = await BlogModel.blogExists(input.handle, context.prisma);
      if (blogExists) {
        throw new UserInputError(`The selected handle '${input.handle}' is not available`);
      }

      try {
        return await BlogModel.createBlog(input, context.prisma);
      } catch (err) {
        console.error('createBlog Error: ', err);
        throw new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    },

    createPost: async (parent, { input }: MutationCreatePostArgs, context: Context) => {
      const blogExists = await BlogModel.blogExists(input.blogHandle, context.prisma);
      if (!blogExists) {
        throw new UserInputError(`blogHandle '${input.blogHandle}' does not exist`);
      }

      if (await freeTierPostsExceeded(input.blogHandle, context.prisma)) {
        throw new UserInputError('The free tier allows a maximum of 5 posts per blog.');
      }

      try {
        return await PostModel.createPost(input, context.prisma);
      } catch (err) {
        console.error('createPost Error: ', err);
        throw new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    },
  },
  Blog: {
    postsRemaining: async (parent: Blog, args, context: Context) => {
      try {
        const postCount = await PostModel.getPostCount(parent.handle, context.prisma);
        return FREE_POST_LIMIT - postCount;
      } catch (err) {
        console.error('blog Error: ', err);
        throw new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    },
  },
};
