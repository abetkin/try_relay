
export class User {}
export class Post {}

export const me = new User();
me.id = '1'
me.email = 'abvit89@gmail.com'
me.name = 'vitalik'

const blog = new Post()
blog.id = 1
blog.title = 'Blog'
blog.text = `
  Any posts are welcome
`
blog.tags = ['root', 'moderated']
blog.comments = []

export const posts = [blog]

export function getCommentsFor(post_id) {
  return posts.filter(post => post.parent === post_id)
}

export function getPost(id) {
  let ret = posts.find(post => post.id === id)
  return ret
}

export function createPost({parent, text, tags, title}) {
  let newPost = {
    parent, text, tags, title,
    id: blog.id + posts.length,
  }
  console.log('new post', newPost)
  posts.push(newPost)
  return newPost
}

export function editPost(postId, {title, text, tags}) {
  const post = getPost(postId)
  post.title = title
  post.text = text
  post.tags = tags
  return post
}