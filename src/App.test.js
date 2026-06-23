import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <>{element}</>,
  Navigate: () => null,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '1' }),
}), { virtual: true });

test('renders 3bir catalog heading', () => {
  render(<App />);
  expect(screen.getByText(/Piva iz 3Bir pivare/i)).toBeInTheDocument();
});
