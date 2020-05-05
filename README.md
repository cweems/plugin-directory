# Flex Directory

This plugin allows agents to transfer calls to external numbers from a pre-configured directory. It is still in active development, use at your own risk.

![Screen Shot 2020-05-05 at 11 28 41 AM](https://user-images.githubusercontent.com/1418949/81101875-9bb02280-8ec3-11ea-81f3-2205b36c9746.png)
![Screen Shot 2020-05-05 at 11 28 22 AM](https://user-images.githubusercontent.com/1418949/81101878-9d79e600-8ec3-11ea-9ad5-691d210a21b8.png)

Todo:

- [ ] Authenticate requests to the contacts DB
- [ ] Make Directory Admin interface only viewable to Supervisors
- [ ] Add search and pagination to transfer interface
- [ ] Add search to the transfer interface

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd

# If you use npm
npm install
```

## Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

### Setting Up the Directory Sync Database

1. Create a Sync Service
   twilio api:sync:v1:services:create --friendly-name=contacts

1. Create a Sync Map
   twilio api:sync:v1:services:maps:create --service-sid=ISXXXXXXXXXXXXXXXXXXXXXXXX

1. Add `CONTACT_SYNC_SERVICE` and `CONTACT_SYNC_MAP` as environment variables in your Twilio Function configuration.

1. Update the functions URL with your URL in `DirectoryAdmin.js` and `ConferenceDialog.js`.

## Deploy

Once you are happy with your plugin, you have to bundle it in order to deploy it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example, `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.
