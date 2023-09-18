import RingCentral from '@rc-ex/core';
import WSExtension from '@rc-ex/ws';
import waitFor from 'wait-for-async';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
  });
  const wsExt = new WSExtension();
  await rc.installExtension(wsExt);
  const sub = await wsExt.subscribe(
    ['/restapi/v1.0/account/~/telephony/sessions?phoneNumber=+16504308888&direction=Inbound&statusCode=Setup'],
    (event) => {
      console.log(JSON.stringify(event, null, 2));
    },
  );
  console.log(JSON.stringify(sub.subscriptionInfo, null, 2));
  await waitFor({ interval: 100000000 });
  await rc.revoke();
};
main();
