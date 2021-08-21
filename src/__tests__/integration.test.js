import React from 'react';
import App from '../components/App';
import LeaguesStore from '../mobx/LeaguesStore/LeaguesStore';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from './fixtures/leagues.test.json';
import cloneDeep from 'lodash/cloneDeep';

const mockReceivingLeagues = jest.fn(async function () {
	this.leagues = cloneDeep(leagues);
});
LeaguesStore.prototype.getLeaguesFromAPI = mockReceivingLeagues;
LeaguesStore.prototype.getLeaguesFromLocal = mockReceivingLeagues;

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

test('league checkbox should react on state of teams checkboxes', async () => {});

test('team checkbox should react on click to league checkbox', async () => {});

test('match-list should display matches which marked in checkboxes', async () => {});
