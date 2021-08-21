import React from 'react';
import MainScreen from './MainScreen/MainScreen';
import LeaguesStore from '../mobx/LeaguesStore/LeaguesStore';
import styled from 'styled-components';

const App = () => {
	const leaguesStore = new LeaguesStore();
	return (
		<>
			<MainScreen store={leaguesStore} />
			<NotificationArea id="notification-area"></NotificationArea>
		</>
	);
};

const NotificationArea = styled.div`
	position: fixed;
	bottom: 5px;
	right: 0;
	width: 350px;
	height: max-content;
	display: flex;
	flex-direction: column;

	& > * {
		right: 10px !important;
		z-index: 500;
		margin: 5px 0 0 0 !important;
		opacity: 0.9;
	}

	@media (max-width: 767px) {
		bottom: 0;
		right: 0;
		width: 100vw;
		& > * {
			right: 0 !important;
		}
	}
`;

export default App;
