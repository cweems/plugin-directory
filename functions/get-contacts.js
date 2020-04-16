exports.handler = function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  let client = context.getTwilioClient();

  client.sync
    .services(context.CONTACT_SYNC_SERVICE)
    .syncMaps(context.CONTACT_SYNC_MAP)
    .syncMapItems.list({ limit: 20 })
    .then((syncMapItems) => {
      let result = [];
      syncMapItems.forEach((s) => {
        console.log(s.key);
        result.push(s.data);
      });
      response.body = JSON.stringify(result);
      callback(null, response);
    });
};
