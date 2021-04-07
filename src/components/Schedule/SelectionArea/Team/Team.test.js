import React from 'react';
import Team from './Team';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../../mock/leagues.test.json';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

let team = leagues[0].teams[1];

let fn = jest.fn(function () {
	this.team.show = !this.team.show;
});

let props = {
	key: team.team_id,
	team: team,
	onChangeTeam: fn,
};

afterEach(() => {
	cleanup();
});

test('team name and checkbox displaying', () => {
	render(<Team {...props}></Team>);

	expect(screen.queryByText(team.name)).not.toBeNull();
	expect(
		shallow(<Team {...props}></Team>)
			.find('Checkbox')
			.props().checked
	).toEqual(true);
});

describe('Test checkbox click', () => {
	beforeEach(() => {
		props.team.show = true;
	});

	test('function invocation after click', () => {
		render(<Team {...props}></Team>);
		const element = screen.getByTestId('input');
		fireEvent.click(element.children[0]); // cause of Semantic UI
		expect(fn.mock.calls.length).toEqual(1);
	});

	test('changing props', () => {
		let wrapper = shallow(<Team {...props}></Team>);
		let checkbox = wrapper.find('Checkbox');
		expect(wrapper.instance().props.team.show).toEqual(true);
		checkbox.props().onChange();
		expect(wrapper.instance().props.team.show).toEqual(false);
	});
});
