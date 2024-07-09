import { userData } from "../../../demo/users";


export async function GET(request: any) {
    return Response.json(
        {
            status: "success",
            data: { users: userData }
        },
        {
            status: 200
        }
    )
}


// export async function handler(req: any, res: any) {
//     if (req.method === "GET") {
     
//      res.status(200).json({
//          status: "success",
//          data: { user: userData }
//      })
//     }
//  }


// /api/user