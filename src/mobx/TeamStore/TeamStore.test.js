import React from 'react';
import TeamStore from './TeamStore';
import leagues from '../../__tests__/fixtures/leagues.test.json';

let team, mockWriteLocal;
const { name, country, logo, leagueName, show } = leagues[0].teams[0];
const args = ['01', name, country, logo, leagueName, show];

beforeEach(() => {
	team = new TeamStore(...args);
	mockWriteLocal = jest.fn();
	team.writeLeaguesLocal = mockWriteLocal;
});

afterEach(() => {
	team = null;
});

it('should find out if team have a match', () => {
	const matches = leagues[0].matches;
	matches[0].homeTeam = team;
	team.resolveMatches(matches);
	expect(team.hasMatches).toBeTruthy();
	matches[0].homeTeam = {};
	team.resolveMatches(matches);
	expect(team.hasMatches).toBeFalsy();
});

it('should toggle visibility', () => {
	expect(team.show).toBeTruthy();
	team.toggleTeamVisibility();
	expect(team.show).toBeFalsy();
	team.toggleTeamVisibility();
	expect(team.show).toBeTruthy();
});

it('should write changes local after toggling visibility', () => {
	expect(mockWriteLocal).not.toHaveBeenCalled();
	team.toggleTeamVisibility();
	expect(mockWriteLocal).toHaveBeenCalled();
});
