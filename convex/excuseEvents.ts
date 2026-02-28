import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

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

export const create = mutation({
  args: {
    timestamp: v.number(),
    context: v.string(),
    excuse: v.string(),
    customNote: v.optional(v.string()),
    suggestedAction: v.string(),
    userId: v.optional(v.string()),
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
