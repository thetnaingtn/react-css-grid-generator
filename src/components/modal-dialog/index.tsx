import React, {
  useEffect,
  useCallback,
  ReactNode,
  PropsWithChildren,
  ReactChild,
} from "react";
import styled from "styled-components/macro";

/* 
	modal styled components 
	start
*/
const StyledModalMask = styled.div`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: grid;
  grid-template: 1fr auto 1fr / 1fr auto 1fr;
  overflow: auto;
  transition: opacity 0.25s ease;
`;

const StyledModalWrapper = styled.div`
  grid-area: 2 / 2 / 2 / 2;
`;

const StyledModalContainer = styled.div`
  position: relative;
  width: 80vw;
  max-width: 700px;
  padding: 0px 50px 60px;
  background-color: #192d38;
  border-radius: 5px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
  border: 1px solid black;

  @media screen and (max-width: 700px) {
    padding: 0px 20px 20px;
    width: calc(100% - 40px);
  }
`;

const StyledModalButton = styled.button`
  margin: 40px auto;
  display: table;

  @media screen and (max-width: 700px) {
    margin: 20px auto 0;
  }
`;

const StyledModalHeader = styled.header`
  font-size: 1.5em;
  text-align: center;
`;
const StyledModalBody = styled.section`
  margin: 20px 0;
`;

/* 
	modal styled components 
	start
*/

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
    <StyledModalMask>
      <StyledModalWrapper>
        <StyledModalContainer role="dialog">
          {children}
          <StyledModalButton onClick={() => modalHandler(false)}>
            Done
          </StyledModalButton>
        </StyledModalContainer>
      </StyledModalWrapper>
    </StyledModalMask>
  );
};

AppModal.Header = function ({ children }: { children: ReactNode }) {
  return <StyledModalHeader id="modalTitle">{children}</StyledModalHeader>;
};

AppModal.Section = function ({ children }: { children: ReactNode }) {
  return <StyledModalBody id="modalDescription">{children}</StyledModalBody>;
};

export default AppModal;
