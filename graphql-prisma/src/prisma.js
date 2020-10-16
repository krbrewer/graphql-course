import { Prisma } from 'prisma-binding'

import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements,
})

export { prisma as default }

// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({ id: authorId })

//     if (!userExists) throw new Error('User not found')

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ author { id name email posts { id title published } } }')

//     return post.author
// }

// // createPostForUser('cjz7uk5cm00710880mx4d8p62', {
// //     title: 'Joes Cool Post',
// //     body: 'Yeah boi',
// //     published: true
// // })
// // .then(user => console.log(JSON.stringify(user, undefined, 2)))
// // .catch(console.log)

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({
//         id: postId
//     })

//     if (!postExists) throw new Error('Post not found')

//     const post = await prisma.mutation.updatePost({
//         data,
//         where: {
//             id: postId
//         }
//     }, '{ author { id name email posts { id title published } } }')

//     return post.author
// }

// // updatePostForUser('cjzg4ij9500d70880f52gski2', { title: 'NEW POST SON!' })
// // .then(user => console.log(JSON.stringify(user, undefined, 2)))
// // .catch(console.log)
