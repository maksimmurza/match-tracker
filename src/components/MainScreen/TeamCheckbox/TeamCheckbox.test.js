import React from 'react';
import TeamCheckbox from './TeamCheckbox';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../__tests__/fixtures/leagues.test.json';
import cloneDeep from 'lodash/cloneDeep';
import { observable } from 'mobx';

let props, mockToggleVisibility;

beforeEach(() => {
	mockToggleVisibility = jest.fn();
	props = {
		team: observable({ ...cloneDeep(leagues[0].teams[0]), toggleTeamVisibility: mockToggleVisibility }),
	};
});

afterEach(cleanup);

it('should display team name', () => {
	const { queryByText } = render(<TeamCheckbox {...props} />);
	expect(queryByText(props.team.name)).toBeInTheDocument();
});

it('should display checkbox which state depends on props', () => {
	const { queryByRole, rerender } = render(<TeamCheckbox {...props} />);
	expect(queryByRole('checkbox').checked).toBeTruthy();
	props.team = observable({ ...props.team, show: false });
	rerender(<TeamCheckbox {...props} />);
	expect(queryByRole('checkbox').checked).toBeFalsy();
});

it('should make checkbox disabled when team does not have matches', () => {
	const { queryByRole, rerender } = render(<TeamCheckbox {...props} />);
	expect(queryByRole('checkbox').disabled).toBeFalsy();
	props.team = observable({ ...props.team, hasMatches: false });
	rerender(<TeamCheckbox {...props} />);
	expect(queryByRole('checkbox').disabled).toBeTruthy();
});

it('should invoke store action on checkbox click', () => {
	const { queryByRole } = render(<TeamCheckbox {...props} />);
	expect(mockToggleVisibility).not.toHaveBeenCalled();
	fireEvent.click(queryByRole('checkbox'));
	expect(mockToggleVisibility).toHaveBeenCalled();
});
