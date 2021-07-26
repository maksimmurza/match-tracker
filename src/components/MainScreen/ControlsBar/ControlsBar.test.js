import React from 'react';
import ControlsBar from './ControlsBar';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

let props;

beforeEach(() => {
	props = {
		values: { quantity: 15, locale: 'ru' },
		handlers: { setQuantity: jest.fn(), setLocale: jest.fn(), sidebarToggle: jest.fn() },
	};

	window.gapi = {
		load: jest.fn(),
		client: {
			init: jest.fn(),
		},
		auth2: {
			getAuthInstance: () => ({
				isSignedIn: jest.fn(),
				currentUser: { get: () => ({ getBasicProfile: () => ({ getName: () => 'User Name' }) }) },
			}),
		},
	};
});

afterEach(cleanup);

it('should render quantity input, locale selection and google auth button', () => {
	const { queryByTestId } = render(<ControlsBar {...props} />);
	expect(queryByTestId('quantity-input')).toBeInTheDocument();
	expect(queryByTestId('locale-selection')).toBeInTheDocument();
	expect(queryByTestId('google-auth-button')).toBeInTheDocument();
});

it('should not display toggle sidebar button on a big screen', () => {
	const { queryByTestId } = render(<ControlsBar {...props} />);
	const toggleButton = queryByTestId('toggle-sidebar-button');
	expect(toggleButton).toHaveStyle('display: none');
});

// it('should display toggle sidebar button only on mobile', () => {
// 	window.innerWidth = 500;
// 	const { queryByTestId } = render(<ControlsBar {...props} />);
// 	const toggleButton = queryByTestId('toggle-sidebar-button');
// 	expect(toggleButton).not.toHaveStyle('display: none');
// });
