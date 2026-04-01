import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSessions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sessions").order("desc").collect();
  },
});

export const saveSession = mutation({
  args: {
    recordedTimeZone: v.union(v.string(), v.null(), v.optional(v.string())),
    deliveryStartTime: v.number(),
    bodyOutTimes: v.array(v.number()),
    apgar1MinParams: v.union(
      v.object({
        skipped: v.optional(v.boolean()),
        inProgress: v.optional(v.boolean()),
        scores: v.optional(v.object({
          activity: v.optional(v.number()),
          appearance: v.optional(v.number()),
          grimace: v.optional(v.number()),
          pulse: v.optional(v.number()),
          respiration: v.optional(v.number())
        })),
        timeCompleted: v.number(),
        total: v.optional(v.number())
      }),
      v.null()
    ),
    apgar5MinParams: v.union(
      v.object({
        skipped: v.optional(v.boolean()),
        inProgress: v.optional(v.boolean()),
        scores: v.optional(v.object({
          activity: v.optional(v.number()),
          appearance: v.optional(v.number()),
          grimace: v.optional(v.number()),
          pulse: v.optional(v.number()),
          respiration: v.optional(v.number())
        })),
        timeCompleted: v.number(),
        total: v.optional(v.number())
      }),
      v.null()
    )
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

// NEW: Allows editing a session inline from the History Tab without duplicating it
export const updateSession = mutation({
  args: {
    id: v.id("sessions"),
    interval: v.number(),
    data: v.any() // Accepts the updated score block
  },
  handler: async (ctx, args) => {
    const updateObj = args.interval === 1
      ? { apgar1MinParams: args.data }
      : { apgar5MinParams: args.data };
    await ctx.db.patch(args.id, updateObj);
  },
});