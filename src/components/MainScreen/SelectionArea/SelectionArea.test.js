import React from 'react';
import SelectionArea from './SelectionArea';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../__tests__/fixtures/leagues.test.json';
import cloneDeep from 'lodash/cloneDeep';
import { observable } from 'mobx';

let props;

beforeEach(() => {
	props = {
		leagues: observable(cloneDeep(leagues)),
	};
});

afterEach(cleanup);

it('should display tabs and pane', () => {
	const { queryAllByTestId, queryByTestId } = render(<SelectionArea {...props} />);
	expect(queryAllByTestId('league-tab')).toHaveLength(leagues.length);
	expect(queryByTestId('league-pane')).toBeInTheDocument();
});

it('should display placeholder while teams loading', () => {
	props = {
		...props,
		leagues: observable([{ ...props.leagues[0], teams: [], loading: true }, ...props.leagues.slice(1)]),
	};
	const { queryByTestId, rerender } = render(<SelectionArea {...props} />);
	expect(queryByTestId('teams-placeholder')).toBeInTheDocument();
	props = {
		...props,
		leagues: observable([{ ...props.leagues[0], loading: false }, ...props.leagues.slice(1)]),
	};
	rerender(<SelectionArea {...props} />);
	expect(queryByTestId('teams-placeholder')).not.toBeInTheDocument();
});

it('should place teams that doesnt have matches after active teams', () => {
	props.leagues[0].teams[0].hasMatches = false;
	props.leagues[0].teams[1].hasMatches = false;
	const { queryAllByTestId } = render(<SelectionArea {...props} />);
	const teamsNames = queryAllByTestId('team-checkbox').map(el => el.textContent.trim());
	expect(teamsNames.findIndex(name => name === props.leagues[0].teams[0].name)).toBeGreaterThan(1);
	expect(teamsNames.findIndex(name => name === props.leagues[0].teams[1].name)).toBeGreaterThan(1);
});

it('should display warning inside pane when there are no teams', () => {
	props.leagues[0].teams = [];
	const { queryByText } = render(<SelectionArea {...props} />);
	expect(queryByText('There are no teams to show')).toBeInTheDocument();
});
