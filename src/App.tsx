import { AppGrid, AppForm, AppHeader } from "./components";

import { GridProvider } from "./context/gridContext";
import { FormProvider } from "./context/formContext";

function App() {
  return (
    <div className="mx-[5vmin] mt-[5vmin]">
      <AppHeader />
      <section className="flex max-tablet:flex-col">
        <FormProvider>
          <GridProvider>
            <AppGrid />
            <AppForm />
          </GridProvider>
        </FormProvider>
      </section>
    </div>
  );
}

export default App;
