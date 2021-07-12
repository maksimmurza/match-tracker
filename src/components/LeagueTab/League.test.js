import React from 'react';
import League from './League';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../mock/leagues.test.json';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import cloneDeep from 'lodash/cloneDeep';

Enzyme.configure({ adapter: new Adapter() });

let props;
let league = leagues[0];
let onChangeLeague = jest.fn();

beforeEach(() => {
	props = {
		league: cloneDeep(league),
		status: 'checked',
		onChangeLeague,
	};
});

afterEach(() => {
	cleanup();
});

test('league name and checkbox displaying', () => {
	render(<League {...props}></League>);

	expect(screen.getByRole('img')).not.toBeNull();
	expect(screen.getByTestId('leagueCheckbox').children[0]).not.toBeNull();
});

describe('Test click on league checkbox', () => {
	let leagueCheckbox;

	beforeEach(() => {
		render(<League {...props}></League>);
		leagueCheckbox = screen.getByTestId('leagueCheckbox').children[0];
	});

	test('handlers invocation after click', () => {
		expect(onChangeLeague).not.toHaveBeenCalled();
		fireEvent.click(leagueCheckbox);
		expect(onChangeLeague).toHaveBeenCalled();
	});

	test('checkbox status', () => {
		const leagueComponentWrapper = shallow(<League {...props}></League>);
		expect(leagueComponentWrapper.instance().props.league.status).toEqual('checked');
		fireEvent.click(leagueCheckbox);
		expect(onChangeLeague.mock.calls[0][0].status).toEqual('unchecked');
		expect(leagueComponentWrapper.instance().props.league.status).toEqual('unchecked');
	});

	test('showed teams', () => {
		const leagueComponentWrapper = shallow(<League {...props}></League>);
		expect(leagueComponentWrapper.instance().props.league.teamsShowed).toEqual(props.league.teams.length);
		fireEvent.click(leagueCheckbox);
		expect(onChangeLeague.mock.calls[2][0].teamsShowed).toEqual(0);
		expect(leagueComponentWrapper.instance().props.league.teamsShowed).toEqual(0);
	});
});

test('is league unchecked after changing its prop and is its team not in the list', () => {
	props.league.status = 'unchecked';

	render(<League {...props}></League>);

	expect(screen.getByTestId('leagueCheckbox').children[0].checked).toEqual(false);
	expect(screen.queryByText(league.teams[0].name)).not.toBeInTheDocument();
});
