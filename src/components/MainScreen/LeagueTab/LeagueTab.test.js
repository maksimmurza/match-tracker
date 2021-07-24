import React from 'react';
import LeagueTab from './LeagueTab';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../mock/leagues.test.json';

beforeEach(() => {});

afterEach(cleanup);

it('should display loader while loading', () => {});

it('should display league logo', () => {});

it('should display checkbox which state depends on props', () => {});

it('should invoke store action on click', () => {});

it('should display alert icon when object is null', () => {});
