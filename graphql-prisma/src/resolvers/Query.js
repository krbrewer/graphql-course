import getUserId from '../utils/getUserId'

const Query = {
  users(parent, { after, first, skip, query, orderBy }, { prisma }, info) {
    const opArgs = {
      after,
      first,
      skip,
      orderBy,
    }

    if (query) {
      opArgs.where = {
        OR: [
          {
            email_contains: query,
          },
        ],
      }
    }

    return prisma.query.users(opArgs, info)
  },
  posts(parent, { after, first, skip, query, orderBy }, { prisma }, info) {
    const opArgs = {
      where: {
        published: true,
      },
      after,
      first,
      skip,
      orderBy,
    }

    if (query) {
      opArgs.where.OR = [
        {
          title_contains: query,
        },
        {
          body_contains: query,
        },
      ]
    }

    return prisma.query.posts(opArgs, info)
  },
  myPosts(parent, { after, first, skip, query, orderBy }, { prisma, request }, info) {
    const userId = getUserId(request)

    const opArgs = {
      where: {
        author: {
          id: userId,
        },
      },
      after,
      first,
      skip,
      orderBy,
    }

    if (query) {
      opArgs.where.OR = [
        {
          title_contains: query,
        },
        {
          body_contains: query,
        },
      ]
    }

    return prisma.query.posts(opArgs, info)
  },
  comments(parent, { after, first, skip, orderBy }, { prisma }, info) {
    const opArgs = {
      after,
      first,
      skip,
      orderBy,
    }
    return prisma.query.comments(opArgs, info)
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.query.user({
      where: {
        id: userId,
      },
    })
  },
  async post(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request, false)

    const posts = await prisma.query.posts({
      where: {
        id: id,
        OR: [
          {
            published: true,
          },
          {
            author: {
              id: userId,
            },
          },
        ],
      },
    })

    if (posts.length === 0) throw new Error('Post not found')

    return posts[0]
  },
}

export { Query as default }
