import { test, expect } from '@playwright/test';
import * as common from '../support/common';

const RetailerPortalUrl = 'https://hummca--sit.sandbox.my.site.com/retailer/s/login/';

const Retailer = {
    email:'nathan.wang+43243@flexicards.co.nz',
    password:'Password1!',    
}

const Customer = {
    phone:'4086343220',
}

const Purchase = {
    price: '1548',
    description:'automated purchse',
    referenceNumber:'automated purchase',
}

test('test', async ({ page }) => {
    await page.goto(RetailerPortalUrl);
    await page.getByPlaceholder('Email').fill(Retailer.email);
    await page.getByPlaceholder('Password').fill(Retailer.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('link', { name: 'Make a Purchase' }).click();
    await page.getByPlaceholder('000 000 0000').fill(Customer.phone);
    await page.getByLabel('*Description of purchase').fill(Purchase.description);
    await page.getByLabel('*Invoice Reference Number').fill(Purchase.referenceNumber);
    await page.getByLabel('*Total Price of the Products').fill(Purchase.price);
    await page.getByRole('button', { name: 'Send to Customer' }).click();
    await expect(page.getByText('Customer completes purchase')).toBeVisible();
    await expect(page.locator('b').filter({ hasText: Customer.phone })).toBeVisible();
    const link = await common.getPurchaseLink(Customer.phone);
    console.log(link);
})