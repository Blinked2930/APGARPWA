import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    recordedTimeZone: v.optional(v.string()),
    deliveryStartTime: v.number(),
    bodyOutTimes: v.array(v.number()),
    apgar1MinParams: v.optional(v.any()),
    apgar5MinParams: v.optional(v.any()),
    milestones: v.optional(v.any()) // <-- ADDED THIS LINE
  })
});