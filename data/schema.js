
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
  User,
  Post,
  me,
  getPost, posts,
  getCommentsFor,
  createPost, editPost,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId)
    if (type === 'User') {
      return me
    } else if (type === 'Post') {
      return getPost(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Post) {
      return postType;
    } else if (obj instanceof User) {
      return userType;
    } else {
      return null;
    }
  }
);

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'Registered user',
  fields: () => ({
    id: globalIdField('User'),
    email: {type: GraphQLString},
    name: {type: GraphQLString},
  }),
  interfaces: [nodeInterface],
});

var postType = new GraphQLObjectType({
  name: 'Post',
  description: 'A post',
  fields: () => ({
    id: globalIdField('Post'),
    post_id: {
      type: GraphQLInt,
      resolve: (post) => {
        return post.id
      }
    },
    parent: {type: GraphQLInt},
    title: {type: GraphQLString},
    text: {type: GraphQLString},
    author: {
      type: userType,
      description: 'The post author',
      resolve: () => me,
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
    },
  }),
  interfaces: [nodeInterface],
});


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    getPost: {
      description: 'Query posts',
      args: {
        id: {type: GraphQLInt},
      },
      type: postType,
      resolve: (root, {id}) => {
        return getPost(id)
      }
    },
    allPosts: {
      description: 'All posts',
      type: new GraphQLList(postType),
      resolve: () => posts,
    },
    node: nodeField,
  }),
});


const AddPostMutation = mutationWithClientMutationId({
  name: 'AddPost',
  inputFields: {
    parent_id: {type: new GraphQLNonNull(GraphQLInt) },
    title: {type: new GraphQLNonNull(GraphQLString) },
    text: {type: new GraphQLNonNull(GraphQLString) },
    tags: {type: new GraphQLList(GraphQLString)}
  },
  outputFields: {
    post: {
      type: postType,
    },
  },
  mutateAndGetPayload: ({parent_id, text, title, tags}) => {
    let created = createPost({parent: parent_id, text, title, tags})
    let parent = getPost(parent_id)
    return {post: parent}
  },
});

const EditPostMutation = mutationWithClientMutationId({
  name: 'EditPost',
  inputFields: {
    post_id: {type: new GraphQLNonNull(GraphQLInt)},
    title: {type: new GraphQLNonNull(GraphQLString) },
    text: {type: new GraphQLNonNull(GraphQLString) },
    tags: {type: new GraphQLList(GraphQLString)}
  },
  outputFields: {
    post: {
      type: postType,
      resolve: ({post}) => post,
    },
  },
  mutateAndGetPayload: ({post_id, text, title, tags}) => {
    let post = editPost(post_id, {text, title, tags});
    return {post};
  },
});


const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addPost: AddPostMutation,
    editPost: EditPostMutation,
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