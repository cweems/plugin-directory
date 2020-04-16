const nodeFetch = require('node-fetch');
const { Base64 } = require('js-base64');

exports.handler = async function(context, event, callback) {
  // eslint-disable-next-line no-undef
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log('Event properties:');
  Object.keys(event).forEach(key => {
    console.log(`${key}: ${event[key]}`);
  });

  if (Object.keys(event).length === 0) {
    console.log('Empty event object, likely an OPTIONS request');
    return callback(null, response);
  }

  const {
    token,
    conference,
    participant
  } = event;

  console.log('Validating request token');
  const tokenValidationApi = `https://iam.twilio.com/v1/Accounts/${context.ACCOUNT_SID}/Tokens/validate`;
  const fetchResponse = await nodeFetch(tokenValidationApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Base64.encode(`${context.ACCOUNT_SID}:${context.AUTH_TOKEN}`)}`
    },
    body: JSON.stringify({
      token
    })
  });
  const tokenResponse = await fetchResponse.json();
  console.log('Token validation response properties:');
  Object.keys(tokenResponse).forEach(key => {
    console.log(`${key}: ${tokenResponse[key]}`);
  });
  if (!tokenResponse.valid) {
    response.setStatusCode(401);
    response.setBody({
      status: 401,
      message: 'Your authentication token failed validation',
      detail: tokenResponse.message
    });
    return callback(null, response);
  }

  console.log(`Removing participant ${participant} from conference ${conference}`);
  const client = context.getTwilioClient();
  const participantResponse = await client
    .conferences(conference)
    .participants(participant)
    .remove();
  console.log('Participant response properties:');
  Object.keys(participantResponse).forEach(key => {
    console.log(`${key}: ${participantResponse[key]}`);
  });

  return callback(null, response);
};
