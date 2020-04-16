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
    .syncMapItems.create({
      key: event.phone,
      data: {
        name: event.name,
        phone: event.phone
      },
    }).then(syncMapItem => {
      response.body = JSON.stringify(syncMapItem);
      callback(null, response);
    });
};
