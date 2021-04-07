import React from 'react';
import League from './League';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../../mock/leagues.test.json';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import cloneDeep from 'lodash/cloneDeep';

Enzyme.configure({ adapter: new Adapter() });

let props;
let league = leagues[0];

let fn = jest.fn(function () {});

beforeEach(() => {
	props = {
		league: cloneDeep(league),
		status: 'checked',
		onChangeLeague: fn,
	};
});

afterEach(() => {
	cleanup();
});

test('league name and checkbox displaying', () => {
	render(<League {...props}></League>);

	expect(screen.getByRole('img')).not.toBeNull();
	expect(screen.getByTestId('input').children[0]).not.toBeNull();
});

describe('Test behaviour after click', () => {
	test('handlers invocation after click', () => {
		render(<League {...props}></League>);
		const element = screen.getByTestId('input');
		fireEvent.click(element.children[0]); // cause of Semantic UI
		expect(fn.mock.calls.length).toEqual(1);
	});

	test('changing props responsible for displaying', () => {
		let wrapper = shallow(<League {...props}></League>);
		let checkbox = wrapper.find('Checkbox');
		expect(wrapper.instance().props.league.status).toEqual('checked');
		checkbox.props().onChange();
		expect(wrapper.instance().props.league.status).toEqual('unchecked');
	});

	test('changing quantity of showed teams', () => {
		let wrapper = shallow(<League {...props}></League>);
		let checkbox = wrapper.find('Checkbox');
		expect(wrapper.instance().props.league.teamsShowed).toEqual(props.league.teams.length);
		checkbox.props().onChange();
		expect(wrapper.instance().props.league.teamsShowed).toEqual(0);
	});
});

test('is league unchecked after changing its prop and is its team not in the list', () => {
	props.league.status = 'unchecked';

	render(<League {...props}></League>);

	expect(screen.getByTestId('input').children[0].checked).toEqual(false);
	expect(screen.queryByText(league.teams[0].name)).not.toBeInTheDocument();
});
