const puppeteer = require('puppeteer')
const scrapeData = require('./dataScrapper')

async function productReviewsController(req, res){
    let productLink = req.body.link
    let browser = await puppeteer.launch({
        headless: true
    })
    let page = await browser.newPage()
    let isNextPage = false
    let runonce = true
    try {
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() === 'other' || request.resourceType() === 'font') request.abort();
            else request.continue();
        });
        await page.goto(productLink, {
            waitUntil: 'domcontentloaded'
        })
        let data = await scrapeData(page)

        //check if next button is there
        if (await page.$("#customerReviews > div:nth-child(7) > dl > dd > a")) {
            isNextPage = true;
            while (isNextPage) {
                let href = ""
                //selector of next button changes on next page for one time
                if (runonce) {
                    href = await page.$eval("#customerReviews > div:nth-child(7) > dl > dd > a", (elm) => elm.href)
                    runonce = false
                } else {
                    href = await page.$eval("#customerReviews > div:nth-child(7) > dl > dd > a:nth-child(2)", (elm) => elm.href)
                }
                await page.goto(href, {
                    waitUntil: 'domcontentloaded'
                })
                let loopData = await scrapeData(page)
                loopData.forEach(review => data.push(review))

                //check for next button on next page
                if (await page.$("#customerReviews > div:nth-child(7) > dl > dd > a:nth-child(2)")) {
                    isNextPage = true
                } else {
                    isNextPage = false
                }
            }
        }
        // console.log(data.length);
        res.send(data)
        await browser.close()
    } catch (error) {
        console.log(error);
        res.status(501).send('Not Implemented')
    }
}

module.exports = productReviewsController