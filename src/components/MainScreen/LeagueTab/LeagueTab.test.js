import React from 'react';
import LeagueTab from './LeagueTab';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

let props;

beforeEach(() => {
	const league = {
		name: 'English Premier League',
		logo: 'https://media.api-sports.io/football/leagues/39.png',
		loading: false,
		status: 'checked',
		teams: [],
		matches: [],
		toggleLeagueVisibility: jest.fn(),
	};

	props = {
		league,
	};
});

afterEach(cleanup);

it('should display loader while loading', () => {
	props.league.loading = true;
	const { queryByTestId, rerender } = render(<LeagueTab {...props} />);
	expect(queryByTestId('league-tab-loader')).not.toBeNull();
	props.league.loading = false;
	rerender(<LeagueTab {...props} />);
	expect(queryByTestId('loader')).toBeNull();
});

it('should display league logo', () => {
	const { queryByAltText, getByAltText } = render(<LeagueTab {...props} />);
	expect(queryByAltText(`${props.league.name} logo`)).toBeInTheDocument();
	expect(getByAltText(`${props.league.name} logo`).src).toBe(props.league.logo);
});

describe('should display checkbox which state depends on props', () => {
	it('checked', () => {
		const { queryByTestId, getByTestId } = render(<LeagueTab {...props} />);
		expect(queryByTestId('league-tab-checkbox')).toBeInTheDocument();
		expect(getByTestId('league-tab-checkbox').className).toContain('checked');
	});

	it('indeterminate', () => {
		props.league.status = 'indeterminate';
		const { queryByTestId, getByTestId } = render(<LeagueTab {...props} />);
		expect(queryByTestId('league-tab-checkbox')).toBeInTheDocument();
		expect(getByTestId('league-tab-checkbox').className).toContain('indeterminate');
	});

	it('unchecked', () => {
		props.league.status = 'unchecked';
		const { queryByTestId, getByTestId } = render(<LeagueTab {...props} />);
		expect(queryByTestId('league-tab-checkbox')).toBeInTheDocument();
		expect(getByTestId('league-tab-checkbox').className).not.toContain('indeterminate');
		expect(getByTestId('league-tab-checkbox').className).not.toContain('checked');
	});
});

it('should invoke store action on click', () => {
	const { queryByTestId } = render(<LeagueTab {...props} />);
	expect(props.league.toggleLeagueVisibility).not.toBeCalled();
	fireEvent.click(queryByTestId('league-tab-checkbox').children[0]);
	expect(props.league.toggleLeagueVisibility).toBeCalled();
});

it('should display alert icon when object is null', () => {
	props.league = null;
	const { queryByTestId } = render(<LeagueTab {...props} />);
	expect(queryByTestId('league-tab-loader')).toBeNull();
	expect(queryByTestId('league-tab')).toBeNull();
	expect(queryByTestId('league-tab-alert')).not.toBeNull();
});
