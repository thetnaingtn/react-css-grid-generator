import React from "react";
import styled from "styled-components/macro";

import { AppGrid, AppForm, AppHeader } from "./components";
import { Wrapper } from "./container/wrapper";

import { GridProvider } from "./context/gridContext";
import { FormProvider } from "./context/formContext";

const StylesApp = styled.div`
  margin: 5vmin 5vmin 0;
`;

function App() {
  return (
    <StylesApp>
      <AppHeader />
      <Wrapper>
        <FormProvider>
          <GridProvider>
            <AppGrid />
            <AppForm />
          </GridProvider>
        </FormProvider>
      </Wrapper>
    </StylesApp>
  );
}

export default App;
