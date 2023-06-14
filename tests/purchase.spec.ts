import { test, expect } from '@playwright/test';
import * as common from '../support/common';
import ENV from '../utils/env'


const Retailer = {
    email:'nathan.wang+43243@flexicards.co.nz',
    password:'Password1!',    
}

const Customer = {
    phone:'8157809623',
    password:'Password1'
}

const Purchase = {
    price: '256',
    description:'automated purchse',
    referenceNumber:'automated purchase',
}

test('make a purchase and get to the confirm page', async ({ page }) => {
    await page.goto(ENV.RETAILER_URL + '/retailer/s/login/');
    await page.getByPlaceholder('Email').fill(Retailer.email);
    await page.getByPlaceholder('Password').fill(Retailer.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('link', { name: 'Make a Purchase' }).click();
    await expect(page.getByText('Enter Customer mobile number')).toBeVisible({ timeout: 10000 })
    await page.getByPlaceholder('000 000 0000').fill(Customer.phone);
    await page.getByLabel('*Description of purchase').fill(Purchase.description);
    await page.getByLabel('*Invoice Reference Number').fill(Purchase.referenceNumber);
    await page.getByLabel('*Total Price of the Products').fill(Purchase.price);
    await page.getByRole('button', { name: 'Send to Customer' }).click();
    await expect(page.getByText('Customer completes purchase')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('b').filter({ hasText: Customer.phone })).toBeVisible();
    const link = await common.getPurchaseLink(Customer.phone);
    await page.evaluate((link)=>{
        console.log(link);
    }, link);
    
    // // Parked the "login to the purchase link" step for now as the link would get expired if it's been used once.

    // await page.goto(link);
    // await page.getByPlaceholder('Email or Mobile').fill(Customer.phone);
    // await page.getByPlaceholder('Password').fill(Customer.password);
    // await page.getByRole('button', { name: 'Log In' }).click();    
    // await expect(page.getByText('Review and accept terms')).toBeVisible({ timeout: 20000 });
})