import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { cn } from "../../../../../../app/utils/cn";
import { Modal } from "../../../../../components/Modal";
import { useFiltersModal } from "./useFiltersModalController";
import { Button } from "../../../../../components/Button";

interface FiltersModalProps {
  open: boolean;
  onClose(): void;
  onApplyFilters(filters: {
    bankAccountId: string | undefined;
    year: number;
  }): void;
  bankAccountId?: string | undefined;
  year?: number | undefined;
}

export function FiltersModal({
  open,
  onClose,
  onApplyFilters,
  bankAccountId,
  year,
}: FiltersModalProps) {
  const {
    handleSelectBankAccount,
    selectedBankAccountId,
    handleChangeYear,
    selectedYear,
    accounts,
  } = useFiltersModal({
    open,
    bankAccountId,
    year,
  });

  return (
    <Modal open={open} onClose={onClose} title="Filtros">
      <div>
        <span className="text-lg font-bold tracking-tightest text-gray-800">
          Conta
        </span>
        <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
          {accounts.map((account) => {
            const isSelected = account.id === selectedBankAccountId;

            return (
              <button
                key={account.id}
                onClick={() => handleSelectBankAccount(account.id)}
                className={cn(
                  "p-2.5 rounded-2xl w-full text-left flex items-center justify-between hover:bg-gray-50 text-gray-800 transition-colors cursor-pointer",
                  isSelected &&
                    "bg-teal-50 text-teal-900 font-medium hover:bg-teal-100/70"
                )}
              >
                <span>{account.name}</span>
                {isSelected && <CheckIcon className="w-5 h-5 text-teal-900" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 text-gray-800">
        <span className="text-lg font-bold tracking-tightest">Ano</span>
        <div className="space-y-2 mt-2">
          <div className="mt-2 w-52 flex items-center justify-between">
            <button
              onClick={() => handleChangeYear(-1)}
              className="w-12 h-12 flex items-center justify-center"
              aria-label="Ano anterior"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-sm font-medium tracking-tighter">
                {selectedYear}
              </span>
            </div>
            <button
              onClick={() => handleChangeYear(+1)}
              className="w-12 h-12 flex items-center justify-center"
              aria-label="Próximo ano"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-10"
        onClick={() =>
          onApplyFilters({
            bankAccountId: selectedBankAccountId,
            year: selectedYear,
          })
        }
      >
        Aplicar Filtros
      </Button>
    </Modal>
  );
}
