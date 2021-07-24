import React from 'react';
import SelectionArea from './SelectionArea';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../mock/leagues.test.json';

beforeEach(() => {});

afterEach(cleanup);

it('should display panes', () => {});

it('should make team checkbox inactive when team doesnt have matches', () => {});

it('should invoke handler when changed', () => {});

it('should display placeholder while teams loading', () => {});
