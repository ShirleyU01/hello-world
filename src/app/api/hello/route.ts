import { cleanName, helloMessage, type HelloResponse } from "@/lib/hello";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const name = cleanName(request.nextUrl.searchParams.get("name"));
  const body: HelloResponse = {
    message: helloMessage(name),
    service: "backend",
    node: process.version,
    time: new Date().toISOString(),
    name,
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
