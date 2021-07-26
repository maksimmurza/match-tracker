import React from 'react';
import MatchList from './MatchList';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../__tests__/mock/leagues.test.json';
import cloneDeep from 'lodash/cloneDeep';
import { observable } from 'mobx';

let props;

const mockMatchPoster = jest.fn();
jest.mock('../MatchPoster/MatchPoster', () => props => {
	mockMatchPoster(props);
	return <mockMatchPoster {...props} data-testid="match" />;
});

beforeEach(() => {
	props = {
		leagues: cloneDeep(leagues).map(l => observable(l)),
		quantity: 15,
		todayDate: new Date(),
	};
});

afterEach(() => {
	jest.clearAllMocks();
	cleanup();
});

it('should display loader while loading', () => {
	props.leagues.forEach(league => (league.loading = true));
	const { queryByTestId, rerender } = render(<MatchList {...props} />);
	expect(queryByTestId('matchList-loader')).not.toBeNull();
	props.leagues.forEach(league => (league.loading = false));
	rerender(<MatchList {...props} />);
	expect(queryByTestId('matchList-loader')).toBeNull();
});

it('should display matches', () => {
	const { queryAllByTestId } = render(<MatchList {...props} />);
	expect(queryAllByTestId('match')).toHaveLength(4);
});

it('should consider display status of league or match', () => {
	props.leagues[0].status = 'unchecked';
	props.leagues[1].status = 'indeterminate';
	props.leagues[1].matches[0].homeTeam.show = false;
	props.leagues[1].matches[0].awayTeam.show = false;
	const { queryAllByTestId } = render(<MatchList {...props} />);
	expect(queryAllByTestId('match')).toHaveLength(1);
});

it('should display matches in right order depends on date', () => {
	render(<MatchList {...props} />);
	const calls = mockMatchPoster.mock.calls;
	const dates = calls.reduce((dates, call) => dates.concat(call[0].time), []);

	for (let i = 0; i < dates.length - 1; i++) {
		const currentDate = new Date(dates[i]);
		const nextDate = new Date(dates[i + 1]);
		expect(nextDate >= currentDate).toBeTruthy();
	}
});

it('should display message when nothing to show', () => {
	const { queryByText, rerender } = render(<MatchList {...props} />);
	expect(queryByText('No matches to show')).not.toBeInTheDocument();
	props.leagues.forEach(league => (league.status = 'unchecked'));
	rerender(<MatchList {...props} />);
	expect(queryByText('No matches to show')).toBeInTheDocument();
});
