import React, { useState } from "react";
import useUsers from "../../hook/useUsers";
import useCurrentUser from "../../hook/useCurrentUser";
import Button from "../Button";
import { BeakerIcon  } from "@heroicons/react/24/solid";
import { useParams } from "next/navigation";
import { useEditModal } from "../../hook/useModal";
import useFollow from "../../hook/useFollow";


// export default function UserBio({ params }: { params: { userId: string } }) {
//   const { data: currentUser } = useCurrentUser();
//   const { userId } = params;
//   const { data: user } = useUsers(userId as string);
//   console.log(currentUser);
//   console.log(userId);
//   const editModal: any = useEditModal();
//   const { isFollowing, toggleFollow } = useFollow(user?._id as string);
//   return (
//     <div className="">
//       <div className="flex justify-end p-4 mt-10 relative">
//         {currentUser?._id === userId ? (
//           <div>
//             <Button
//               title="Edit Profile"
//               onClick={() => editModal.onOpen()}
//             >
//               Edit Profile
//             </Button>
//           </div>
//         ) : (
//           <div>
//             <Button
//               onClick={toggleFollow}
//               title={isFollowing ? "Unfollow" : "Follow"}
//             >
//               {isFollowing ? "Unfollow" : "Follow"}
//             </Button>
//           </div>
//         )}
//       </div>
//       <div className="px-4 -mt-7">
//         <div className="flex flex-col">
//           <p className="text-2xl font-bold  text-black">
//             {user?.username}
//           </p>
//           <p className="text-gray-700 font-thin ">
//             @{user?.username}
//           </p>
//           <p className="mt-2">
//             {user?.bio}
//           </p>
//           <div className="flex space-x-2 mt-2">
//             <div className=" flex flex-col  text-sm pt-2">
//               <div className=" flex flex-row  items-center space-x-1">
//                 <BeakerIcon  className="w-4 h-4"/>
//                 <p>Joined {' '} {new Date(user?.createdAt).toLocaleDateString()}</p>
//                 <p>
//                   {user?.location && (
//                     <>
//                       <span className="font-bold">•</span>
//                       <span>{user?.location}</span>
//                     </>
//                   )}
//                 </p>
//               </div>
//               <div className=" flex flex-row items-center space-x-4 mt-2">
//                 <p className=" ">
//                   Following{" "}
//                   <span className="font-bold">
//                     {user?.followingIds?.length || 0}
//                   </span>
//                 </p>
//                 <p className="">
//                   Followers{" "}
//                   <span className="font-bold">{user?.followerCount || 0}</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <span className=" marker:w-full marker:h-0.5 marker:bg-gray-200 marker:block marker:mt-4 marker:">
//         </span>
//       </div>
//     </div>
//   );
// }


export default function UserBio({ params }: { params: { userId: string } }) {
  const { data: currentUser } = useCurrentUser();
  const { userId } = params;
  const { data: user } = useUsers(userId);
  const editModal = useEditModal();
  const { isFollowing, toggleFollow } = useFollow(user?._id || "");

  return (
    <div className="p-4 mt-10">
      <div className="flex justify-end mb-4">
        {currentUser?._id === userId ? (
          <Button title="Edit Profile" onClick={editModal.onOpen}>
            Edit Profile
          </Button>
        ) : (
          <Button title={isFollowing ? "Unfollow" : "Follow"} onClick={toggleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
      <div className="px-4">
        <div className="flex flex-col">
          <p className="text-2xl font-bold text-black">{user?.username}</p>
          <p className="text-gray-700">@{user?.username}</p>
          <p className="mt-2">{user?.bio}</p>
          <div className="flex space-x-2 mt-2">
            <div className="text-sm pt-2">
              <div className="flex items-center space-x-1">
                <BeakerIcon className="w-4 h-4" />
                <p>Joined {new Date(user?.createdAt).toLocaleDateString()}</p>
                {user?.location && (
                  <>
                    <span className="font-bold">•</span>
                    <span>{user?.location}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <p>
                  Following <span className="font-bold">{user?.followingIds?.length || 0}</span>
                </p>
                <p>
                  Followers <span className="font-bold">{user?.followerCount || 0}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200 mt-4"></div>
      </div>
    </div>
  );
}