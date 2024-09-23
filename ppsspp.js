const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://report.ppsspp.org/games?page=';
const MAX_PAGES = 78; // Adjust this as needed

async function scrapePage(pageNumber) {
    try {
        const response = await axios.get(`${BASE_URL}${pageNumber}`);
        const html = response.data;
        const $ = cheerio.load(html);

        const data = [];

        // Adjust selectors based on the actual structure of the game list
        $('.table tbody tr').each((index, element) => {
            const title = $(element).find('td:nth-child(1)').text().trim();
            const url = ("https://report.ppsspp.org") + ($(element).find('td:nth-child(1) a').attr('href'));
            const region = $(element).find('td:nth-child(2) span').text().trim();
            const compatibility = $(element).find('td:nth-child(3) span').text().trim();
            data.push({ title, url, region, compatibility });
        });

        return data;
    } catch (error) {
        console.error(`Error fetching page ${pageNumber}:`, error);
        return [];
    }
}

async function scrapeAllPages() {
    const allData = [];

    for (let i = 1; i <= MAX_PAGES; i++) {
        console.log(`Scraping page ${i}...`);
        const pageData = await scrapePage(i);
        allData.push(...pageData);
    }

    console.log('Scraping complete!');

    // Save the data to a JSON file
    fs.writeFileSync('ppsspp.json', JSON.stringify(allData, null, 2));
    console.log('Data exported to scrapedData.json');
}

scrapeAllPages();
