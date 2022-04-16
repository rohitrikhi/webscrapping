async function scrapeData(page) {
    try {
        let data = await page.evaluate(() => {
            //getting ratings
            let ratingHolder = Array.from(document.querySelectorAll("#customerReviews > div > div.leftCol > dl.itemReview > dd > div > strong")).map(x => x.textContent)
            //getting names
            let nameHolder = Array.from(document.querySelectorAll("#customerReviews > div > div.leftCol > dl.reviewer > dd:nth-child(2")).map(x => x.textContent)
            //getting comments
            let commentHolder = Array.from(document.querySelectorAll("#customerReviews > div > div.rightCol > blockquote")).map(x => x.textContent)
            //getting dates
            let CommentDateHolder = Array.from(document.querySelectorAll("#customerReviews > div > div.leftCol > dl.reviewer > dd:nth-child(4)")).map(x => x.textContent)
            let finalArray = [];
    
            for (let i = 0; i < ratingHolder.length; i++) {
                let reviewObject = {
                    rating: ratingHolder[i],
                    comment: commentHolder[i].split('\n').join(' '),
                    reviewerName: nameHolder[i],
                    reviewDate: CommentDateHolder[i],
                }
                finalArray.push(reviewObject)
            }
            return finalArray
        })
        return data
    } catch (error) {
    throw error
    }
}

module.exports = scrapeData