import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';
import { FREE_POST_LIMIT } from '../../config';
import { queryApi } from '../helpers/api';
import { createBlogWithPosts, getBlog } from '../helpers/blog';
import { createPostObject } from '../helpers/post';
import { randomString } from '../helpers/random';

const CREATE_POST_MUTATION = `
mutation createPost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    content
  }
}
`;

let prisma: PrismaClient;
beforeAll(() => {
  prisma = new PrismaClient();
});

afterAll(() => {
  prisma.$disconnect();
});

describe('createBlog', () => {
  describe('fail', () => {
    it('inputs not provded', async () => {
      const postToCreate = {};
      const response = await queryApi(CREATE_POST_MUTATION, postToCreate);
      expect(response.errors[0].message).toContain(
        'Variable "$input" of required type "CreatePostInput!" was not provided',
      );
    });

    it('requires "blogHandle" Field', async () => {
      const postToCreate = {
        input: {
          content: randomString(10),
        },
      };
      const response = await queryApi(CREATE_POST_MUTATION, postToCreate);
      expect(response.errors[0].message).toContain('Field "blogHandle" of required type "String!" was not provided.');
    });

    it('requires Fields to be the correct type', async () => {
      const postToCreate = {
        input: {
          content: randomString(10),
          blogHandle: randomInt(10000),
        },
      };
      const response = await queryApi(CREATE_POST_MUTATION, postToCreate);
      expect(response.errors[0].message).toContain('String cannot represent a non string value');
    });

    it(`cannot exceed free limit of ${FREE_POST_LIMIT} posts per blog`, async () => {
      const postsToCreate = 5;
      const posts = Array.from(Array(postsToCreate).keys()).map(() => createPostObject());
      const existingBlog = await createBlogWithPosts(prisma, {
        posts: {
          createMany: {
            data: posts,
          },
        },
      });

      const postToCreate = {
        input: {
          content: randomString(10),
          blogHandle: existingBlog.handle,
        },
      };
      const response = await queryApi(CREATE_POST_MUTATION, postToCreate);
      expect(response.errors[0].message).toContain('The free tier allows a maximum of 5 posts per blog.');
    });

    it('handle does not exists', async () => {
      const blogHandle = randomString(10);
      const postToCreate = {
        input: {
          content: randomString(10),
          blogHandle: blogHandle,
        },
      };
      const response = await queryApi(CREATE_POST_MUTATION, postToCreate);
      expect(response.errors[0].message).toContain(`blogHandle '${blogHandle}' does not exist`);
    });
  });

  describe('success', () => {
    it('will add a post to a blog', async () => {
      const postsToCreate = 2;
      const posts = Array.from(Array(postsToCreate).keys()).map(() => createPostObject());
      const existingBlog = await createBlogWithPosts(prisma, {
        posts: {
          createMany: {
            data: posts,
          },
        },
      });

      const postToCreate = {
        input: {
          content: randomString(10),
          blogHandle: existingBlog.handle,
        },
      };

      const response = await queryApi(CREATE_POST_MUTATION, postToCreate);
      expect(response.data.createPost.content).toEqual(postToCreate.input.content);

      const dbRecord = await getBlog(prisma, postToCreate.input.blogHandle);
      expect(dbRecord?.posts.length).toEqual(postsToCreate + 1);
      expect(dbRecord?.posts[dbRecord?.posts.length - 1].content).toEqual(postToCreate.input.content);
    });
  });
});
