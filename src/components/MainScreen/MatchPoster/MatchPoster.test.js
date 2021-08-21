import React from 'react';
import MatchPoster from './MatchPoster';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../__tests__/fixtures/leagues.test.json';
import { LocaleContext } from '../../LocaleContext';

let props;
const mockInsertEvent = jest.fn(() => ({
	execute: cb => {
		cb({ status: 'confirmed' });
	},
}));

const mockListEvent = jest.fn(async () => ({ result: { items: [] } }));

Date.prototype.addDays = function (days) {
	this.setTime(this.getTime() + days * 24 * 60 * 60 * 1000);
	return this;
};

Date.prototype.addHours = function (hours) {
	this.setTime(this.getTime() + hours * 60 * 60 * 1000);
	return this;
};

beforeEach(() => {
	props = {
		key: '01',
		homeTeam: leagues[0].teams[0],
		awayTeam: leagues[0].teams[1],
		time: new Date().addDays(4).toISOString(),
		status: 'SCHEDULED',
		todayDate: new Date(),
		leagueLogo: leagues[0].logo,
		showNotification: jest.fn(),
	};

	window.gapi = {
		client: {
			calendar: {
				events: {
					insert: mockInsertEvent,
					list: mockListEvent,
				},
			},
		},
		auth2: {
			getAuthInstance: () => ({
				isSignedIn: { get: () => true },
			}),
		},
	};
});

afterEach(cleanup);

it('should display team names', () => {
	const { queryByText } = render(<MatchPoster {...props} />);
	expect(queryByText(leagues[0].teams[0].name)).toBeInTheDocument();
	expect(queryByText(leagues[0].teams[1].name)).toBeInTheDocument();
});

it('should display teams logotypes and league logo', () => {
	const { queryAllByRole } = render(<MatchPoster {...props} />);
	expect(queryAllByRole('img')).toHaveLength(3);
});

it('should display icon when there is no logo', () => {
	props.homeTeam.logo = null;
	const { queryByTestId } = render(<MatchPoster {...props} />);
	expect(queryByTestId('fake-team-logo')).toBeInTheDocument(1);
});

describe('should display date of match depends on locale context', () => {
	const customRender = (ui, { providerProps, ...renderOptions }) => {
		return render(
			<LocaleContext.Provider {...providerProps}>{ui}</LocaleContext.Provider>,
			renderOptions
		);
	};

	test('ru', () => {
		props.time = `${new Date().getFullYear() + 1}-10-07T19:00:00Z`;
		const providerProps = {
			value: 'ru',
		};
		const { queryByText } = customRender(<MatchPoster {...props} />, { providerProps });
		expect(queryByText('7 октября')).toBeInTheDocument();
		expect(queryByText('22:00')).toBeInTheDocument(); // +3 UTC
	});

	test('en', () => {
		props.time = `${new Date().getFullYear() + 1}-10-07T19:00:00Z`;
		const providerProps = {
			value: 'en',
		};
		const { queryByText } = customRender(<MatchPoster {...props} />, { providerProps });
		expect(queryByText('October 7')).toBeInTheDocument();
		expect(queryByText('10:00 PM')).toBeInTheDocument(); // +3 UTC
	});
});

it('should display day labels depends on match date', () => {
	const { queryByText, rerender } = render(<MatchPoster {...props} />);
	expect(queryByText('live')).not.toBeInTheDocument();
	expect(queryByText('today')).not.toBeInTheDocument();
	expect(queryByText('tomorrow')).not.toBeInTheDocument();
	props.status = 'IN_PLAY';
	rerender(<MatchPoster {...props} />);
	expect(queryByText('live')).toBeInTheDocument();
	expect(queryByText('today')).not.toBeInTheDocument();
	expect(queryByText('tomorrow')).not.toBeInTheDocument();
	props.status = 'SCHEDULED';
	props.time = new Date().addDays(1).toISOString();
	rerender(<MatchPoster {...props} />);
	expect(queryByText('live')).not.toBeInTheDocument();
	expect(queryByText('today')).not.toBeInTheDocument();
	expect(queryByText('tomorrow')).toBeInTheDocument();
	props.time = new Date().toISOString();
	rerender(<MatchPoster {...props} />);
	expect(queryByText('live')).not.toBeInTheDocument();
	expect(queryByText('today')).toBeInTheDocument();
	expect(queryByText('tomorrow')).not.toBeInTheDocument();
});

it('should add event to the calendar after click', async () => {
	const { queryByTestId } = render(<MatchPoster {...props} />);
	const button = queryByTestId('add-event-button');
	fireEvent.click(button);
	await waitFor(() => expect(mockListEvent).toHaveBeenCalled());
	expect(mockInsertEvent).toHaveBeenCalled();
});
