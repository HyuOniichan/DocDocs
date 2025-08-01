import { InfoType, LinkType } from "../types/"
import scrapeNpmPage from "../utils/scrapeNpm"
import scrapeSitemap from "../utils/scrapeSitemap";

const getInfo = async (name: string) => {
    try {
        const searchResult: InfoType = await scrapeNpmPage(name); 
        return searchResult; 
    } catch {
        return {
            repository: "",
            homepage: ""
        }
    }
}

const getLinks = async (start_url: string[]) => {
    try {
        const crawlResult: LinkType[] = await scrapeSitemap(start_url); 
        return crawlResult; 
    } catch {
        console.log("Failed to get links");
        return [];
    }
}

export {
    getInfo, 
    getLinks
}
