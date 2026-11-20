import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('edits real Monaco content, downloads it, and resets the sample', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'main.ts', exact: true })).toBeVisible();
  const editor = page.getByRole('textbox', { name: 'Code editor for main.ts' });
  await expect(editor).toBeAttached();
  await page.screenshot({ path: testInfo.outputPath('workspace.png'), fullPage: true });
  await page.locator('.monaco-editor .view-lines').click({ position: { x: 30, y: 12 } });
  await page.keyboard.press('ControlOrMeta+Home');
  await page.keyboard.insertText('// browser smoke test\n');
  await expect(page.getByRole('status')).toHaveText('Edited in this tab · not saved');

  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.insertText('\ndeveloper.');
  await page.keyboard.press('Control+Space');
  await expect(page.locator('.suggest-widget.visible')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.suggest-widget.visible')).toContainText('building');
  await page.keyboard.press('Escape');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download file' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('main.ts');
  expect(await readFile((await download.path())!, 'utf8')).toContain('// browser smoke test');

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Reset sample' }).click();
  await expect(page.getByRole('status')).toHaveText('Sample loaded · not saved');
  await expect(page.getByRole('button', { name: 'Reset sample' })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
