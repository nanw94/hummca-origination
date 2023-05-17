import { test, expect } from '@playwright/test';
import * as common from '../support/common';

let otp;

test('get otp',async ({ page }) => {
  await test.step('go to humm-ca web app',async () => {
    await page.goto('/sign-in-or-register');
    await expect(page.getByText('Choose below whether you want to login in or create an account')).toBeVisible();
  });
  
  await test.step('click create account',async () => {
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome, Things you should know' })).toBeVisible();
  })

  await test.step('tick agreement and click continue',async () => {
    await page.locator('.mat-checkbox-inner-container').first().click();
    await page.locator('#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container').click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { name: 'Let’s start with your mobile number' })).toBeVisible();
  })
  
  await test.step('input mobile number and confirm',async () => {
    await page.getByPlaceholder('Mobile number').fill('385 423 4144');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByRole('heading', { name: 'Great, let’s validate that number' })).toBeVisible();
  })

  await test.step('get otp from Twilio',async () => {
    otp = await common.getOTP('3854234144');
  })

  await test.step('input otp and click confirm',async () => {})
  await page.getByRole('textbox').fill(otp);
  await page.getByRole('button', { name: 'Confirm' }).click();  
});

