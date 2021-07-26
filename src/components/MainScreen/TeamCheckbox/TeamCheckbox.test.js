import React from 'react';
import TeamCheckbox from './TeamCheckbox';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../mock/leagues.test.json';

beforeEach(() => {});

afterEach(cleanup);

it('should display team name', () => {});

it('should display checkbox which state depends on props', () => {});

it('should make checkbox disabled when team does not have matches', () => {});

it('should invoke store action on checkbox click', () => {});
