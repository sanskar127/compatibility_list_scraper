const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://xemu.app/#compatibility';

async function scrapePage() {
    try {
        const response = await axios.get(BASE_URL);
        const html = response.data;
        const $ = cheerio.load(html);

        const data = [];

        $('#results .title-card').each((index, element) => {
            const title = $(element).attr('data-title-name');
            const status = $(element).attr('data-title-status');
            const url = "https://xemu.app" + $(element).find('a').attr('href');
            const thumbnail = $(element).find('.title-card-image-container img').attr('src');

            // Check if thumbnail is correctly fetched
            if (thumbnail) {
                console.log(`Thumbnail URL: ${thumbnail}`);
            } else {
                console.log(`Thumbnail not found for title: ${title}`);
            }

            data.push({ title, url, status, thumbnail });
        });

        console.log('Scraping complete!');

        // Save the data to a JSON file
        fs.writeFileSync('xemu.json', JSON.stringify(data, null, 2));
        console.log('Data exported to xemu.json');

    } catch (error) {
        console.error('Error fetching page:', error);
    }
}

// Call the scrapePage function to start the scraping process
scrapePage();
