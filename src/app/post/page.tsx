"use client"
// app/page.tsx (or any other page/component)
import React, { useState } from "react";
import Modal from "@/app/components/Modal/EditPostModal";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-8">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Open Modal
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className="text-xl font-semibold">Modal Title</h1>
        <p className="mt-4">This is the modal content.</p>
        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Page;
