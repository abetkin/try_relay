
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Blog,
  Post,
  getBlog,
  getPosts,
  getCommentsFor,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Blog') {
      return getBlog(id);
    } else if (type === 'Post') {
      return getPost(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Post) {
      return postType;
    } else if (obj instanceof Blog) {
      return blogType;
    } else {
      return null;
    }
  }
);

var blogType = new GraphQLObjectType({
  name: 'Blog',
  description: 'The blog everybody should have a post in',
  fields: () => ({
    id: globalIdField('Blog'),
    posts: {
      type: postConnection,
      description: 'Posts',
      args: connectionArgs,
      resolve: (blog, args) => connectionFromArray(getPosts(), args),
    },
  }),
  interfaces: [nodeInterface],
});

// todo test
var userType = new GraphQLObjectType({
  name: 'User',
  description: 'Registered user',
  fields: () => ({
    id: globalIdField('User'),
    email: {type: GraphQLString},
  }),
  interfaces: [nodeInterface],
});

var postType = new GraphQLObjectType({
  name: 'Post',
  description: 'A post',
  fields: () => ({
    id: globalIdField('Post'),
    author: {
      type: userType,
      description: 'The post author',
    },
    comments: {
      type: new GraphQLList(postType),
      description: 'Posted comments',
      resolve: (post) => {
        return getCommentsFor(post.id)
      },
      
    },
    tags: {
      type: new GraphQLList(GraphQLString),
      description: 'Tags',
      resolve: (post) => {
        return post.tags // is it necessary ?
      }, 
    },
  }),
  interfaces: [nodeInterface],
});

var {connectionType: postConnection} =
  connectionDefinitions({name: 'Post', nodeType: postType});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    blog: {
      type: blogType,
      resolve: () => getBlog(),
    },
  }),
});


const AddPostMutation = mutationWithClientMutationId({
  name: 'AddPost',
  inputFields: {
    parent_id: {type: new GraphQLNonNull(GraphQLID) },
    text: {type: new GraphQLNonNull(GraphQLString) },
    tags: {type: new GraphQLList(GraphQLString)}
  },
  outputFields: {
    post: {
      type: postType,
      resolve: ({post}) => post,
    },
  },
  mutateAndGetPayload: ({parent_id, text, tags}) => {
    const parentId = fromGlobalId(parent_id).id;
    post = createPost({parentId, text, tags});
    return {post};
  },
});

const EditPostMutation = mutationWithClientMutationId({
  name: 'EditPost',
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    text: {type: new GraphQLNonNull(GraphQLString) },
    tags: {type: new GraphQLList(GraphQLString)}
  },
  outputFields: {
    post: {
      type: postType,
      resolve: ({post}) => post,
    },
    // parent: {
    //   type: postType,
    //   resolve: () => getPost(post.parent),
    // },
  },
  mutateAndGetPayload: ({id, text, tags}) => {
    const postId = fromGlobalId(id).id;
    post = editPost(postId, {text, tags});
    return {post};
  },
});


const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addPost: AddPostMutation,
  }),
});


export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});



/*
Post, Blog

posts view: Blog { posts(...) }
  add/remove/edit my post
 


*/