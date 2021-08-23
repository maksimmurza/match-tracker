import React from 'react';
import { MainScreen } from './MainScreen';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LeaguesStore from '../../mobx/LeaguesStore/LeaguesStore';
import mockLeagues from '../../__tests__/fixtures/leagues.test.json';
import cloneDeep from 'lodash/cloneDeep';
import { getLocalLeagues, writeLocalLeagues } from '../../utils/localStorage';

const mockLeaguesFromAPI = jest.fn(async function () {
	await this.getLeaguesFromLocal(cloneDeep(mockLeagues));
});
const mockLeaguesFromLocal = jest.fn(LeaguesStore.prototype.getLeaguesFromLocal);

LeaguesStore.prototype.getLeaguesFromLocal = mockLeaguesFromLocal;
LeaguesStore.prototype.getLeaguesFromAPI = mockLeaguesFromAPI;

jest.mock('../../utils/localStorage', () => ({
	...jest.requireActual('../../utils/localStorage'),
	getLocalLeagues: jest.fn(),
	writeLocalLeagues: jest.fn(),
}));

beforeEach(() => {
	window.gapi = {
		load: jest.fn(),
		client: {
			init: jest.fn(),
			calendar: {
				events: {
					insert: jest.fn(),
					list: jest.fn(),
				},
			},
		},
		auth2: {
			getAuthInstance: () => ({
				isSignedIn: jest.fn(),
				currentUser: { get: () => ({ getBasicProfile: () => ({ getName: () => 'User Name' }) }) },
			}),
		},
	};
});

afterEach(cleanup);

it('should display loading screen while store with leagues and matches is not ready', async () => {
	const leaguesStore = new LeaguesStore();
	getLocalLeagues.mockImplementation(() =>
		Promise.resolve({ localLeagues: mockLeagues, outOfDate: false })
	);
	writeLocalLeagues.mockImplementation(() => {});
	const { queryByText, findByTestId } = render(
		<MainScreen store={leaguesStore} showNotification={() => {}} />
	);
	expect(queryByText('Just one second')).toBeInTheDocument();
	await findByTestId('main-grid');
	expect(queryByText('Just one second')).not.toBeInTheDocument();
});

it('should initiate receiving data from local storage', async () => {
	const leaguesStore = new LeaguesStore();
	getLocalLeagues.mockImplementation(() =>
		Promise.resolve({ localLeagues: mockLeagues, outOfDate: false })
	);
	writeLocalLeagues.mockImplementation(() => {});
	render(<MainScreen store={leaguesStore} showNotification={() => {}} />);
	await waitFor(() => expect(getLocalLeagues).toHaveBeenCalled());
	expect(mockLeaguesFromLocal).toHaveBeenCalled();
});

it('should receive data from api when local storage is empty or out of date and write it storage', async () => {
	const leaguesStore = new LeaguesStore();
	getLocalLeagues.mockImplementation(() => Promise.resolve({ localLeagues: mockLeagues, outOfDate: true }));
	writeLocalLeagues.mockImplementation(() => {});
	render(<MainScreen store={leaguesStore} showNotification={() => {}} />);
	await waitFor(() => expect(mockLeaguesFromAPI).toHaveBeenCalled());
	expect(writeLocalLeagues).toHaveBeenCalled();
});

it('should render main components', async () => {
	const leaguesStore = new LeaguesStore();
	const { queryByTestId, findByTestId } = render(
		<MainScreen store={leaguesStore} showNotification={() => {}} />
	);
	await findByTestId('main-grid');
	expect(queryByTestId('match-list')).toBeInTheDocument();
	expect(queryByTestId('controls-bar')).toBeInTheDocument();
	expect(queryByTestId('selection-area')).toBeInTheDocument();
});
