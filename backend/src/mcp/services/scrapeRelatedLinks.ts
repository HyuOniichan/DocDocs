import { PlaywrightCrawler } from 'crawlee';
import { DocLink } from '../../types';

const scrapeRelatedLinks = async (page_urls: string[], maxRequest: number = 7): Promise<DocLink[]> => {
    const data: DocLink[] = [];

    try {
        const crawler = new PlaywrightCrawler({
            async requestHandler({ request, page, enqueueLinks, log }) {
                const title = await page.title();
                // log.info(`Title of ${request.loadedUrl} is '${title}'`);

                data.push({
                    url: request.loadedUrl,
                    name: title
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

export default scrapeRelatedLinks
