import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Blog = {
  __typename?: 'Blog';
  handle: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  posts: Array<Post>;
  postsRemaining?: Maybe<Scalars['Int']>;
};

export type BlogCreatePostInput = {
  content: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type CreateBlogInput = {
  handle: Scalars['String'];
  name: Scalars['String'];
  posts?: InputMaybe<Array<BlogCreatePostInput>>;
};

export type CreatePostInput = {
  blogHandle: Scalars['String'];
  content: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBlog?: Maybe<Blog>;
  createPost?: Maybe<Post>;
};

export type MutationCreateBlogArgs = {
  input: CreateBlogInput;
};

export type MutationCreatePostArgs = {
  input: CreatePostInput;
};

export type Post = {
  __typename?: 'Post';
  blog: Blog;
  content: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  blog?: Maybe<Blog>;
};

export type QueryBlogArgs = {
  handle: Scalars['String'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Blog: ResolverTypeWrapper<Blog>;
  BlogCreatePostInput: BlogCreatePostInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateBlogInput: CreateBlogInput;
  CreatePostInput: CreatePostInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Blog: Blog;
  BlogCreatePostInput: BlogCreatePostInput;
  Boolean: Scalars['Boolean'];
  CreateBlogInput: CreateBlogInput;
  CreatePostInput: CreatePostInput;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Post: Post;
  Query: {};
  String: Scalars['String'];
};

export type BlogResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Blog'] = ResolversParentTypes['Blog'],
> = {
  handle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  postsRemaining?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  createBlog?: Resolver<
    Maybe<ResolversTypes['Blog']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateBlogArgs, 'input'>
  >;
  createPost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreatePostArgs, 'input'>
  >;
};

export type PostResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post'],
> = {
  blog?: Resolver<ResolversTypes['Blog'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  blog?: Resolver<Maybe<ResolversTypes['Blog']>, ParentType, ContextType, RequireFields<QueryBlogArgs, 'handle'>>;
};

export type Resolvers<ContextType = any> = {
  Blog?: BlogResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};
