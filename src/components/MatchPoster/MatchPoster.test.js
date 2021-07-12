import React from 'react';
import { MatchPoster } from './MatchPoster';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'regenerator-runtime/runtime';

let date = new Date();
date.setDate(date.getDate() + 7);
let today = new Date();
let liveLabel;
let todayLabel;
let tomorrowLabel;

afterEach(() => {
	cleanup();
});

let props = {
	key: '01',
	homeTeam: {
		name: 'Barcelona',
		logo: 'https://media.api-sports.io/football/teams/529.png',
	},
	awayTeam: {
		name: 'Real Madrid',
		logo: 'https://media.api-sports.io/football/teams/541.png',
	},
	time: date.toISOString(),
	status: 'SCHEDULED',
	todayDate: today,
	leagueLogo: 'https://media.api-sports.io/football/leagues/140.png',
};

test('teams names displaying', () => {
	render(<MatchPoster {...props}></MatchPoster>);

	expect(screen.getByText('Barcelona')).not.toBeNull();
	expect(screen.getByText('Real Madrid')).not.toBeNull();
});

test('date and time displaying', () => {
	render(<MatchPoster {...props}></MatchPoster>);

	let dateStr = date.toLocaleDateString('ru', {
		month: 'long',
		day: 'numeric',
	});
	let timeStr = date.toLocaleTimeString('ru', {
		hour: 'numeric',
		minute: 'numeric',
	});

	expect(screen.getByText(dateStr)).not.toBeNull(); //date
	expect(screen.getByText(timeStr)).not.toBeNull(); //time
});

describe('Test labels', () => {
	test('schedeled after week, no labels', () => {
		render(<MatchPoster {...props}></MatchPoster>);

		liveLabel = screen.queryByText('live');
		todayLabel = screen.queryByText('today');
		tomorrowLabel = screen.queryByText('tomorrow');

		expect(liveLabel).not.toBeInTheDocument();
		expect(todayLabel).not.toBeInTheDocument();
		expect(tomorrowLabel).not.toBeInTheDocument();
	});

	test('scheduled today', () => {
		date = new Date();
		props.time = date.toISOString();
		render(<MatchPoster {...props}></MatchPoster>);

		liveLabel = screen.queryByText('live');
		todayLabel = screen.queryByText('today');
		tomorrowLabel = screen.queryByText('tomorrow');

		expect(liveLabel).not.toBeInTheDocument();
		expect(todayLabel).not.toBeNull();
		expect(tomorrowLabel).not.toBeInTheDocument();
	});

	test('scheduled tomorrow', () => {
		date.setDate(date.getDate() + 1);
		props.time = date.toISOString();
		render(<MatchPoster {...props}></MatchPoster>);

		liveLabel = screen.queryByText('live');
		todayLabel = screen.queryByText('today');
		tomorrowLabel = screen.queryByText('tomorrow');

		expect(liveLabel).not.toBeInTheDocument();
		expect(todayLabel).not.toBeInTheDocument();
		expect(tomorrowLabel).not.toBeNull();
	});

	test('live match', () => {
		props.status = 'IN_PLAY';
		props.time = new Date().toISOString();
		render(<MatchPoster {...props}></MatchPoster>);

		liveLabel = screen.queryByText('live');
		todayLabel = screen.queryByText('today');
		tomorrowLabel = screen.queryByText('tomorrow');

		expect(liveLabel).not.toBeNull();
		expect(todayLabel).not.toBeInTheDocument();
		expect(tomorrowLabel).not.toBeInTheDocument();
	});
});

test('logotypes displaying', () => {
	render(<MatchPoster {...props}></MatchPoster>);

	let logotypes = screen.queryAllByRole('img');

	logotypes.forEach(logo => {
		expect(logo.getAttribute('src').includes('https://media.api-sports.io')).toBeTruthy();
	});
});
