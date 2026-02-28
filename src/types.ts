import type { Id } from '../convex/_generated/dataModel'

// Matches the Convex schema shape. The full generated type is available after
// running `npx convex dev` (from convex/_generated/dataModel).
export interface ExcuseEvent {
  _id: Id<'excuseEvents'>
  _creationTime: number
  timestamp: number
  context: string
  excuse: string
  customNote?: string
  suggestedAction: string
  status?: string
  userId?: string
}
