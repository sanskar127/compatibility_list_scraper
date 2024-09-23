const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://dolphin-emu.org/compat/';
const MAX_PAGES = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

async function scrapePage(pageNumber) {
    try {
        const response = await axios.get(`${BASE_URL}${pageNumber}`);
        const html = response.data;
        const $ = cheerio.load(html);

        const data = [];

        // Adjust selectors based on the actual structure of the game list
        $('table tbody tr').each((index, element) => {
            // category title rating update

            const category = $(element).find('td:nth-child(1) img').attr('title');
            const title = $(element).find('td:nth-child(3) a').text().trim();
            const rating = $(element).find('td:nth-child(4) img').attr('title');
            const update = $(element).find('td:nth-child(5)').text().trim();

            data.push({ category, title, rating, update });
        });

        return data;
    } catch (error) {
        console.error(`Error fetching page ${pageNumber}:`, error);
        return [];
    }
}

async function scrapeAllPages() {
    const allData = [];

    for (let i = 0; i < MAX_PAGES.length; i++) {
        console.log(`Scraping page ${MAX_PAGES[i]}...`);
        const pageData = await scrapePage(MAX_PAGES[i]);
        allData.push(...pageData);
    }

    console.log('Scraping complete!');

    // Save the data to a JSON file
    fs.writeFileSync('dolphin.json', JSON.stringify(allData, null, 2));
    console.log('Data exported to scrapedData.json');
}

scrapeAllPages();
