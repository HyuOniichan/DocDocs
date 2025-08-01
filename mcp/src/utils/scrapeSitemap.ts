import { PlaywrightCrawler } from 'crawlee';
import { LinkType } from '../types';

const scrapeSitemap = async (page_urls: string[]): Promise<LinkType[]> => {
    const data: LinkType[] = [];

    // Hardcode 
    const maxRequest = 7; 

    try {
        const crawler = new PlaywrightCrawler({
            async requestHandler({ request, page, enqueueLinks, log }) {
                const title = await page.title();
                log.info(`Title of ${request.loadedUrl} is '${title}'`);

                data.push({
                    url: request.loadedUrl,
                    title,
                    content: ""
                })

                await enqueueLinks();
            },
            maxRequestsPerCrawl: maxRequest,
        });

        await crawler.run(page_urls);
    } catch {
        console.log("Failed to scrape website");
    } 

    return data;
}

export default scrapeSitemap
