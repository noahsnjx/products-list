import Modal from "react-modal";

interface CreateCategoryModalProps {
  content?: string;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const ConfirmModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  content = "Êtes-vous sur de vouloir réaliser cette action ?"
}) => {
  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      {content}
      <button onClick={onClose}>No</button>
      <button onClick={handleAccept}>Yes</button>
    </Modal>
  );
};

export default ConfirmModal;
