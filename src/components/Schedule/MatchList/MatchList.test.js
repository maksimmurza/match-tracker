import React from 'react';
import MatchList from './MatchList';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../mock/leagues.test.json';
import cloneDeep from 'lodash/cloneDeep';
import shallow from 'enzyme/shallow';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

let props;

beforeEach(() => {
	props = {
		leagues: cloneDeep(leagues),
		quantity: 15,
		todayDate: new Date(),
	};
});

afterEach(() => {
	cleanup();
});

test('initial displaying of all matches', () => {
	render(<MatchList {...props}></MatchList>);

	expect(screen.getAllByAltText('Team logo').length).toBe(
		leagues[0].teams.length + leagues[1].teams.length
	);
	expect(screen.getByText(leagues[0].teams[0].name)).not.toBeNull();
});

describe('Test selection of showed leagues and matches', () => {
	test('when teams unchecked', () => {
		props.leagues[0].matches[0].homeTeam.show = false;
		props.leagues[0].matches[0].awayTeam.show = false;

		render(<MatchList {...props}></MatchList>);

		expect(screen.queryByText(leagues[0].teams[0].name)).not.toBeInTheDocument();
	});

	test('when league unchecked', () => {
		props.leagues[0].status = 'uncheck';

		render(<MatchList {...props}></MatchList>);

		expect(screen.getAllByAltText('Team logo').length).toBe(leagues[1].teams.length);
	});
});

test('sorting by date and time', () => {
	let wrapper = shallow(<MatchList {...props}></MatchList>);

	let first = { utcDate: '2020-01-01T20:20:00.00Z' },
		second = { utcDate: '2021-03-01T20:20:00.00Z' },
		third = { utcDate: '2021-03-10T20:20:00.00Z' },
		fourth = { utcDate: '2021-04-01T20:20:00.00Z' },
		fifth = { utcDate: '2021-04-01T21:20:00.00Z' };

	let sorted = [first, second, third, fourth, fifth];
	let arr = [fourth, first, third, second, fifth];

	let instance = wrapper.instance();
	let result = arr.sort(instance.sortByTime);

	result.forEach((date, i) => {
		expect(date.utcDate).toBe(sorted[i].utcDate);
	});
});
