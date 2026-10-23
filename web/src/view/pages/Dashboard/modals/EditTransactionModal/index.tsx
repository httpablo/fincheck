import { TrashIcon } from "@radix-ui/react-icons";
import { Controller } from "react-hook-form";
import { useEditTransactionModalController } from "./useEditTransactionModalController";
import { Modal } from "../../../../components/Modal";
import { InputCurrency } from "../../../../components/InputCurrency";
import { Input } from "../../../../components/Input";
import { DatePickerInput } from "../../../../components/DatePickerInput";
import { Button } from "../../../../components/Button";
import { Select } from "../../../../components/Select";
import { ConfirmDelete } from "../../../../components/ConfirmDelete";
import type { Transaction } from "../../../../../app/entities/Transaction";

interface EditTransactionModalProps {
  open: boolean;
  onClose(): void;
  transaction: Transaction | null;
}

export function EditTransactionModal({
  transaction,
  open,
  onClose,
}: EditTransactionModalProps) {
  const {
    register,
    errors,
    control,
    handleSubmit,
    accounts,
    categories,
    isLoading,
    isDeleteModalOpen,
    isLoadingDelete,
    handleDeleteTransaction,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
  } = useEditTransactionModalController(transaction, onClose);

  const isExpense = transaction?.type === "EXPENSE";

  return (
    <>
      <Modal
        title={isExpense ? "Editar Despesa" : "Editar Receita"}
        open={open}
        onClose={onClose}
        rightAction={
          <button
            onClick={handleOpenDeleteModal}
            aria-label="Excluir"
            className="w-11 h-11 flex items-center justify-center outline-none hover:bg-red-50 rounded-full transition-colors cursor-pointer"
          >
            <TrashIcon className="w-6 h-6 text-red-900" />
          </button>
        }
      >
        <form onSubmit={handleSubmit}>
          <div>
            <span className="text-gray-600 tracking-tighter text-xs">
              Valor {isExpense ? "da despesa" : "da receita"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 tracking-tighter text-lg">R$</span>

              <Controller
                control={control}
                name="value"
                render={({ field: { onChange, value } }) => (
                  <InputCurrency
                    error={errors.value?.message}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-4">
            <Input
              type="text"
              placeholder={isExpense ? "Nome da Despesa" : "Nome da Receita"}
              error={errors.name?.message}
              {...register("name")}
            />

            <Controller
              control={control}
              name="categoryId"
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder="Categoria"
                  error={errors.categoryId?.message}
                  onChange={onChange}
                  value={value}
                  options={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                />
              )}
            />

            <Controller
              control={control}
              name="bankAccountId"
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder={isExpense ? "Pagar com" : "Receber com"}
                  error={errors.bankAccountId?.message}
                  onChange={onChange}
                  value={value}
                  options={accounts.map((account) => ({
                    value: account.id,
                    label: account.name,
                  }))}
                />
              )}
            />

            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  value={value}
                  onChange={onChange}
                  error={errors.date?.message}
                />
              )}
            />
          </div>

          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Salvar
          </Button>
        </form>
      </Modal>

      {isDeleteModalOpen && (
        <ConfirmDelete
          isLoading={isLoadingDelete}
          onConfirm={handleDeleteTransaction}
          onClose={handleCloseDeleteModal}
          title={`Tem certeza que deseja excluir esta ${isExpense ? "despesa" : "receita"}?`}
        />
      )}
    </>
  );
}
