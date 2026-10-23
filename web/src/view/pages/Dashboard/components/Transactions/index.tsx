import { Swiper, SwiperSlide } from "swiper/react";
import { MONTHS } from "../../../../../app/config/constants";
import { cn } from "../../../../../app/utils/cn";
import { formatCurrency } from "../../../../../app/utils/formatCurrency";
import emptyStateImage from "../../../../../assets/empty-state.svg";
import { Spinner } from "../../../../components/Spinner";
import { FilterIcon } from "../../../../components/icons/FilterIcon";
import { CategoryIcon } from "../../../../components/icons/categories/CategoryIcon";
import { SliderNavigation } from "./SliderNavigation";
import { SliderOptions } from "./SliderOptions";
import { useTransactionsController } from "./useTransactionsController";
import { TransactionTypeDropdown } from "./TransactionTypeDropdown";
import { Button } from "../../../../components/Button";
import { FiltersModal } from "./FiltersModal";
import { formatDate } from "../../../../../app/utils/formatDate";
import { EditTransactionModal } from "../../modals/EditTransactionModal";
import type { Transaction } from "../../../../../app/entities/Transaction";

export function Transactions() {
  const {
    areValuesVisible,
    openNewTransactionModal,
    isInitialLoading,
    isLoading,
    transactions,
    handleOpenFilterModal,
    handleCloseFilterModal,
    isFilterModalOpen,
    filters,
    handleChangeFilters,
    handleApplyFilters,
    isEditModalOpen,
    handleCloseEditModal,
    transactionBeingEdited,
    handleOpenEditModal,
  } = useTransactionsController();

  const hasTransactions = transactions.length > 0;
  const hasActiveFilters =
    Boolean(filters.bankAccountId) || filters.year !== new Date().getFullYear();

  return (
    <div className="bg-gray-100 w-full h-full rounded-2xl md:p-10 px-4 py-8 flex flex-col min-h-0 overflow-hidden">
      {isInitialLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="w-10 h-10" />
        </div>
      )}

      {!isInitialLoading && (
        <>
          <FiltersModal
            open={isFilterModalOpen}
            onClose={handleCloseFilterModal}
            onApplyFilters={handleApplyFilters}
            bankAccountId={filters.bankAccountId}
            year={filters.year}
          />

          <EditTransactionModal
            open={isEditModalOpen}
            onClose={handleCloseEditModal}
            transaction={transactionBeingEdited}
          />

          <header>
            <div className="flex items-center justify-between max-[750px]:mx-4">
              <TransactionTypeDropdown
                onSelect={handleChangeFilters("type")}
                selectedType={filters.type}
              />

              <button
                onClick={handleOpenFilterModal}
                className="w-11 h-11 flex items-center justify-center relative cursor-pointer rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Filtrar transações"
              >
                <FilterIcon />
                {hasActiveFilters && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-teal-800 rounded-full" />
                )}
              </button>
            </div>
            <div className="mt-6 relative">
              <Swiper
                slidesPerView={3}
                centeredSlides
                initialSlide={filters.month}
                onSlideChange={(swiper) => {
                  handleChangeFilters("month")(swiper.realIndex);
                }}
              >
                <SliderNavigation />
                {MONTHS.map((month, index) => (
                  <SwiperSlide key={month}>
                    {({ isActive }) => (
                      <SliderOptions
                        isActive={isActive}
                        month={month}
                        index={index}
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </header>

          <div className="mt-4 space-y-2 flex-1 overflow-y-auto pb-20 md:pb-0">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Spinner className="w-10 h-10" />
              </div>
            )}
            {!hasTransactions && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <img
                  src={emptyStateImage}
                  alt="Imagem carregada quando não há transações"
                  className="max-w-[200px]"
                />
                <p className="text-gray-700 mt-4 text-sm font-medium">
                  Não encontramos nenhuma transação.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    variant="danger"
                    className="h-10 px-4 text-sm"
                    onClick={() => openNewTransactionModal("EXPENSE")}
                  >
                    Nova despesa
                  </Button>
                  <Button
                    className="h-10 px-4 text-sm"
                    onClick={() => openNewTransactionModal("INCOME")}
                  >
                    Nova receita
                  </Button>
                </div>
              </div>
            )}
            {hasTransactions && !isLoading && (
              <>
                {transactions.map((transaction: Transaction) => {
                  const transactionType = transaction.type.toLowerCase();
                  return (
                    <div
                      key={transaction.id}
                      className="bg-white p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-900 transition-colors"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        handleOpenEditModal(transaction);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleOpenEditModal(transaction);
                        }
                      }}
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <CategoryIcon
                          type={transactionType as "income" | "expense"}
                          category={transaction.category?.icon}
                        />

                        <div>
                          <strong className="font-bold tracking-[-0.5px] block">
                            {transaction.name}
                          </strong>
                          <span className="text-sm text-gray-600">
                            {formatDate(new Date(transaction.date))}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "tracking-[0.5px] font-medium",
                          transactionType === "expense"
                            ? "text-red-800"
                            : "text-green-800",
                          !areValuesVisible && "blur-sm",
                        )}
                      >
                        {transactionType === "expense" ? "-" : "+"}
                        {formatCurrency(transaction.value)}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
