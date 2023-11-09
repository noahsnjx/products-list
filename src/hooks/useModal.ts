import { useCallback, useState } from "react";

const useModal = (initialState) => {
  const [openIndex, setOpenIndex] = useState(initialState);

  const open = typeof openIndex === "number";

  const onOpenModal = useCallback((index) => {
    setOpenIndex(index);
  }, []);

  return {
    openModal: open,
    onOpenModal,
    setOpenIndex,
    openModalIndex: openIndex
  };
};

export default useModal;
