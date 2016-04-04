
export class Blog {}
export class Post {}

const blog = new Blog();
blog.id = '1';

const posts = [];


export function getBlog() { return blog; }
export function getPosts() { return posts; }

export function getCommentsFor(post_id) {
  return posts.filter(post => post.parent === post_id);
}

export function createPost({parent, text, tags}) {
  var newPost = {
    parent, text, tags
  }
  posts.push(newPost)
}

export function editPost(postId, {text, tags}) {
  const post = posts.find(postId)
  post.text = text
  post.tags = tags
  return post
}