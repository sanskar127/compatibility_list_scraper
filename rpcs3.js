const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Function to scrape a single page
const scrapePage = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const items = [];
        $('.compat-table-inside label').each((index, element) => {
            // Id => Region, Game IDs, Game Title, Status, Date, Hashtag(optional)

            const gameId = [];

            const imageSources = $(element).find('.compat-table-cell-gameid img').map((i, img) => $(img).attr('src')).get();
            const gameIdLinks = $(element).find('.compat-table-cell-gameid a');
            const gameIds = gameIdLinks.map((i, el) => $(el).text().trim()).get();

            // Define the regions based on the image sources
            const regions = [];

            imageSources.forEach(src => {
                if (src === "/img/icons/compat/EU.png") {
                    regions.push("eu");
                } else if (src === "/img/icons/compat/US.png") {
                    regions.push("us");
                } else if (src === "/img/icons/compat/JP.png") {
                    regions.push("jp");
                } else if (src === "/img/icons/compat/HK.png") {
                    regions.push("hk");
                }
            });

            // Assuming the number of regions matches the number of gameIds
            for (let i = 0; i < regions.length; i++) {
                gameId.push({
                    region: regions[i],
                    serial: gameIds[i]
                });
            }

            // Extract game title
            const type = $(element).find('.compat-table-cell').eq(1).find('a:nth-child(1)').attr('title');

            const title = $(element).find('.compat-table-cell').eq(1).find('a:nth-child(2)').text().trim();

            // Extract status
            const status = $(element).find('.compat-table-cell-status .txt-compat-status').text().trim();

            // Extract updated date
            const updated = $(element).find('.compat-table-cell-updated a').first().text().trim();

            const tag = $(element).find('.compat-table-cell-updated a').eq(1).text().trim();

            // Extract image src attributes

            items.push({
                gameId,
                type,
                title,
                status,
                updated,
                tag,

            });
        });

        return items;
    } catch (error) {
        console.error(`Error fetching ${url}: ${error.message}`);
        return [];
    }
};

// Function to scrape multiple pages
const scrapeMultiplePages = async (baseUrl, totalPages) => {
    let allItems = [];
    for (let i = 1; i <= totalPages; i++) {
        const url = `${baseUrl}${i}`; // Adjust this URL as needed
        console.log(`Scraping ${url}`);
        const items = await scrapePage(url);
        allItems = allItems.concat(items);
    }
    return allItems;
};

// Main function to run the scraper
const main = async () => {
    const baseUrl = 'https://rpcs3.net/compatibility?p='; // Replace with the target website's base URL
    const totalPages = 155; // Number of pages to scrape
    const allItems = await scrapeMultiplePages(baseUrl, totalPages);

    // Write the scraped data to a JSON file
    fs.writeFileSync('rpcs3.json', JSON.stringify(allItems, null, 2), 'utf-8');
    console.log('Data has been written to data.json');
};

// Execute the main function
main();
