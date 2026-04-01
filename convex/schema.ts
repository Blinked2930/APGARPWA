import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    deliveryStartTime: v.number(),
    bodyOutTimes: v.array(v.number()),
    apgar1MinParams: v.union(
      v.object({
        scores: v.object({
          activity: v.number(),
          appearance: v.number(),
          grimace: v.number(),
          pulse: v.number(),
          respiration: v.number()
        }),
        timeCompleted: v.number(),
        total: v.number()
      }),
      v.null()
    ),
    apgar5MinParams: v.union(
      v.object({
        scores: v.object({
          activity: v.number(),
          appearance: v.number(),
          grimace: v.number(),
          pulse: v.number(),
          respiration: v.number()
        }),
        timeCompleted: v.number(),
        total: v.number()
      }),
      v.null()
    )
  })
});
