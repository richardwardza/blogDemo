# bloggy-platform

This is a simple example to store and retrieve blogs and their related posts. 
There is no functionlity to remove blogs or posts.


## Getting Started

For the development environment, copy the `.env.sample` file to `.env` and ensure the variables are set correctly - specifically the `DATABASE_URL`.Once completed the following should get you up and running:

```bash
npm install
npm run push
npm run dev
```

In the `dev` environment, the `introspection` endpoint is available at [http://localhost:3000/dev/graphql](http://localhost:3000/dev/graphql)

If you require a local database then a `docker-compose.yml` file has been set up to run postgres. If you have docker installed then it be started using the following:

```bash
docker-compose up
```

The connection string to use in your `.env` file is then:

```bash
DATABASE_URL="postgresql://bloggy:bloggy@localhost:5432/bloggy?schema=public"
```

## Tests

The test unit tests can be run using:

```bash
npm run test:unit
```

The integration tests should only be used in a `dev` or `test` environment where the database can be easily dropped and re-created as it does "pollute" the database quite a bit. The tests can be run using:

```bash
npm run test:integration
```

## Deployment

If you have your AWS environment setup correctly ( as per the `Serverless Framework` ) then deployment can be done by using:

```bash
npm run deploy
```

# Overview

## Post Limits

The free tier is limited to 5 posts per blog.This has currently been implemented in a very basic manner so as to allow an easy evolution into a "paid plans" model.

There are currently insufficient details regarding the "paid plans" to create a better solution.

## API Endpoint overview

The following endpoints exist:

| Endpoint   | Type     | Summary                                              |
| ---------- | -------- | ---------------------------------------------------- |
| blog       | Query    | Returns the selected blog and it's related posts     |
| createBlog | Mutation | Creates a blog and any optionally included posts     |
| createPost | Mutation | Creates a post and associates it to an existing blog |

## Interaction

The [Postman](https://www.postman.com/) collection in `bloggy.postman_collection.json` can be imported into postman and used to interact with the api.

The cURL command below can also be used from the command line:

### createBlog

```bash
curl --location --request POST 'http://localhost:3000/dev/graphql' \--header 'Content-Type: application/json' \--data-raw '{"query":"mutation createBlog($input: CreateBlogInput!) {\n createBlog(input: $input) {\n name\n handle\n posts {\n title\n content\n }\n }\n}","variables":{"input":{"name":"The Best of Times","handle":"BestTimesBlog","posts":[{"title":"The Beginning","content":"In the beginning...."}]}}}'
```

### createPost

```bash
curl --location --request POST 'http://localhost:3000/dev/graphql' \--header 'Content-Type: application/json' \--data-raw '{"query":"mutation createPost($input: CreatePostInput!) {\n createPost(input: $input) {\n title\n content\n }\n}","variables":{"input":{"title":"The Middle Times","content":"After the start and before the end was the middle...","blogHandle":"BestTimesBlog"}}}'
```

### blog

```bash
curl --location --request POST 'http://localhost:3000/dev/graphql' \--header 'Content-Type: application/json' \--data-raw '{"query":"query Blog($handle: String!) {\n blog(handle: $handle) {\n name\n handle\n postsRemaining\n posts {\n title\n content\n }\n }\n}","variables":{"handle":"BestTimesBlog"}}'
```

