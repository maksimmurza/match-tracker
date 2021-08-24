import React from 'react';
import LeaguesStore from './LeaguesStore';
import LeagueStore from '../LeagueStore/LeagueStore';
import leagues from '../../__tests__/fixtures/leagues.test.json';
import currentLeagues from '../../__tests__/fixtures/currentLeagues.test.json';
import PLScheduled from '../../__tests__/fixtures/PLScheduled.test.json';
import PLLive from '../../__tests__/fixtures/PLLive.test.json';
import PDScheduled from '../../__tests__/fixtures/PDScheduled.test.json';
import PDLive from '../../__tests__/fixtures/PDLive.test.json';
import PLTeamsInfo from '../../__tests__/fixtures/PLTeamsInfo.test.json';
import PDTeamsInfo from '../../__tests__/fixtures/PDTeamsInfo.test.json';
import cloneDeep from 'lodash/cloneDeep';
import { getCurrentLeagues, getSchedule, getTeamsInfo } from '../../utils/fetchData';
import { LEAGUES_KEYS } from '../../utils/requestOptions';

jest.mock('../../utils/fetchData', () => ({
	...jest.requireActual('../../utils/fetchData'),
	getCurrentLeagues: jest.fn(),
	getSchedule: jest.fn(),
	getTeamsInfo: jest.fn(),
}));

jest.mock('../../utils/requestOptions', () => ({
	...jest.requireActual('../../utils/requestOptions'),
	LEAGUES_KEYS: ['PL/', 'PD/'],
}));

it('should create array', () => {
	const leaguesStore = new LeaguesStore();
	expect(leaguesStore.leagues).toBeInstanceOf(Array);
});

it('should receive data from local storage', async () => {
	const leaguesStore = new LeaguesStore();
	await leaguesStore.getLeaguesFromLocal(cloneDeep(leagues));
	expect(leaguesStore.leagues).toHaveLength(leagues.length);
	leaguesStore.leagues.forEach(league => {
		expect(league).toBeInstanceOf(LeagueStore);
	});
});

it('should receive data from API', async () => {
	getCurrentLeagues.mockResolvedValueOnce(currentLeagues.api.leagues);
	getSchedule
		.mockResolvedValueOnce(PLScheduled)
		.mockResolvedValueOnce(PLLive)
		.mockResolvedValueOnce(PDScheduled)
		.mockResolvedValueOnce(PDLive);
	getTeamsInfo.mockResolvedValueOnce(PLTeamsInfo.api.teams).mockResolvedValueOnce(PDTeamsInfo.api.teams);
	const leaguesStore = new LeaguesStore();
	await leaguesStore.getLeaguesFromAPI();
	expect(leaguesStore.leagues).toHaveLength(leagues.length);
	leaguesStore.leagues.forEach(league => {
		expect(league).toBeInstanceOf(LeagueStore);
	});
});
