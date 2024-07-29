// app/api/search/route.ts
import { NextResponse } from "next/server";
import connectToMongoDB from "@/lib/db";
import Post from "@/models/post";

export async function GET(request: Request) {
  const { client } = await connectToMongoDB();

  const posts = await Post.find();
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { message: "Query not provided" },
      { status: 400 }
    );
  }

  const results = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({ results });
}
