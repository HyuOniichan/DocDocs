import * as cheerio from 'cheerio';
import { InfoType } from '../types/';

const baseUrl = 'https://npmjs.com/package/'

async function scrapeNpmPage(name: string): Promise<InfoType> {

    const url = baseUrl + name;

    try {
        const res = await fetch(url);
        const html = await res.text(); 
        const $ = cheerio.load(html);

        const repository = $('#repository-link').text().trim();
        const homepage = $('#homePage-link').text().trim(); 

        return {
            repository: `https://${repository}`,
            homepage: `https://${homepage}`
        }
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return {
            repository: "",
            homepage: ""
        }
    }
}

export default scrapeNpmPage
