import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    deliveryStartTime: v.number(),
    bodyOutTimes: v.array(v.number()),
    apgar1MinParams: v.union(
      v.object({
        skipped: v.optional(v.boolean()),
        scores: v.optional(v.object({
          activity: v.number(),
          appearance: v.number(),
          grimace: v.number(),
          pulse: v.number(),
          respiration: v.number()
        })),
        timeCompleted: v.number(),
        total: v.optional(v.number())
      }),
      v.null()
    ),
    apgar5MinParams: v.union(
      v.object({
        skipped: v.optional(v.boolean()),
        scores: v.optional(v.object({
          activity: v.number(),
          appearance: v.number(),
          grimace: v.number(),
          pulse: v.number(),
          respiration: v.number()
        })),
        timeCompleted: v.number(),
        total: v.optional(v.number())
      }),
      v.null()
    )
  })
});
