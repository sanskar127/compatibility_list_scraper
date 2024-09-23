const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://vita3k.org/compatibility.html';

async function scrapePage() {
    try {
        const response = await axios.get(BASE_URL);
        const html = response.data;
        const $ = cheerio.load(html);

        const data = [];

        // Adjust selectors based on the actual structure of the game list
        $('table tbody tr').each((index, element) => {
            // serial title compatibility
            const serial = $(element).find('td:nth-child(1) small.ng-binding').text().trim();
            const title = $(element).find('td:nth-child(2) a small.ng-binding').text().trim();
            const compatibility = $(element).find('td:nth-child(3) font small.ng-binding').text().trim();

            data.push({ serial, title, compatibility });
        });

        return data;
    } catch (error) {
        console.error('Error fetching: ', error);
        return [];
    }
}

async function scrapeAllPages() {
    try {
        console.log('Starting to scrape...');

        const pageData = await scrapePage();

        console.log('Scraping complete!');

        // Save the data to a JSON file
        fs.writeFileSync('vita3k.json', JSON.stringify(pageData, null, 2));
        console.log('Data exported to vita3k.json');
    } catch (error) {
        console.error('An error occurred during scraping or file writing:', error);
    }
}

scrapeAllPages();
