import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  type Blog {
    id: ID
    name: String!
    handle: String!
    posts: [Post!]!
    postsRemaining: Int
  }

  type Post {
    id: ID
    title: String
    content: String!
    blog: Blog!
  }

  input CreateBlogInput {
    name: String!
    handle: String!
    posts: [BlogCreatePostInput!]
  }

  input BlogCreatePostInput {
    title: String
    content: String!
  }

  input CreatePostInput {
    title: String
    content: String!
    blogHandle: String!
  }

  type Mutation {
    createBlog(input: CreateBlogInput!): Blog
    createPost(input: CreatePostInput!): Post
  }

  type Query {
    blog(handle: String!): Blog
  }
`;
