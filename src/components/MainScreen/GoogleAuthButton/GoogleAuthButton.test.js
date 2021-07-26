import React from 'react';
import GoogleAuthButton from './GoogleAuthButton';
import { render, cleanup, act, screen, findByRole } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

let isSignedIn, props, parent;
const mockInit = jest.fn();
const mockLoad = jest.fn((str, cb) => {
	act(() => {
		cb();
	});
});

beforeEach(() => {
	parent = () => {};
	parent.current = {
		children: [{ offsetWidth: 95 }, { offsetWidth: 95 }],
		offsetWidth: 400,
	};
	props = {
		parent,
	};

	isSignedIn = { get: () => false };

	window.gapi = {
		load: mockLoad,
		client: {
			init: mockInit,
		},
		auth2: {
			getAuthInstance: () => ({
				isSignedIn,
				currentUser: { get: () => ({ getBasicProfile: () => ({ getName: () => 'User Name' }) }) },
			}),
		},
	};
});

afterEach(cleanup);

it('should run auth process', () => {
	expect(mockLoad).not.toHaveBeenCalled();
	render(<GoogleAuthButton {...props}></GoogleAuthButton>);
	expect(mockLoad).toHaveBeenCalled();
	expect(mockInit).toHaveBeenCalled();
});

it('should display text when user logged out', async () => {
	const { queryByText, findAllByRole } = render(<GoogleAuthButton {...props}></GoogleAuthButton>);
	await findAllByRole('listbox')
		.catch(e => {})
		.finally(() => {
			expect(queryByText('Sign In')).not.toBeNull();
			expect(queryByText('User Name')).toBeNull();
		});
});

it('should display name when user logged in', async () => {
	let queryByText;
	isSignedIn = { get: () => true };
	queryByText = render(<GoogleAuthButton {...props}></GoogleAuthButton>).queryByText;
	await screen.findByRole('listbox');
	expect(queryByText('User Name')).not.toBeNull();
	expect(queryByText('Sign In')).toBeNull();
});

it('should change size depends on available space in parent container', () => {
	let queryByText;
	parent.current.offsetWidth = 200;
	queryByText = render(<GoogleAuthButton {...props}></GoogleAuthButton>).queryByText;
	expect(queryByText('Sign In')).toBeNull();
	expect(queryByText('User Name')).toBeNull();
});
