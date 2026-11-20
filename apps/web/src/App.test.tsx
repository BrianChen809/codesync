import { fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';
import { initialCode } from './editor/sample';

// Test workspace behavior here; Playwright exercises the real Monaco editor.
jest.mock('./editor/CodeEditor', () => ({
  CodeEditor: ({ initialValue, onChange }: {
    initialValue: string;
    onChange: (value: string) => void;
  }) => (
    <textarea
      aria-label="Test editor"
      defaultValue={initialValue}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

afterEach(() => jest.restoreAllMocks());

test('reports unsaved edits and restores the sample only after confirmation', () => {
  const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
  render(<App />);
  const editor = screen.getByRole('textbox');
  const reset = screen.getByRole('button', { name: 'Reset sample' });
  expect(reset).toBeDisabled();

  fireEvent.change(editor, { target: { value: 'const answer = 42;' } });
  expect(screen.getByRole('status')).toHaveTextContent('Edited in this tab · not saved');
  fireEvent.click(reset);
  expect(editor).toHaveValue('const answer = 42;');

  confirm.mockReturnValue(true);
  fireEvent.click(reset);
  expect(screen.getByRole('textbox')).toHaveValue(initialCode);
  expect(reset).toBeDisabled();
});

test('warns before leaving only while the sample has been changed', () => {
  render(<App />);
  const unchanged = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(unchanged);
  expect(unchanged.defaultPrevented).toBe(false);

  fireEvent.change(screen.getByRole('textbox'), { target: { value: '// changed' } });
  const changed = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(changed);
  expect(changed.defaultPrevented).toBe(true);
});
