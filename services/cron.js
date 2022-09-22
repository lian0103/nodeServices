require('dotenv').config();
const CronJob = require('cron').CronJob;


function startCron(task , cronTime=null) {
  new CronJob({
    cronTime: cronTime ? cronTime : process.env.CRONJOB_TIME,
    onTick: async function () {
      await task();
    },
    start: true,
    timeZone: 'Asia/Taipei',
  });
}

module.exports = {
  startCron,
};
