import { expect } from '@playwright/test';

const twilioURL = 'https://api.twilio.com/2010-04-01/Accounts/AC5686ad7a2cd95c6a8541f7afa1567f90';

//get otp
export async function getOTP(phoneNumber) {
    const regex = /\d$/; 
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic U0s2YTRiNmFiOTE3MTJhNWU2ZjM2NTIzMDcxN2E1Y2ZlYTpsenZBaWJXTTJyNkpZUWQ2c1dTSkE3VGc5dTl2RXVScw==");
           
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/AC5686ad7a2cd95c6a8541f7afa1567f90/Messages.json?To=+1${phoneNumber}&PageSize=1`, {
    method: 'GET',
      headers: myHeaders,
    });

    const data = await response.json();
    const otp = await data.messages[0].body.slice(-6);
    return otp;

}