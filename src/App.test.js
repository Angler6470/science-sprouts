import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Science Sprouts title', () => {
  render(<App />);
  const titles = screen.getAllByText(/Science Sprouts/i);
  expect(titles.length).toBeGreaterThan(0);
});

test('shows three unique option buttons for a problem', async () => {
  render(<App />);
  const container = await screen.findByTestId('options-container');
  const buttons = container.querySelectorAll('button');
  expect(buttons.length).toBe(3);
  const texts = Array.from(buttons).map(b => b.textContent.trim()).filter(t => t);
  const unique = new Set(texts);
  expect(unique.size).toBe(texts.length);
});
