import React from 'react';
import App from '../components/App';
import LeaguesStore from '../mobx/LeaguesStore/LeaguesStore';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from './fixtures/leagues.test.json';
import cloneDeep from 'lodash/cloneDeep';

LeaguesStore.prototype.getLeaguesFromAPI = jest.fn(async function () {
	await this.getLeaguesFromLocal(cloneDeep(leagues));
});

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

test('match-list should display matches in the amount set by user', async () => {
	const { findByTestId, queryByDisplayValue } = render(<App />);
	await findByTestId('controls-bar');
	const input = queryByDisplayValue(15);
	fireEvent.change(input, { target: { value: '3' } });
	expect(screen.queryAllByTestId('match')).toHaveLength(3);
});

test('match poster should display date and time in format set by user', async () => {
	let regexp;
	const monthEn = /January|February|March|April|May|June|July|August|September|October|November|December/;
	const monthRu = /января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря/;
	const { queryAllByTestId, findByTestId, queryByText } = render(<App />);
	await findByTestId('controls-bar');
	fireEvent.click(queryByText('en', { exact: true }));
	const matches = queryAllByTestId('match');
	regexp = new RegExp(`${monthEn} [0-3]?[0-9]`);
	matches.forEach(match => {
		expect(within(match).queryByText(regexp)).not.toBeNull();
		expect(within(match).queryByText(/[0-1]?[0-9]:[0-5][0-9] (AM|PM)/)).not.toBeNull();
	});
	fireEvent.click(queryByText('ru', { exact: true }));
	regexp = new RegExp(`[0-3][0-9] ${monthRu}`);
	matches.forEach(match => {
		expect(within(match).queryByText(regexp)).not.toBeNull();
		expect(within(match).queryByText(/[0-2]?[0-9]:[0-5][0-9]/)).not.toBeNull();
	});
});

test('team checkbox should react on click to league checkbox', async () => {
	const { queryAllByTestId, findByTestId } = render(<App />);
	await findByTestId('controls-bar');
	const leagueCheckbox = queryAllByTestId('league-tab-checkbox')[0];
	const teams = queryAllByTestId('team-checkbox');

	teams.forEach(team => {
		expect(within(team).queryByRole('checkbox').checked).toBeTruthy();
	});
	expect(leagueCheckbox.className).toContain('checked');

	fireEvent.click(within(leagueCheckbox).queryByRole('checkbox'));
	teams.forEach(team => {
		expect(within(team).queryByRole('checkbox').checked).toBeFalsy();
	});

	fireEvent.click(within(teams[0]).queryByRole('checkbox'));
	fireEvent.click(within(teams[1]).queryByRole('checkbox'));

	fireEvent.click(within(leagueCheckbox).queryByRole('checkbox'));
	teams.forEach(team => {
		expect(within(team).queryByRole('checkbox').checked).toBeFalsy();
	});

	fireEvent.click(within(leagueCheckbox).queryByRole('checkbox'));
	teams.forEach(team => {
		expect(within(team).queryByRole('checkbox').checked).toBeTruthy();
	});
});

test('league checkbox should react on state of teams checkboxes', async () => {
	const { queryAllByTestId, findByTestId } = render(<App />);
	await findByTestId('controls-bar');
	const leagueCheckbox = queryAllByTestId('league-tab-checkbox')[0];
	const teams = queryAllByTestId('team-checkbox');

	teams.forEach(team => {
		expect(within(team).queryByRole('checkbox').checked).toBeTruthy();
	});
	expect(leagueCheckbox.className).toContain('checked');

	for (let i = 0; i <= teams.length - 2; i++) {
		fireEvent.click(within(teams[i]).queryByRole('checkbox'));
		expect(leagueCheckbox.className).toContain('indeterminate');
	}

	fireEvent.click(within(teams[teams.length - 1]).queryByRole('checkbox'));
	expect(leagueCheckbox.className).not.toContain('indeterminate');
	expect(leagueCheckbox.className).not.toContain('checked');

	for (let i = 0; i <= teams.length - 2; i++) {
		fireEvent.click(within(teams[i]).queryByRole('checkbox'));
		expect(leagueCheckbox.className).toContain('indeterminate');
	}
	fireEvent.click(within(teams[teams.length - 1]).queryByRole('checkbox'));
	expect(leagueCheckbox.className).toContain('checked');
});

test('match-list should display matches which marked in checkboxes', async () => {
	const { queryAllByTestId, findByTestId } = render(<App />);
	await findByTestId('controls-bar');
	const leaguesTabs = queryAllByTestId('league-tab');
	const leaguesCheckboxes = queryAllByTestId('league-tab-checkbox');
	const teams = queryAllByTestId('team-checkbox');
	expect(queryAllByTestId('match')).toHaveLength(4);
	fireEvent.click(leaguesTabs[1]);
	fireEvent.click(within(leaguesCheckboxes[1]).queryByRole('checkbox'));
	expect(queryAllByTestId('match')).toHaveLength(2);
	fireEvent.click(leaguesTabs[0]);
	fireEvent.click(within(teams[0]).queryByRole('checkbox'));
	fireEvent.click(within(teams[1]).queryByRole('checkbox'));
	expect(queryAllByTestId('match')).toHaveLength(1);
	fireEvent.click(within(teams[2]).queryByRole('checkbox'));
	fireEvent.click(within(teams[3]).queryByRole('checkbox'));
	expect(queryAllByTestId('match')).toHaveLength(0);
	fireEvent.click(within(leaguesCheckboxes[0]).queryByRole('checkbox'));
	fireEvent.click(within(leaguesCheckboxes[1]).queryByRole('checkbox'));
	expect(queryAllByTestId('match')).toHaveLength(4);
});

test('sidebar should open on button click and close on dimmed area click', async () => {
	window.innerWidth = 500;
	const { queryByTestId, findByTestId } = render(<App />);
	await findByTestId('controls-bar');
	const toggleButton = queryByTestId('toggle-sidebar-button');
	const sidebar = queryByTestId('sidebar');
	expect(sidebar).toBeInTheDocument();
	expect(sidebar.className).not.toContain('visible');
	fireEvent.click(toggleButton);
	expect(sidebar.className).toContain('visible');
	fireEvent.click(document.querySelector('.dimmed'));
	expect(sidebar.className).not.toContain('visible');
});
