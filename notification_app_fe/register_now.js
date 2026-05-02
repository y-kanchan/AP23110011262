// register_now.js
const http = require('http');

console.log("\n🚀 --- FAST REGISTRATION TOOL --- 🚀\n");

const details = {
  email: "your_email@srmap.edu.in",
  name: "Your Name",
  mobileNo: "9999999999",
  githubUsername: "your_github",
  rollNo: "APXXXXXXXXXXX",
  accessCode: "PASTE_YOUR_ACCESS_CODE_HERE"
};

console.log("PLEASE EDIT THIS FILE (register_now.js) WITH YOUR ACTUAL DETAILS FIRST!\n");

const data = JSON.stringify(details);

const options = {
  hostname: '20.207.122.201',
  port: 80,
  path: '/evaluation-service/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode === 200 || res.statusCode === 201) {
      const response = JSON.parse(body);
      console.log("\n✅ SUCCESS! HERE ARE YOUR IDS:\n");
      console.log("------------------------------------------");
      console.log(`CLIENT ID:     ${response.clientID}`);
      console.log(`CLIENT SECRET: ${response.clientSecret}`);
      console.log("------------------------------------------");
      console.log("\nNext Steps:");
      console.log("1. Copy these into your .env file or use them in the Setup Form.");
      console.log("2. The UI will then automatically generate your Access Token.");
    } else {
      console.log("\n❌ REGISTRATION FAILED");
      console.log(`Error: ${body}`);
      console.log("\nCommon Fixes:");
      console.log("- Check if your Access Code is correct.");
      console.log("- Ensure your Roll Number is exactly as required.");
    }
  });
});

req.on('error', (error) => {
  console.error("\n❌ NETWORK ERROR:");
  console.error(error.message);
});

req.write(data);
req.end();
