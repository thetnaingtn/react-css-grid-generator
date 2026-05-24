import {
  useEffect,
  useCallback,
  ReactNode,
  PropsWithChildren,
} from "react";
import { Button } from "../ui";

type AppModalType = {
  modalHandler: (val: boolean) => void;
  modalStatus: boolean;
};

const AppModal = function ({
  children,
  modalHandler,
  modalStatus,
}: PropsWithChildren<AppModalType>) {
  const memoizedModalHandler = useCallback(
    (val: boolean) => modalHandler(val),
    [modalHandler]
  );
  useEffect(() => {
    function closeOnEsc(event: KeyboardEvent) {
      if (event.keyCode === 27) {
        memoizedModalHandler(false);
      }
    }
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, [memoizedModalHandler]);

  if (!modalStatus) return null;
  return (
    <div className="fixed z-[100] top-0 left-0 w-full h-full bg-black/70 grid [grid-template:1fr_auto_1fr/1fr_auto_1fr] overflow-auto transition-opacity duration-[0.25s] ease">
      <div className="[grid-area:2/2/2/2]">
        <div
          role="dialog"
          className="relative w-[80vw] max-w-[700px] px-[50px] pt-0 pb-[60px] bg-bg-start rounded-[5px] shadow-[0_2px_20px_rgba(0,0,0,0.8)] transition-all duration-300 ease border border-black max-tablet:px-5 max-tablet:pt-0 max-tablet:pb-5 max-tablet:w-[calc(100%-40px)]"
        >
          {children}
          <Button
            onClick={() => modalHandler(false)}
            className="mx-auto my-10 table max-tablet:mt-5 max-tablet:mb-0"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

AppModal.Header = function ({ children }: { children: ReactNode }) {
  return (
    <header id="modalTitle" className="text-[1.5em] text-center">
      {children}
    </header>
  );
};

AppModal.Section = function ({ children }: { children: ReactNode }) {
  return (
    <section id="modalDescription" className="my-5">
      {children}
    </section>
  );
};

export default AppModal;
