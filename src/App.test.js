import { render, screen } from '@testing-library/react';
import App from './App';

test('renders 3bir catalog heading', () => {
  render(<App />);
  expect(screen.getByText(/Piva iz 3Bir pivare/i)).toBeInTheDocument();
});
