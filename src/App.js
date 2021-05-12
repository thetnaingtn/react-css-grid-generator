import React from 'react';

import { AppGrid, AppForm, AppHeader } from './components';
import { GridProvider } from './context/gridContext';
import { FormProvider } from "./context/formContext";


// import './assets/styles/main.scss';
import './App.css';

function App() {
	return (

		<div id="app">
			<AppHeader />
			<section className="container">
				<FormProvider>
					<GridProvider>
						<AppGrid />
						<AppForm />
					</GridProvider>
				</FormProvider>
			</section>
		</div>

	)
}

export default App;
