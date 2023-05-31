import * as common from '../support/common'
import { test, expect } from '@playwright/test'


test('get the purchase link',async () => {
    const link = await common.getPurchaseLink('4086343220');
    console.log(link)
})