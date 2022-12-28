const cheerio = require('cheerio');
const { puppetGetWebContentWithUserArgs } = require('./puppet');
const fs = require('fs-extra');
const dayjs = require('dayjs');
const { resolve } = require('path');

const pureString = (str) => {
    return ('' + str).replace('/\n/g', '').trim();
};

const searchItemKey = {
    ro: '0',
    jobsource: '2018indexpoc',
    hotJob: '0',
    recommendJob: '0',
    page: 1,
    keyword: 'javascript',
    area: '6001002000%2C6001005000%2C6001001000', //台北市 新北市 桃園市
    asc: '0',
    kwop: '7', //今日最新
};

const EnumsMap = {
    totalPage: 100,
    baseUrl: 'https://www.104.com.tw/jobs/search/?',
    filePath: '../jobs/data.json',
};

const getUrl = (page) => {
    let url = EnumsMap.baseUrl;
    Object.keys(searchItemKey).forEach((key) => {
        url += `${key}=${key != 'page' ? searchItemKey[key] : page ? page : searchItemKey[key]}&`;
    });
    return url;
};

async function jobsCrawler() {
    const startTime = new Date().getTime();

    for (let i = 0; i < EnumsMap.totalPage; i++) {
        const page = i + 1;
        const pageStartTime = new Date().getTime();

        console.log('page', page);

        try {
            let perPageContent = await puppetGetWebContentWithUserArgs(getUrl(page));
            let $page = cheerio.load(perPageContent);
            let pageEles = $page('article');

            let dataArr = [];

            for (j = 0; j < pageEles.length; j++) {
                let jobID = pageEles.eq(j).attr('data-job-no');
                let pubDateStr = pureString(pageEles.eq(j).find('.b-tit__date').text())?.split('/') || null;
                let publishDate = pubDateStr
                    ? dayjs(`${new Date().getFullYear()}-${pubDateStr[0]}-${pubDateStr[1]}`).format('YYYY-MM-DD')
                    : '';

                if (jobID) {
                    let data = {
                        _id: jobID,
                        jobID: jobID,
                        companyID: `${pageEles.eq(j).attr('data-cust-no')}`,
                        company: `${pageEles.eq(j).attr('data-cust-name')}`,
                        job: `${pageEles.eq(j).find('.b-tit').find('a').text()}`,
                        jobLink: `${('' + pageEles.eq(j).find('.b-tit').find('a').attr('href')).replace(
                            '//',
                            'https://'
                        )}`,
                        jobDesc: pureString(`${pageEles.eq(j).find('.job-list-item__info').text()}`),
                        area: `${pageEles.eq(j).find('.job-list-intro').find('li').eq(0).text()}`,
                        requireExp: `${pageEles.eq(j).find('.job-list-intro').find('li').eq(1).text().trim()}`,
                        publishDate: publishDate,
                        catchdDate: dayjs().format('YYYY-MM-DD'),
                    };
                    dataArr.push(data);
                }
            }

            console.log(dataArr);

            const file = fs.readFileSync(resolve(__dirname, EnumsMap.filePath), 'utf-8');
            let fileObject = JSON.parse(file || '{}');
            dataArr.forEach((data) => {
                let { jobID } = data;
                fileObject[jobID] = data;
            });
            await fs.writeJson(resolve(__dirname, EnumsMap.filePath), fileObject);

            const pageEndTime = new Date().getTime();
            console.log(`page${i + 1}花費時間:${Math.floor((pageEndTime - pageStartTime) / 1000)}秒`);
        } catch (error) {
            continue;
        }
    }

    const endTime = new Date().getTime();
    console.log(`${EnumsMap.totalPage} pages 共花費時間:${Math.floor((endTime - startTime) / 1000)}秒`);
}

module.exports = {
    jobsCrawler,
};
