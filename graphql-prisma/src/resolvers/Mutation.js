import bcrypt from 'bcryptjs'

import generateToken from '../utils/generateToken'
import getUserId from '../utils/getUserId'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password)
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    })

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    })

    if (!user) throw new Error('Unable to login.')

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) throw new Error('Unable to login.')

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof data.password === 'string') data.password = await hashPassword(data.password)

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data,
      },
      info,
    )
  },
  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info,
    )
  },
  createPost(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.createPost(
      {
        data: {
          title: data.title,
          body: data.body,
          published: data.published,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info,
    )
  },
  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId,
      },
    })
    const isPublished = await prisma.exists.Post({ id, published: true })

    if (!postExists) throw new Error('Unable to update post')

    if (isPublished && !data.published)
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id,
          },
        },
      })

    return prisma.mutation.updatePost(
      {
        where: {
          id,
        },
        data,
      },
      info,
    )
  },
  async deletePost(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId,
      },
    })

    if (!postExists) throw new Error('Unable to delete post')

    return prisma.mutation.deletePost(
      {
        where: {
          id,
        },
      },
      info,
    )
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const isPublished = await prisma.exists.Post({
      id: args.data.post,
      published: true,
    })

    if (isPublished) throw new Error('Unable to find post')

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info,
    )
  },
  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId,
      },
    })

    if (!commentExists) throw new Error('Unable to update comment')

    return prisma.mutation.updateComment(
      {
        where: {
          id,
        },
        data,
      },
      info,
    )
  },
  async deleteComment(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId,
      },
    })

    if (!commentExists) throw new Error('Unable to delete comment')

    return prisma.mutation.deleteComment(
      {
        where: {
          id,
        },
      },
      info,
    )
  },
}

export { Mutation as default }
