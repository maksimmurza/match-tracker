import React from 'react';
import GoogleAuthButton from './GoogleAuthButton';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import leagues from '../../../mock/leagues.test.json';

beforeEach(() => {});

afterEach(cleanup);

it('should display text when user logged out', () => {});

it('should display name when user logged in', () => {});

it('should change size depends on available space in parent container', () => {});
