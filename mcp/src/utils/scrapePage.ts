import { PlaywrightCrawler } from 'crawlee';

const scrapePage = async (page_url: string): Promise<string> => {
    let data: string = "";
    
    try {
        const crawler = new PlaywrightCrawler({
            async requestHandler({ request, page, log }) {
                data = await page.content();
                log.info(`Content of ${request.loadedUrl} is '${data.slice(0, 100)}...'`);
            }
        });

        await crawler.run([page_url]);
    } catch {
        console.error("Failed to scrape page");
    } 

    return data;
}

export default scrapePage
