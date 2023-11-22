import Modal from "react-modal";
import Input from "../Input";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (categoryName: string) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onCreateCategory
}) => {
  const [categoryName, setCategoryName] = useState("");

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  }, []);

  const handleAdd = () => {
    onCreateCategory(categoryName);
    onClose();
  };

  useEffect(() => {
    setCategoryName("");
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen}>
      <button onClick={onClose}>close</button>
      <Input
        value={categoryName}
        onChange={handleChange}
        style={{ backgroundColor: "inherit", color: "inherit" }}
      />
      <button onClick={handleAdd}>add</button>
    </Modal>
  );
};

export default CreateCategoryModal;
