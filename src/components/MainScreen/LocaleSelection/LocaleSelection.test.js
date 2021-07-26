import React from 'react';
import LocaleSelection from './LocaleSelection';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

let props;

beforeEach(() => {
	props = { value: 'ru', onChange: jest.fn() };
});

afterEach(cleanup);

it('should contain two options', () => {
	const { queryAllByRole } = render(<LocaleSelection {...props} />);
	const options = queryAllByRole('option');
	expect(options.length).toBe(2);
});

it('should display current locale depends on prop', () => {
	const { queryByRole } = render(<LocaleSelection {...props} />);
	const select = queryByRole('listbox');
	expect(select.firstChild.textContent).toBe(props.value);
});

it('should invoke handler with arguments when locale is changed', () => {
	const { queryByText } = render(<LocaleSelection {...props} />);
	expect(props.onChange).not.toHaveBeenCalled();
	fireEvent.click(queryByText('en'));
	expect(props.onChange).toHaveBeenCalledTimes(1);
	expect(props.onChange.mock.calls[0].length).toBe(2);
	expect(props.onChange.mock.calls[0][1].value).toBe('en');
});
