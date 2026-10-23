import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { EyeIcon } from "../../../../components/icons/EyeIcon";
import { AccountCard } from "./AccountCard";
import { SliderNavigation } from "./SliderNavigation";
import { useAccountsController } from "./useAccountsController";
import { formatCurrency } from "../../../../../app/utils/formatCurrency";
import { cn } from "../../../../../app/utils/cn";
import { Spinner } from "../../../../components/Spinner";
import { PlusIcon } from "@radix-ui/react-icons";

export function Accounts() {
  const {
    slideState,
    setSlideState,
    windowWidth,
    areValuesVisible,
    toggleValuesVisibility,
    isLoading,
    accounts,
    openNewAccountModal,
    currentBalance,
    monthSummary,
    allTransactions,
    filters,
  } = useAccountsController();

  const currentYear = new Date().getFullYear();
  const monthName = format(
    new Date(filters.year, filters.month, 1),
    "MMMM",
    { locale: ptBR }
  ).toLowerCase();

  const monthPrefix =
    filters.year === currentYear
      ? `Em ${monthName}`
      : `Em ${monthName} de ${filters.year}`;

  const hasTransactions = allTransactions.length > 0;

  return (
    <div className="bg-teal-900 w-full h-full rounded-2xl md:p-10 px-4 py-8 flex flex-col justify-between">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="text-teal-950/50 fill-white h-10 w-10" />
        </div>
      )}

      {!isLoading && (
        <>
          <div>
            <span className="tracking-[-0.5px] text-white block">
              Saldo total
            </span>
            <div className="flex items-center gap-2">
              <strong
                className={cn(
                  "text-2xl tracking-[-1px] text-white",
                  !areValuesVisible && "blur-md"
                )}
              >
                {formatCurrency(currentBalance)}
              </strong>
              <button
                className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-white/10 transition-colors"
                onClick={toggleValuesVisibility}
                aria-label={
                  areValuesVisible ? "Ocultar saldos" : "Mostrar saldos"
                }
              >
                <EyeIcon open={!areValuesVisible} />
              </button>
            </div>

            <p className="text-sm text-teal-50 tracking-[-0.5px] mt-1">
              {hasTransactions ? (
                <>
                  {monthPrefix}: entrou{" "}
                  <span
                    className={cn(
                      "font-medium text-white inline-block",
                      !areValuesVisible && "blur-md"
                    )}
                  >
                    {formatCurrency(monthSummary.incomes)}
                  </span>{" "}
                  · saiu{" "}
                  <span
                    className={cn(
                      "font-medium text-white inline-block",
                      !areValuesVisible && "blur-md"
                    )}
                  >
                    {formatCurrency(monthSummary.expenses)}
                  </span>
                </>
              ) : (
                `${monthPrefix}: nenhuma movimentação`
              )}
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-end mt-10 md:mt-0">
            {accounts.length === 0 && (
              <>
                <div className="mb-4" slot="container-start">
                  <strong className="tracking-[-1px] text-white text-lg">
                    Minhas contas
                  </strong>
                </div>

                <button
                  className="mt-4 h-52 rounded-2xl border-2 border-dashed border-teal-600 flex flex-col items-center justify-center gap-4 text-white cursor-pointer hover:border-white transition-colors"
                  onClick={openNewAccountModal}
                >
                  <div className="w-11 h-11 rounded-full border-2 border-dashed border-white flex items-center justify-center">
                    <PlusIcon className="w-6 h-6" />
                  </div>
                  <span className="tracking-[-0.5px] font-medium block w-32 text-center">
                    Cadastre uma nova conta
                  </span>
                </button>
              </>
            )}
            {accounts.length > 0 && (
              <div>
                <Swiper
                  spaceBetween={16}
                  slidesPerView={windowWidth > 500 ? 2.1 : 1.2}
                  onSwiper={(swiper) => {
                    setSlideState({
                      isBeginning: swiper.isBeginning,
                      isEnd: swiper.isEnd,
                    });
                  }}
                  onSlideChange={(swiper) => {
                    setSlideState({
                      isBeginning: swiper.isBeginning,
                      isEnd: swiper.isEnd,
                    });
                  }}
                >
                  <div
                    className="flex items-center justify-between mb-4"
                    slot="container-start"
                  >
                    <strong className="tracking-[-1px] text-white text-lg">
                      Minhas contas
                    </strong>

                    <SliderNavigation
                      isBeginning={slideState.isBeginning}
                      isEnd={slideState.isEnd}
                    />
                  </div>
                  {accounts.map((account) => (
                    <SwiperSlide key={account.id}>
                      <AccountCard data={account} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
