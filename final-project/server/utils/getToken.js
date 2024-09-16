const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  "892857843036-9olv2oa0p35m8omo7hqku0chdvtriu6d.apps.googleusercontent.com",
  "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",
  "http://localhost" // e.g., http://localhost
);

const scopes = ["https://www.googleapis.com/auth/gmail.send"];

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

console.log("Authorize this app by visiting this url:", url);

// const code =
//   "4/0AQlEd8yvenBt9Pt8ka6TTIBErIqbXpjtte-ozE-C6qQiuVEi-q_M0lnL4h_8I7Bk2nTd2w";

// oauth2Client.getToken(code, (err, token) => {
//   if (err) return console.error("Error retrieving access token", err);
//   oauth2Client.setCredentials(token);
//   console.log("Your access token:", token);
// });
// Setelah mendapatkan kode dari URL di atas, gunakan kode tersebut untuk mendapatkan token:
// Setelah mengunjungi URL, Anda akan mendapatkan kode. Gunakan kode tersebut untuk mendapatkan token
// Copy and paste kode yang Anda dapatkan dari browser di bawah ini
// oauth2Client.getToken('YOUR_AUTHORIZATION_CODE', (err, token) => {
//   if (err) return console.error('Error retrieving access token', err);
//   console.log('Your access token:', token);
// });
