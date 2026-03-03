import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const userIdArg = v.union(v.literal('husband'), v.literal('wife'))

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('excuseEvents')
      .withIndex('by_timestamp')
      .order('desc')
      .collect()
  },
})

export const listByUser = query({
  args: {
    userId: userIdArg,
    since: v.optional(v.number()),
  },
  handler: async (ctx, { userId, since }) => {
    const results = await ctx.db
      .query('excuseEvents')
      .withIndex('by_userId_timestamp', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()
    if (since !== undefined) {
      return results.filter((e) => e.timestamp >= since)
    }
    return results
  },
})

export const getById = query({
  args: { id: v.id('excuseEvents') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

export const create = mutation({
  args: {
    timestamp: v.number(),
    context: v.string(),
    excuse: v.string(),
    customNote: v.optional(v.string()),
    suggestedAction: v.string(),
    userId: userIdArg,
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('excuseEvents', {
      ...args,
      status: undefined,
    })
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('excuseEvents'),
    status: v.string(),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status })
  },
})

export const deleteEvent = mutation({
  args: {
    id: v.id('excuseEvents'),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})
