interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
}

export default function Modal({ children, closeModal }: ModalProps) {
  return (
    <div
      className="fixed left-0 top-0 w-full h-full bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center"
      onClick={() => {
        closeModal();
      }}
    >
      <div
        className="p-5 bg-black z-10 border border-gray-700"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          className="close block"
          onClick={() => {
            closeModal();
          }}
        ></button>
        {children}
      </div>
    </div>
  );
}
