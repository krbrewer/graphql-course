import uuidv4 from "uuid/v4"

const Mutation = {
    createUser(parent, args, {db}, info) {
      const emailTaken = db.users.some(user => user.email === args.user.email)

      if (emailTaken) throw new Error('Email taken.')

      const user = {
        id: uuidv4(),
        ...args.user
      }

      db.users.push(user)

      return user
    },
    updateUser(parent, {id, data}, {db}, info) {
      const user = db.users.find(user => user.id === id)

      if (!user) throw new Error('User not found.')

      if (typeof data.email === 'string') {
        const emailTaken = db.users.some(user => user.email === data.email)

        if (emailTaken) throw new Error('Email taken.')

        user.email = data.email
      }

      if (typeof data.name === 'string') user.name = data.name
      
      if (typeof data.age !== 'undefined') user.age = data.age
      
      return user
    },
    deleteUser(parent, args, {db}, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id)

      if (userIndex === -1) throw new Error('User not found.')

      const deletedUsers = db.users.splice(userIndex, 1)

      db.posts = db.posts.filter(post => {
        const match = post.author === args.id

        if (match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id)
        }

        return !match
      })

      db.comments = db.comments.filter(comment => comment.author !== args.id)

      return deletedUsers[0]
    },
    createPost(parent, args, {db, pubSub}, info) {
      const userExists = db.users.some(user => user.id === args.post.author)

      if (!userExists) throw new Error('User not found.')

      const post = {
        id: uuidv4(),
        ...args.post
      }

      db.posts.push(post)
      if (post.published) pubSub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })

      return post
    },
    updatePost(parent, {id, data}, {db, pubSub}, info) {
      const post = db.posts.find(post => post.id === id)
      const originalPost = {...post}

      if (!post) throw new Error('Post not found.')

      if (typeof data.title === 'string') post.title = data.title
      if (typeof data.body === 'string') post.body = data.body
      if (typeof data.published === 'boolean') {
        post.published = data.published

        if (originalPost.published && !post.published) {
          pubSub.publish('post', {
            post: {
              mutation: 'DELETED',
              data: originalPost
            }
          })
        } else if (!originalPost.published && post.published) {
          // created
          pubSub.publish('post', {
            post: {
              mutation: 'CREATED',
              data: post
            }
          })
        }
      } else if (post.published) {
        pubSub.publish('post', {
          post: {
            mutation: 'UPDATED',
            data: post
          }
        })
      }

      return post
    },
    deletePost(parent, args, {db, pubSub}, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.id)

      if (postIndex === -1) throw new Error('Post not found.')

      const [post] = db.posts.splice(postIndex, 1)

      db.comments = db.comments.filter(comment => comment.post !== args.id)

      if (post.published) {
        pubSub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: post
          }
        })
      }

      return post
    },
    createComment(parent, args, {db, pubSub}, info) {
      const userExists = db.users.some(user => user.id === args.comment.author)
      const postExists = db.posts.some(post => post.id === args.comment.post && post.published)

      if (!userExists) throw new Error("User not found.")
      if (!postExists) throw new Error("Post not found.")

      const comment = {
        id: uuidv4(),
        ...args.comment
      }

      db.comments.push(comment)
      pubSub.publish(`comment ${args.comment.post}`, {
        comment: {
          mutation: 'CREATED',
          data: comment
        }
      })

      return comment
    },
    updateComment(parent, {id, data}, {db, pubSub}, info) {
      const comment = db.comments.find(comment => comment.id === id)

      if (!comment) throw new Error('Comment not found.')

      if (typeof data.text === 'string') {
        comment.text = data.text
        pubSub.publish(`comment ${comment.post}`, {
          comment: {
            mutation: 'UPDATED',
            data: comment
          }
        })
      }

      return comment
    },
    deleteComment(parent, args, {db, pubSub}, info) {
      const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

      if (commentIndex === -1) throw new Error('Comment not found.')

      const [comment] = db.comments.splice(commentIndex, 1)

      pubSub.publish(`comment ${comment.post}`, {
        comment: {
          mutation: 'DELETED',
          data: comment
        }
      })

      return comment
    }
  }

export {Mutation as default}