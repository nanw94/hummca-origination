import { test, expect } from '@playwright/test';
import * as common from '../support/common';

let otp;
let redirectLink;

//Auth0 
//Need to make sure the number is unique in Auth0, unique email address is recommended too.
const PhoneNumber = '8036190424';
const EmailAddress = 'nathanhummca01';
const Password = 'Password1';

//Email service (mailinator.com)
const Mail = {
  url:'https://www.mailinator.com/',
  token:'20a167986268493a8f3a45c43916a168',
  domain:'hummca.testinator.com',
  username: 'nathan.wang@humm-group.com',
  password:'5#pPPJ&3B!fkyseg'
}

const Person = {
  firstname: 'LULA',
  lastname:'PROVAZEK',
  middlename: 'Approved',
  addressshort: '311 70TH S',
  dob:'05/26/1980'
}

const funding = 
{
  holder:'Test Test',
  cvv: '123' ,
  expire: '12 / 29',
  creditcard: '4242 4242 4242 4242'
}

test('Origination via Humm Canada web application',async ({ page }) => {
  await test.step('go to humm-ca web app',async () => {
    await page.goto('/sign-in-or-register');
    await expect(page.getByText('Choose below whether you want to login in or create an account')).toBeVisible( { timeout: 10000 });
  });
  
  await test.step('click create account',async () => {
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome, Things you should know' })).toBeVisible( { timeout: 10000 });
  })

  await test.step('tick agreement and click continue',async () => {
    await page.locator('.mat-checkbox-inner-container').first().click();
    await page.locator('#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container').click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { name: 'Let’s start with your mobile number' })).toBeVisible( { timeout: 10000 });
  })
  
  await test.step('input mobile number and confirm',async () => {
    await page.getByPlaceholder('Mobile number').fill(PhoneNumber);
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByText('Please enter the code sent to your mobile number')).toBeVisible( { timeout: 10000 });
  })

  await test.step('get otp from Twilio',async () => {
    otp = await common.getOTP(PhoneNumber);
  })

  await test.step('input otp and click confirm',async () => {
    await page.getByRole('textbox').fill(otp);
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByText('Please pick a password for your account')).toBeVisible( { timeout: 10000 });
  })

  await test.step('create password',async () => {
    await page.getByPlaceholder('Password', { exact: true }).fill(Password);
    await page.getByPlaceholder('Confirm Password').fill(Password);
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Confirm', exact: true })).toBeVisible( { timeout: 10000 });
  })

  await test.step('input Email address',async () => {
    await page.getByPlaceholder('Email').fill(`${EmailAddress}@${Mail.domain}`);
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByText(`We\'ve sent a verification email to ${EmailAddress}@${Mail.domain}.Please click on`)).toBeVisible( { timeout: 30000 });
  })

  await test.step('sign in to mailinator', async () => {
    await page.goto(Mail.url);
    await page.locator('#menu-item-7937').getByRole('link', { name: 'LOGIN' }).click();
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill(Mail.username);
    await page.getByPlaceholder('Password').fill(Mail.password);
    await page.getByText('Log in').click();
    await expect(page.getByRole('heading', { name: 'Private Team Inbox' })).toBeVisible();
  })

  await test.step('find mail and get the redirect link', async () => {
    await page.getByRole('cell', { name: EmailAddress }).first().click();
    await expect(page.locator('#email_pane').getByText(EmailAddress, { exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'LINKS' }).click();
    await expect(page.getByRole('cell', { name: 'Verify now' })).toBeVisible();
    redirectLink = await page.getByRole('row').filter({has: page.getByRole('cell',{ name: 'Verify now'})}).getByRole('link').textContent();
  })
    
  await test.step('go to the redirect link', async () => {
    await page.goto(redirectLink);
    // await page.getByPlaceholder('Email or Mobile').fill(PhoneNumber);
    // await page.getByPlaceholder('Password').fill(Password);
    // await page.getByRole('button', { name: 'Log In' }).click();
  })

  await test.step('fill up personal information', async () => {
    await page.getByPlaceholder('Start typing an address or postal code').fill(Person.addressshort);
    await page.getByRole('listitem').first().click();
    await page.getByPlaceholder('MM/DD/YYYY').fill(Person.dob)
    await page.getByPlaceholder('First Name').fill(Person.firstname);
    await page.getByPlaceholder('Last Name').fill(Person.lastname);
    await page.getByPlaceholder('Middle Name').fill(Person.middlename);
    await page.getByRole('button', { name: 'Confirm' }).click();
  })

  await test.step('add funding source', async () => {
    await page.locator('#card').check();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByPlaceholder('Cardholder Name').fill(funding.holder);
    await page.frameLocator('iframe[name^="__privateStripeFrame"]').first().getByPlaceholder('Credit Card Number').fill(funding.creditcard);
    await page.frameLocator('iframe[name^="__privateStripeFrame"]').nth(1).getByPlaceholder('MM/YY').fill(funding.expire);
    await page.frameLocator('iframe[name^="__privateStripeFrame"]').last().getByPlaceholder('CVV').fill(funding.cvv);
    await page.getByRole('button', { name: 'Continue' }).click();
  })

  await test.step('verify origination is successful and go to home page', async () => {
    await expect(page.getByRole('heading', { name: 'Awesome' })).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Proceed to Home Screen' }).click();
  })

});
