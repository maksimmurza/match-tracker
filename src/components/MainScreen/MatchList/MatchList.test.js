import React from 'react';
import MatchList from './MatchList';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../mock/leagues.test.json';

beforeEach(() => {});

afterEach(cleanup);

it('should display loader while loading', () => {});

it('should display matches', () => {});

it('should consider display status of league or match', () => {});

it('should display matches in right order depends on date', () => {});

it('should display message when nothing to show', () => {});
