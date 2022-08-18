require('dotenv').config();
const axios = require('axios').default;
var FormData = require('form-data');

//LINE_NOTIFY_TOKEN 從line notify developer可以取得 
//https://notify-bot.line.me/my/

async function lineNotify(message = '') {
  const token = process.env.LINE_NOTIFY_TOKEN;
  const form = new FormData();
  form.append('message', message);
  const headers = Object.assign(
    {
      Authorization: `Bearer ${token}`,
    },
    form.getHeaders()
  );

  try {
    axios({
      method: 'post',
      url: 'https://notify-api.line.me/api/notify',
      data: form,
      headers: headers,
    });
  } catch (error) {
    console.log('line notify error', error);
  }
}

module.exports = { lineNotify };
