import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  excuseEvents: defineTable({
    timestamp: v.number(),
    context: v.string(),
    excuse: v.string(),
    customNote: v.optional(v.string()),
    suggestedAction: v.string(),
    status: v.optional(v.string()),
    userId: v.optional(v.string()),
  }).index('by_timestamp', ['timestamp']),
})
