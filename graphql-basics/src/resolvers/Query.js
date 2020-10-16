const Query = {
  users(parent, args, {db}, info) {
    if (!args.query) return db.users
    return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
  },
  posts(parent, args, {db}, info) {
    const {query} = args
    if (!query) return db.posts
    return db.posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase()))
  },
  comments(parent, args, {db}, info) {
    return db.comments
  },
  me() {
    return {
      id: '123098',
      name: 'Mike',
      email: 'mike@cool.wow'
    }
  },
  post() {
    return {
      id: '11111',
      title: 'How to be cool',
      body: 'Nothing personal, kid.',
      published: true
    }
  }
}

export {Query as default}