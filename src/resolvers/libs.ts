import { PrismaClient } from '@prisma/client';
import { FREE_POST_LIMIT } from '../config';
import { PostModel } from '../models/post.model';

/**
 * Determines is a blog has exceeded it's free tier post limit.
 */
export const freeTierPostsExceeded = async (blogHandle: string, prisma: PrismaClient) => {
  const postCount = await PostModel.getPostCount(blogHandle, prisma);
  if (postCount >= FREE_POST_LIMIT) {
    return true;
  }
  return false;
};
