import { Button } from "./Button";
import { TrashIcon } from "./icons/TrashIcon";
import { Modal } from "./Modal";

interface DeleteConfirmationModalProps {
  title: string;
  description?: string;
  isLoading: boolean;
  onConfirm(): void;
  onClose(): void;
}

export function ConfirmDelete({
  title,
  description,
  isLoading,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  return (
    <Modal open title="Excluir" onClose={onClose}>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex justify-center items-center bg-red-50 rounded-full w-[52px] h-[52px]">
          <TrashIcon className="w-6 h-6 text-red-900" />
        </div>
        <p className="w-[180px] font-bold text-gray-800 tracking-[-0.5px]">
          {title}
        </p>
        {description && (
          <p className="text-gray-800 tracking-[-0.5px]">{description}</p>
        )}
      </div>
      <div className="space-y-4 mt-10">
        <Button
          className="w-full"
          variant="danger"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          Sim, desejo excluir
        </Button>
        <Button
          className="w-full"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
