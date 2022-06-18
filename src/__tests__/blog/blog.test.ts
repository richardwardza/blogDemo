import { PrismaClient } from '@prisma/client';
import { FREE_POST_LIMIT } from '../../config';
import { queryApi } from '../helpers/api';
import { createBlog, createBlogWithPosts } from '../helpers/blog';
import { createPostObject } from '../helpers/post';
import { randomInt, randomString } from '../helpers/random';

const BLOG_QUERY = `
query Blog($handle: String!) {
  blog(handle: $handle) {
    id
    name
    handle
    postsRemaining
  }
}
`;

const BLOG_QUERY_WITH_POSTS = `
query Blog($handle: String!) {
  blog(handle: $handle) {
    id
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

describe('blog', () => {
  describe('fail', () => {
    it('blog "handle" not provded', async () => {
      const blogToRetreve = {};
      const response = await queryApi(BLOG_QUERY, blogToRetreve);
      expect(response.errors[0].message).toContain('Variable "$handle" of required type "String!" was not provided.');
    });

    it('invalid handle type provided', async () => {
      const blogToRetreve = { handle: randomInt() };
      const response = await queryApi(BLOG_QUERY, blogToRetreve);
      expect(response.errors[0].message).toContain('String cannot represent a non string value');
    });
  });
  describe('success', () => {
    it('returns null when handle does not exist', async () => {
      const blogToRetreve = { handle: randomString(15) };
      const response = await queryApi(BLOG_QUERY, blogToRetreve);
      expect(response.data.blog).toBeNull();
    });

    it('returns the requested blog without posts', async () => {
      const existingBlog = await createBlog(prisma);

      const blogToRetreve = { handle: existingBlog.handle };

      const response = await queryApi(BLOG_QUERY, blogToRetreve);
      expect(response.data.blog).toMatchObject(existingBlog);
      expect(response.data.blog.posts).toBeUndefined();
    });

    it('returns the requested blog with posts', async () => {
      const postsToCreate = 3;
      const posts = Array.from(Array(postsToCreate).keys()).map(() => createPostObject());
      const existingBlog = await createBlogWithPosts(prisma, {
        posts: {
          createMany: {
            data: posts,
          },
        },
      });
      const blogToRetreve = { handle: existingBlog.handle };

      const response = await queryApi(BLOG_QUERY_WITH_POSTS, blogToRetreve);

      expect(response.data.blog).toMatchObject({
        ...existingBlog,
        posts: existingBlog.posts.map((post) => ({
          title: post.title,
          content: post.content,
        })),
      });
      expect(response.data.blog.postsRemaining).toEqual(FREE_POST_LIMIT - postsToCreate);
    });
  });
});
