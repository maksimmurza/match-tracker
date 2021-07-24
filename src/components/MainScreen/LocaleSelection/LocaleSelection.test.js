import React from 'react';
import LocaleSelection from './LocaleSelection';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../mock/leagues.test.json';

beforeEach(() => {});

afterEach(cleanup);

it('should display current locale depends on prop', () => {});

it('should invoke handler when locale is changed', () => {});
