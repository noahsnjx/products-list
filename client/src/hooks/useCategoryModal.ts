import { useState } from "react";

const useCreateCategoryModal = (initialState = false) => {
  const [openModal, setOpenModal] = useState(initialState);

  return {
    openCreateModal: openModal,
    setOpenCreateModal: setOpenModal
  };
};

const useDeleteCategoryModal = (initialState = false) => {
  const [openModal, setOpenModal] = useState(initialState);

  return {
    openDeleteModal: openModal,
    setOpenDeleteModal: setOpenModal
  };
};

export { useCreateCategoryModal, useDeleteCategoryModal };
