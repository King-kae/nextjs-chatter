import React from "react";
import { useLogoutModal } from "@/app/hook/useModal";
import Modal from "../Modal";
import { signOut } from "next-auth/react";
import router from "next/router";


const LogoutModal: React.FC = () => {
  const logoutModal = useLogoutModal();

  const handleLogout = () => {
		signOut();
        router.push("/");
	};

  return (
    <Modal
      disabled={false}
      title="Log Out"
      actionLabel="Log Out"
      isOpen={logoutModal.isOpen}
      onClose={logoutModal.onClose}
      onSubmit={handleLogout}
      body={
        <div className="flex flex-col gap-y-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to log out?
          </p>  
        </div>
      }
    />
  );
}
export default LogoutModal;
