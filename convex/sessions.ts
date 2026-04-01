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
