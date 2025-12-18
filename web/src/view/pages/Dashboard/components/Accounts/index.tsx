import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

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
  } = useAccountsController();

  return (
    <div className="bg-teal-900 w-full h-full rounded-2xl md:p-10 px-4 py-8 flex flex-col">
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
                {formatCurrency(25432)}
              </strong>
              <button
                className="flex items-center justify-center w-8 h-8"
                onClick={toggleValuesVisibility}
              >
                <EyeIcon open={!areValuesVisible} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end mt-10 md:mt-0">
            {accounts.length === 0 && (
              <>
                <div className="mb-4" slot="container-start">
                  <strong className="tracking-[-1px] text-white text-lg">
                    Minhas contas
                  </strong>
                </div>

                <button className="mt-4 h-52 rounded-2xl border-2 border-dashed border-teal-600 flex flex-col items-center justify-center gap-4 text-white ">
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
                  onSlideChange={(swipper) => {
                    setSlideState({
                      isBeginning: swipper.isBeginning,
                      isEnd: swipper.isEnd,
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
                  <SwiperSlide>
                    <AccountCard
                      color="#7950F2"
                      name="Nubank"
                      balance={1000.23}
                      type="CHECKING"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <AccountCard
                      color="#333"
                      name="XP"
                      balance={1000.23}
                      type="INVESTMENT"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <AccountCard
                      color="#0f0"
                      name="Carteira"
                      balance={1000.23}
                      type="CASH"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
