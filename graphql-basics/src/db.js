let users = [{
    id: '1',
    name: 'Kevin',
    email: 'kbrewer@mvpindex.com',
    age: 28
  }, {
    id: '2',
    name: 'Jen',
    email: 'Jen@gf.com'
  }, {
    id: '3',
    name: 'Birdie',
    email: 'birdiebuns@cool.com'
  }]
  
  // Demo Post Data
  let posts = [{
    id: '10',
    title: 'My First Blog Post',
    body: 'Today I started blogging.',
    published: true,
    author: '1'
  }, {
    id: '20',
    title: 'My Second Blog Post',
    body: 'I can\'t believe I\'m still doing this.',
    published: true,
    author: '1'
  }, {
    id: '30',
    title: 'I Got Bored',
    body: '',
    published: false,
    author: '2'
  }]
  
  // Demo Comment Data
  let comments = [{
    id: '100',
    text: 'woah dude',
    author: '3',
    post: '10'
  }, {
    id: '200',
    text: 'extremmmmmeeee!',
    author: '3',
    post: '20'
  }, {
    id: '300',
    text: 'ew bye',
    author: '3',
    post: '30'
  }, {
    id: '400',
    text: 'noice',
    author: '3',
    post: '10'
  }]

  const db = {
    users,
    posts,
    comments,
  }

  export { db as default }