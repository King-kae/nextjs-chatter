import { userData } from "../../../../demo/users";

export async function GET(
  request: any,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  const user = userData.find((user) => user.Username === username);

  if (user) {
    return Response.json(
      {
        status: "success",
        data: { user: { user } },
      },
      {
        status: 200,
      }
    );
  }
  return Response.json(
    {
      status: "not found",
      data: { user: null },
    },
    {
      status: 404,
    }
  );
}
