import React from "react";

import { AppGrid, AppForm, AppHeader } from "./components";
import { Wrapper } from "./container/wrapper";

import { GridProvider } from "./context/gridContext";
import { FormProvider } from "./context/formContext";

function App() {
  return (
    <div id="app">
      <AppHeader />
      <Wrapper>
        <FormProvider>
          <GridProvider>
            <AppGrid />
            <AppForm />
          </GridProvider>
        </FormProvider>
      </Wrapper>
    </div>
  );
}

export default App;
