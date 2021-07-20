import React from 'react';
import MainScreen from './MainScreen/MainScreen';
import LeaguesStore from '../mobx/LeaguesStore';

const App = () => {
	const leaguesStore = new LeaguesStore();
	return <MainScreen store={leaguesStore} />;
};

export default App;
