import { test, expect } from '@playwright/test';
import * as common from '../support/common';

let otp;
let redirectLink;
const phoneNumber = '3854234144';
const EamilDomain = 'hummca.testinator.com';
const EmailAddress = 'testone'
const EmailToken = '20a167986268493a8f3a45c43916a168'
const Password = 'Password1!'

test('Origination via Humm Canada web application',async ({ page }) => {
  // await test.step('go to humm-ca web app',async () => {
  //   await page.goto('/sign-in-or-register');
  //   await expect(page.getByText('Choose below whether you want to login in or create an account')).toBeVisible();
  // });
  
  // await test.step('click create account',async () => {
  //   await page.getByRole('button', { name: 'Create Account' }).click();
  //   await expect(page.getByRole('heading', { name: 'Welcome, Things you should know' })).toBeVisible();
  // })

  // await test.step('tick agreement and click continue',async () => {
  //   await page.locator('.mat-checkbox-inner-container').first().click();
  //   await page.locator('#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container').click();
  //   await page.getByRole('button', { name: 'Continue' }).click();
  //   await expect(page.getByRole('heading', { name: 'Let’s start with your mobile number' })).toBeVisible();
  // })
  
  // await test.step('input mobile number and confirm',async () => {
  //   await page.getByPlaceholder('Mobile number').fill(phoneNumber);
  //   await page.getByRole('button', { name: 'Confirm' }).click();
  //   await expect(page.getByRole('heading', { name: 'Great, let’s validate that number' })).toBeVisible();
  // })

  // await test.step('get otp from Twilio',async () => {
  //   otp = await common.getOTP(phoneNumber);
  // })

  // await test.step('input otp and click confirm',async () => {
  //   await page.getByRole('textbox').fill(otp);
  //   await page.getByRole('button', { name: 'Confirm' }).click();
  //   await expect(page.getByText('Please pick a password for your account')).toBeVisible();
  // })

  // await test.step('create password',async () => {
  //   await page.getByPlaceholder('Password', { exact: true }).fill('Password1!');
  //   await page.getByPlaceholder('Confirm Password').fill('Password1!');
  //   await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  //   await expect(page.getByRole('button', { name: 'Confirm', exact: true })).toBeVisible();
  // })

  // await test.step('input Email address',async () => {
  //   await page.getByPlaceholder('Email').fill(`${EmailAddress}@${EamilDomain}`);
  //   await page.getByRole('button', { name: 'Confirm' }).click();
  //   await expect(page.getByText(`We\'ve sent a verification email to ${EmailAddress}@${EamilDomain}.Please click on`)).toBeVisible();
  // })

  await test.step('fetch the redirect link from the email message',async () => {
    // await common.delay(10000);
    redirectLink = await common.getRedirectUrl(EamilDomain,EmailAddress,EmailToken);
  })

  await test.step('go to redirect url',async () => {
    await page.goto(redirectLink);
    await expect(page).toHaveURL(/humm-ca-sit.us.auth0.com/);
  })

  await test.step('input email and password',async () => {
    await page.getByPlaceholder('Email or Mobile').fill(`${EmailAddress}@${EamilDomain}`);
    await page.getByPlaceholder('Password').fill(Password);
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL(/personal-information/, { timeout: 10000 });
  })

});

