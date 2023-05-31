import { expect } from '@playwright/test';

const twilioURL = 'https://api.twilio.com/2010-04-01/Accounts/AC5686ad7a2cd95c6a8541f7afa1567f90';
const twilioToken = 'U0s2YTRiNmFiOTE3MTJhNWU2ZjM2NTIzMDcxN2E1Y2ZlYTpsenZBaWJXTTJyNkpZUWQ2c1dTSkE3VGc5dTl2RXVScw=='
//get otp
export async function getOTP(phoneNumber) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${twilioToken}`);
           
    const response = await fetch(`${twilioURL}/Messages.json?To=+1${phoneNumber}&PageSize=1`, {
      method: 'GET',
      headers: myHeaders,
    });

    const data = await response.json();
    const otp = await data.messages[0].body.slice(-6);
    return otp;
}

export async function getPurchaseLink(phoneNumber) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Basic ${twilioToken}`);
         
  const response = await fetch(`${twilioURL}/Messages.json?To=+1${phoneNumber}&PageSize=1`, {
    method: 'GET',
    headers: myHeaders,
  });

  const data = await response.json();
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const link = await data.messages[0].body.match(urlRegex);

  return link[0];
}

//Fetch inbox for the id of the latest mail
export async function getMailId(domain, address,token ) {
    const url = `https://mailinator.com/api/v2/domains/${domain}/inboxes/${address}?limit=2&sort=descending&token=${token}`;
    const response = await fetch(url);
    const data = await response.json();
    const id = await data.msgs[1].id;
    return id;    
}

//Fetch the message from verification email. (parked and currently not being used, the regular expression is till not reliable,
// using UI method for the link at the moment)
export async function getRedirectUrl(domain, address, token) {
    const id = await getMailId(domain, address,token);
    const url = `https://mailinator.com/api/v2/domains/${domain}/messages/${id}?token=${token}`;
    const response = await fetch(url);
    const jsonData = await response.json()
    const jsonString = JSON.stringify(jsonData);
    console.log(jsonString);
    const pattern1: RegExp = /just one quick step to verify your email address(.*?)Please refer to links to the Terms and Conditions/i
    const pattern2: RegExp = /https?:\/\/[\w.-]+(?:\/[\w%.-]+)*(?:\?[^\s]+)?/i;
    const match1: RegExpMatchArray | null = jsonString.match(pattern1);
    if (match1) {
      const extractedString: string = match1[0];
      console.log(match1.length);
      console.log(extractedString);
      const match2: RegExpMatchArray | null = extractedString.match(pattern2);
      if(match2){
        const link: string = match2[0];
        console.log(link);
        return link;
      }
    }
}

export async function delay(time){
    return await new Promise(function(resolve){
        setTimeout(resolve, time)
    });
}
    

