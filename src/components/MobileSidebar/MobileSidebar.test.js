import React from 'react';
import MobileSidebar from './MobileSidebar';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

beforeEach(() => {});

afterEach(cleanup);

const Environment = () => (
	<MobileSidebar
		sidebarContent={<div data-testid="sidebar-content" />}
		sidebarVisible={false}
		sidebarToggle={() => {}}>
		<div data-testid="main-content" />
	</MobileSidebar>
);

it('should contain sidebar in the dom in mobile mode', () => {
	window.innerWidth = 500;
	const { queryByTestId } = render(<Environment />);
	expect(queryByTestId('main-content')).toBeInTheDocument();
	expect(queryByTestId('sidebar-content')).toBeInTheDocument();
});

it('should not contain sidebar in the dom out of mobile mode', () => {
	window.innerWidth = 1024;
	const { queryByTestId } = render(<Environment />);
	expect(queryByTestId('main-content')).toBeInTheDocument();
	expect(queryByTestId('sidebar-content')).not.toBeInTheDocument();
});
