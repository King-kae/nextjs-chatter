import Image from "next/image";
import React, { useCallback } from "react";
import useCurrentUser from "../hook/useCurrentUser";
import { useRouter } from "next/navigation";
import useUsers from "../hook/useUsers";

interface AvatarProps {
  seed?: string;
  size?: "tiny" | "small" | "medium" | "large" | "extra-large";
}
interface SubClasses {
  [key: string]: string;
}

const sizeVariants: SubClasses = {
  tiny: "w-5 aspect-square",
  small: "w-8 aspect-square",
  medium: "w-10 aspect-square",
  large: "w-20 aspect-square",
  "extra-large": "w-24 aspect-square",
};

export default function Avatar({ seed, size }: AvatarProps) {
  const router = useRouter();
  const { data: user, isLoading } = useUsers(seed);

  const onClick = useCallback(
    (event: any) => {
        event.stopPropagation();

        const url = `/user/${seed}`;

        router.push(url);
    },
    [router, seed]
);

  if(isLoading) {
    return (<div></div>)
  }
  return (
    <div
      className={`relative cursor-pointer overflow-hidden rounded-full ring-2 ring-white shadow-soft transition-transform hover:scale-105 ${
        size ? sizeVariants[size] : ""
      }`}
    >
      <Image
        src={
          user?.avatar ||
          `https://ui-avatars.com/api/?name=${user?.username}&&background=random`
        }
        width={60}
        height={60}
        alt="avatar"
        className={`absolute left-0 top-0 aspect-square w-16 rounded-full object-cover ${
          size ? sizeVariants[size] : ""
        }`}
        onClick={onClick}
      />
    </div>
  );
}
