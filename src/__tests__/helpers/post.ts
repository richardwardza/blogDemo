import { BlogCreatePostInput } from '../../generated/resolvers-types';
import { randomString } from './random';

export const createPostObject = (partialPost?: Partial<BlogCreatePostInput>): BlogCreatePostInput => {
  return {
    title: randomString(15),
    content: randomString(15),
    ...partialPost,
  };
};
