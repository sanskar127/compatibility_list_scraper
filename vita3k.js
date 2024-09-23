const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://vita3k.org/compatibility.html'; // Replace with the actual URL where your table is located.

async function scrapeTable() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const results = [];

        $('table .table-hover tbody tr').each((index, element) => {
            const titleId = $(element).find('td:nth-child(1) small').text().trim();
            const entryName = $(element).find('td:nth-child(2) a small').text().trim();
            const status = $(element).find('td:nth-child(3) small').text().trim();

            results.push({ titleId, entryName, status });
        });

        console.log(results);
    } catch (error) {
        console.error(`Error fetching the URL: ${error.message}`);
    }
}

scrapeTable();
