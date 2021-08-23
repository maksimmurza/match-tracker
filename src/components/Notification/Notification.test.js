import React from 'react';
import notificationable from './Notification';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

jest.setTimeout(15000);

const header = 'New Notification';
const content = 'Some text';
const NotificationableComponent = notificationable(props => (
	<button onClick={() => props.showNotification('', header, content)}>Show</button>
));
const Environment = () => (
	<>
		<NotificationableComponent />
		<div id="notification-area"></div>
	</>
);

afterEach(cleanup);

it('should display notification with some header and text and hide it after 10s delay', async () => {
	const { queryByText } = render(<Environment />);
	fireEvent.click(queryByText('Show'));
	expect(queryByText(header)).toBeInTheDocument();
	expect(queryByText(content)).toBeInTheDocument();
	await new Promise(r => setTimeout(r, 10000));
	expect(queryByText(header)).not.toBeInTheDocument();
	expect(queryByText(content)).not.toBeInTheDocument();
});
