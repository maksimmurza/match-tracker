import React from 'react';
import QuantityInput from './QuantityInput';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

let props;

beforeEach(() => {
	props = {
		value: 15,
		onChange: jest.fn(value => value),
	};
});

afterEach(cleanup);

it('should display current quantity depends on prop', () => {
	const { queryByDisplayValue, rerender } = render(<QuantityInput {...props} />);
	expect(queryByDisplayValue(props.value)).not.toBeNull();
	props.value = 10;
	rerender(<QuantityInput {...props} />);
	expect(queryByDisplayValue(10)).not.toBeNull();
});

it('should invoke handler with arguments when changed', () => {
	const { queryByDisplayValue } = render(<QuantityInput {...props} />);
	const input = queryByDisplayValue(props.value);
	expect(props.onChange).not.toHaveBeenCalled();
	fireEvent.change(input, { target: { value: '5' } });
	expect(props.onChange).toHaveBeenCalledTimes(1);
	expect(props.onChange.mock.calls[0][0]).toBe(5);
});
