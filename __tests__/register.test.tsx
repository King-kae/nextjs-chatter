import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from '../src/app/register/page';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');
jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('RegisterPage', () => {
  const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
  const mockAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;
  const mockRouterPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it('renders the form elements correctly', () => {
    render(<RegisterPage />);
    
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("somemail@gmail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByTestId("Sign Up")).toBeInTheDocument();
  });

});
