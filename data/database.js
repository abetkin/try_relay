
export class User {}
export class Post {}

export const me = new User();
me.id = '1';

const blog = new Post()
blog.id = 0
blog.title = 'Blog'
blog.text = `
  Any posts are welcome
`
blog.tags = ['root', 'moderated']
blog.comments = []

const posts = []

export function getCommentsFor(post_id) {
  return posts.filter(post => post.parent === post_id)
}

export function getPost(id) {
  return posts.find(post => post.id === id)
}

export function createPost({parent, text, tags, title}) {
  var newPost = {
    parent, text, tags, title
  }
  posts.push(newPost)
}

export function editPost(postId, {title, text, tags}) {
  const post = getPost(postId)
  post.title = title
  post.text = text
  post.tags = tags
  return post
}