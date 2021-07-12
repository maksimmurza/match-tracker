import React from 'react';
import DataProvider from './DataProvider/DataProvider';
import MainScreen from './MainScreen/MainScreen';

const App = () => {
	return <DataProvider render={leagues => <MainScreen leagues={leagues}></MainScreen>} />;
};

export default App;
