import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSessions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sessions").order("desc").collect();
  },
});

// Relaxed args so "In Progress" and skipped saves never get blocked
export const saveSession = mutation({
  args: {
    recordedTimeZone: v.optional(v.any()),
    deliveryStartTime: v.number(),
    bodyOutTimes: v.array(v.number()),
    apgar1MinParams: v.optional(v.any()),
    apgar5MinParams: v.optional(v.any()),
    milestones: v.optional(v.any()) // <-- ADDED THIS LINE
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", args);
  },
});

export const deleteAllSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }
  },
});

export const deleteSession = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateSession = mutation({
  args: {
    id: v.id("sessions"),
    deliveryStartTime: v.optional(v.number()),
    bodyOutTimes: v.optional(v.array(v.number())),
    apgar1MinParams: v.optional(v.any()),
    apgar5MinParams: v.optional(v.any()),
    milestones: v.optional(v.any()) // <-- ADDED THIS LINE
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Clean out any explicitly undefined fields to satisfy Convex patch rules
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    await ctx.db.patch(id, updates);
  },
});