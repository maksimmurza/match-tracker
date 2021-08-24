import React from 'react';
import LeagueStore from './LeagueStore';
import TeamStore from '../TeamStore/TeamStore';
import leagues from '../../__tests__/fixtures/leagues.test.json';
import cloneDeep from 'lodash/cloneDeep';

let league;

beforeEach(() => {
	league = new LeagueStore(leagues[0].id);
	league.name = leagues[0].name;
	league.country = leagues[0].country;
	league.logo = leagues[0].logo;
	league.matches = cloneDeep(leagues[0].matches);
	league.matches.forEach(match => (match.leagueLogo = league.logo));
	league.teams = leagues[0].teams.map(team => {
		let newTeam = new TeamStore(team.id, team.name, team.country, team.logo, team.leagueName, team.show);
		return newTeam;
	});
});

afterEach(() => {
	league = null;
});

it('should resolve teams names', () => {
	league.matches.forEach(match => {
		expect(league.teams.some(team => team === match.homeTeam)).toBeFalsy();
		expect(league.teams.some(team => team === match.awayTeam)).toBeFalsy();
	});
	league.resolveTeamsNames();
	league.matches.forEach(match => {
		expect(league.teams.some(team => team === match.homeTeam)).toBeTruthy();
		expect(league.teams.some(team => team === match.awayTeam)).toBeTruthy();
	});
});

it('should count teams having matches', () => {
	league.resolveTeamsNames();
	league.teams.forEach(team => team.resolveMatches(league.matches));
	expect(league.activeTeams).toBe(0);
	league.resolveActiveTeams();
	expect(league.activeTeams).toBe(4);
});

it('should toggle visibility', () => {
	league.resolveTeamsNames();
	league.teams.forEach(team => team.resolveMatches(league.matches));
	league.resolveActiveTeams();
	league.toggleLeagueVisibility();
	league.teams.forEach(team => {
		expect(team.show).toBeFalsy();
	});
	league.toggleLeagueVisibility();
	league.teams.forEach(team => {
		expect(team.show).toBeTruthy();
	});
});

it('should filter showed teams', () => {
	league.resolveTeamsNames();
	league.teams.forEach(team => team.resolveMatches(league.matches));
	league.resolveActiveTeams();
	expect(league.teamsShowed).toBe(4);
	league.teams[0].show = false;
	expect(league.teamsShowed).toBe(3);
	league.toggleLeagueVisibility();
	expect(league.teamsShowed).toBe(0);
});

it('should calculate league status', () => {
	league.resolveTeamsNames();
	league.teams.forEach(team => team.resolveMatches(league.matches));
	league.resolveActiveTeams();
	expect(league.status).toBe('checked');
	league.teams[0].show = false;
	expect(league.status).toBe('indeterminate');
	league.toggleLeagueVisibility();
	expect(league.status).toBe('unchecked');
});

it('should serialize class instance', () => {
	league.resolveTeamsNames();
	league.teams.forEach(team => team.resolveMatches(league.matches));
	league.resolveActiveTeams();
	const serialized = league.toJSON();
	expect(serialized).toHaveProperty('id');
	expect(serialized).toHaveProperty('name');
	expect(serialized).toHaveProperty('country');
	expect(serialized).toHaveProperty('logo');
	expect(serialized).toHaveProperty('activeTeams');
	expect(serialized).toHaveProperty('matches');
	expect(serialized).toHaveProperty('teams');
	expect(serialized.teams).toHaveLength(4);
	expect(serialized.matches).toHaveLength(2);
});
