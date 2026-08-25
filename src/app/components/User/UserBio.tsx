"use client";

import React from "react";
import useUsers from "../../hook/useUsers";
import useCurrentUser from "../../hook/useCurrentUser";
import Button from "../Button";
import { CalendarDays, MapPin } from "lucide-react";
import { useEditModal } from "../../hook/useModal";
import useFollow from "../../hook/useFollow";

export default function UserBio({ params }: { params: { userId: string } }) {
  const { data: currentUser } = useCurrentUser();
  const { userId } = params;
  const { data: user } = useUsers(userId);
  const editModal = useEditModal();
  const { isFollowing, toggleFollow } = useFollow(user?._id || "");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mt-4 flex justify-end">
        {currentUser?._id === userId ? (
          <Button title="Edit Profile" sizing="sm" colors="borderOnly" onClick={editModal.onOpen}>
            Edit Profile
          </Button>
        ) : (
          <Button
            title={isFollowing ? "Unfollow" : "Follow"}
            sizing="sm"
            colors={isFollowing ? "borderOnly" : "primary"}
            onClick={toggleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
      <div className="mt-6">
        <p className="font-display text-2xl font-bold text-ink-950">{user?.username}</p>
        <p className="text-ink-500">@{user?.username}</p>
        {user?.bio && <p className="mt-2 text-ink-700">{user.bio}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
          </span>
          {user?.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {user.location}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-5 text-sm">
          <p className="text-ink-500">
            Following <span className="font-semibold text-ink-900">{user?.following?.length || 0}</span>
          </p>
          <p className="text-ink-500">
            Followers <span className="font-semibold text-ink-900">{user?.followerCount || 0}</span>
          </p>
        </div>
      </div>
      <div className="mt-6 h-px bg-ink-100" />
    </div>
  );
}
