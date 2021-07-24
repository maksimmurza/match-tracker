import React from 'react';
import MatchPoster from './MatchPoster';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../mock/leagues.test.json';

beforeEach(() => {});

afterEach(cleanup);

it('should display team names', () => {});

it('should display team logotypes', () => {});

it('should display icon when there is no logo', () => {});

it('should display date of match depends on context', () => {});

it('should display labels depends on match date', () => {});

it('should add event to the calendar after click', () => {});
