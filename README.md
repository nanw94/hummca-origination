## Setup
`git clone`
`npm install`

## Run the script
SIT
`npm run test:sit`
UAT
`npm run test:uat`

## Test data needed
Origination
`const  PhoneNumber = '9842076461';`
`const  EmailAddress = 'nathanhummca09';`

Purchase
The login info of the retailer contact
`const  Retailer = {
email:'nathan.wang+43243@flexicards.co.nz',
password:'Password1!',
}  `

The customer phone number
`const  Customer = {
phone:'8157809623',
password:'Password1'
} `

The price and description of the purchase
`const  Purchase = {
price:  '256',
description:'automated purchse',
referenceNumber:'automated purchase',
}`
