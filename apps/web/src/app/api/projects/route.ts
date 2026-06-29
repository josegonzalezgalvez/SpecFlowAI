import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "@/lib/aws";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  try {
    const result = await dynamo.send(
      new ScanCommand({
        TableName: process.env.PROJECTS_TABLE,
      })
    );

    return NextResponse.json(result.Items ?? []);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error consultando DynamoDB" },
      { status: 500 }
    );
  }
}

export async function POST() {
    const project = {
        ProjectId: crypto.randomUUID(),
        Name: "Proyecto demo SpecFlow AI",
        Status: "Nuevo",
        CurrentPhase: "Requerimiento",
        CreatedBy: "jlgon",
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        TokensConsumed: 0,
    };

    await dynamo.send(
        new PutCommand({
        TableName: process.env.PROJECTS_TABLE,
        Item: project,
        })
    );

    return NextResponse.json(project, { status: 201 });
}