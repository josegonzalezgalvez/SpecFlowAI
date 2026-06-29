import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    projects: {
      total: 180,
      active: 111,
      blocked: 20,
      completed: 55,
    },
    users: {
      active: 7,
      interactionsToday: 43,
    },
    aiUsage: {
      tokensConsumed: 254321,
      estimatedCostUsd: 42.31,
    },
  });
}