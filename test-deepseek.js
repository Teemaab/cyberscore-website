// Run this to test if DeepSeek works:
//   node test-deepseek.js
//
// It will tell you exactly what is broken.

const https = require('https');

const API_KEY = 'sk-d760228ded1a48aa8fa7928cfe4701ce';

const payload = JSON.stringify({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: 'Tu es un assistant.' },
    { role: 'user',   content: 'Dis juste: ça marche.' }
  ],
  max_tokens: 20,
  temperature: 0
});

const options = {
  hostname: 'api.deepseek.com',
  path:     '/chat/completions',
  method:   'POST',
  headers: {
    'Authorization': 'Bearer ' + API_KEY,
    'Content-Type':  'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log('Testing DeepSeek API...\n');

const req = https.request(options, function(res) {
  console.log('HTTP status:', res.statusCode);

  var raw = '';
  res.on('data', function(c) { raw += c; });
  res.on('end', function() {
    try {
      var data = JSON.parse(raw);

      if (res.statusCode === 200) {
        var reply = data.choices && data.choices[0] && data.choices[0].message.content;
        console.log('✅ DeepSeek works! Reply:', reply);
        console.log('\n→ Problem is in Netlify (env var not set, or redirect not working).');
        console.log('  Check: Netlify dashboard → Environment variables → DEEPSEEK_API_KEY');

      } else if (res.statusCode === 401) {
        console.log('❌ API key invalid or expired.');
        console.log('  → Go to platform.deepseek.com and generate a new key.');
        console.log('  Raw response:', raw);

      } else if (res.statusCode === 402) {
        console.log('❌ Insufficient balance on DeepSeek account.');
        console.log('  → Go to platform.deepseek.com and add credits.');

      } else if (res.statusCode === 429) {
        console.log('❌ Rate limit hit.');
        console.log('  → Wait a minute and try again.');

      } else {
        console.log('❌ Unexpected error. Raw response:', raw);
      }

    } catch(e) {
      console.log('❌ Could not parse response:', raw);
    }
  });
});

req.setTimeout(10000, function() {
  console.log('❌ Timeout — DeepSeek is not responding after 10 seconds.');
  req.destroy();
});

req.on('error', function(e) {
  console.log('❌ Network error:', e.message);
  console.log('  → Check your internet connection.');
});

req.write(payload);
req.end();
