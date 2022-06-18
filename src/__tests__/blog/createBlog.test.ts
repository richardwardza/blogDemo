import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';
import { FREE_POST_LIMIT } from '../../config';
import { queryApi } from '../helpers/api';
import { createBlog, getBlog } from '../helpers/blog';
import { createPostObject } from '../helpers/post';
import { randomString } from '../helpers/random';

const CREATE_BLOG_MUTATION = `
mutation createBlog($input: CreateBlogInput!) {
  createBlog(input: $input) {
    name
    handle
    postsRemaining
    posts {
      title
      content
    }
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
      const blogToCreate = {};
      const response = await queryApi(CREATE_BLOG_MUTATION, blogToCreate);
      expect(response.errors[0].message).toContain(
        'Variable "$input" of required type "CreateBlogInput!" was not provided',
      );
    });

    it('requires required blog "handle" Field', async () => {
      const blogToCreate = {
        input: {
          name: randomString(10),
        },
      };
      const response = await queryApi(CREATE_BLOG_MUTATION, blogToCreate);
      expect(response.errors[0].message).toContain('Field "handle" of required type "String!" was not provided.');
    });

    it('requires Fields to be the correct type', async () => {
      const blogToCreate = {
        input: {
          name: randomString(10),
          handle: randomInt(10000),
        },
      };
      const response = await queryApi(CREATE_BLOG_MUTATION, blogToCreate);
      expect(response.errors[0].message).toContain('String cannot represent a non string value');
    });

    it('requires all post required Fields', async () => {
      const blogToCreate = {
        input: {
          name: randomString(10),
          handle: randomString(10),
          posts: [
            {
              title: randomString(10),
            },
          ],
        },
      };
      const response = await queryApi(CREATE_BLOG_MUTATION, blogToCreate);
      expect(response.errors[0].message).toContain('Field "content" of required type "String!" was not provided.');
    });

    it(`cannot exceed free limit of ${FREE_POST_LIMIT} posts per blog`, async () => {
      const overLimit = FREE_POST_LIMIT + 1;

      const blogToCreate = {
        input: {
          name: randomString(10),
          handle: randomString(10),
          posts: Array.from(Array(overLimit).keys()).map(() => createPostObject()),
        },
      };
      const response = await queryApi(CREATE_BLOG_MUTATION, blogToCreate);
      expect(response.errors[0].message).toContain('The free tier allows a maximum of 5 posts per blog.');
    });

    it('handle already exists', async () => {
      const existingBlog = await createBlog(prisma);

      const blogToCreate = {
        input: {
          name: randomString(10),
          handle: existingBlog.handle,
        },
      };
      const response = await queryApi(CREATE_BLOG_MUTATION, blogToCreate);
      expect(response.errors[0].message).toContain(`The selected handle '${existingBlog.handle}' is not available`);
    });
  });

  describe('success', () => {
    it('will create a blog without posts', async () => {
      const blogToCreate = {
        input: {
          name: randomString(10),
          handle: randomString(10),
        },
      };

      const response = await queryApi(CREATE_BLOG_MUTATION, blogToCreate);
      expect(response.data.createBlog).toEqual(expect.objectContaining(blogToCreate.input));

      const dbRecord = await getBlog(prisma, blogToCreate.input.handle);
      expect(dbRecord).toMatchObject(blogToCreate.input);
      expect(dbRecord?.posts).toHaveLength(0);
    });

    it('will create a blog with posts', async () => {
      const blogToCreate = {
        input: {
          name: randomString(10),
          handle: randomString(10),
          posts: [
            {
              title: randomString(10),
              content: randomString(10),
            },
          ],
        },
      };

      const response = await queryApi(CREATE_BLOG_MUTATION, blogToCreate);
      expect(response.data.createBlog).toEqual(expect.objectContaining(blogToCreate.input));

      const dbRecord = await getBlog(prisma, blogToCreate.input.handle);
      expect(dbRecord).toMatchObject(blogToCreate.input);
      expect(response.data.createBlog.postsRemaining).toEqual(FREE_POST_LIMIT - blogToCreate.input.posts.length);
    });
  });
});
