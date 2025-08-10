import { DepsType, InfoType, LinkType, StorageType, StoredDepType } from '../types'
import importJson from '../utils/importJson'
import config from '../config/config'
import scrapePage from '../utils/scrapePage';
import scrapeNpmPage from '../utils/scrapeNpm';
import scrapeSitemap from '../utils/scrapeSitemap';

const getPackages = async (): Promise<DepsType> => {
    try {
        const packages = await importJson(config.input);

        const deps = Object.keys(packages.dependencies ?? [])
        const devDeps = Object.keys(packages.devDependencies ?? [])

        return {
            dependencies: deps,
            devDependencies: devDeps
        } as DepsType
    } catch {
        return {
            dependencies: [],
            devDependencies: []
        } as DepsType
    }
}

const initSitemaps = async (): Promise<StorageType> => {
    try {
        const deps = await getPackages();

        const storedPackages = {
            storage: []
        } as StorageType

        // Skip devDependencies for now
        storedPackages.storage = deps.dependencies.map((d): StoredDepType => ({
            name: d,
            info: { repository: "", homepage: "" },
            links: []
        }))

        return storedPackages;
    } catch {
        return {
            storage: []
        }
    }
}

const getSitemaps = async (): Promise<StorageType> => {
    try {
        const storage = await importJson(config.output);
        return storage;
    } catch {
        return {
            storage: []
        }
    }
}

const setSitemap = async (name: string): Promise<StoredDepType> => {
    try {
        const storage = await importJson(config.output);

        const editingPackage = storage.storage.find((p: StoredDepType) => p.name === name);

        // check if the editingPackage exists, if not, return 
        if (editingPackage === undefined) {
            console.error("Package not found")
            return {
                name: "",
                info: { repository: "", homepage: "" },
                links: []
            };
        }

        if (editingPackage.info.repository === "" && editingPackage.info.homepage === "") {
            editingPackage.info = await scrapeNpmPage(name);

            if (editingPackage.info.repository === "" && editingPackage.info.homepage === "") {
                console.error("Failed to get package's info");
            }

            if (editingPackage.info.homepage !== "") {
                editingPackage.links.push({
                    url: editingPackage.info.homepage,
                    title: "Homepage",
                    content: ""
                })
            }
        }

        // There must be at least 1 link (homepage link)
        if (editingPackage.links.length > 0) {
            const scrapedLinks = await scrapeSitemap(editingPackage.links.map((l: LinkType) => l.url));
            console.error(scrapedLinks)
            editingPackage.links = scrapedLinks
        } else {
            console.error("Homepage url not found");
        }

        return editingPackage;

    } catch (e) {
        console.error("Failed to set sitemap")
        console.error("Error: ", e)
        return {
            name,
            info: { repository: "", homepage: "" },
            links: []
        }
    }
}

const getPage = async (name: string, title: string): Promise<string> => {
    try {
        const storage = await importJson(config.output);

        const links = storage.storage.find((p: StoredDepType) => p.name === name)?.links;
        if (links === undefined || links.length === 0) {
            console.error(`No links found for package: ${name}`);
            return "";
        }

        const pageUrl = links.find((l: LinkType) => l.title === title)?.url;
        if (pageUrl === undefined) {
            console.error(`No link found with title: ${title}`);
            return "";
        }
        
        const page = await scrapePage(pageUrl);
        if (page === "") {
            console.error(`Failed to scrape page: ${pageUrl}`);
            return "";
        }
        
        return page; 

    } catch (e) {
        console.error("Failed to get page")
        return ""; 
    }
}

export {
    getPackages,
    initSitemaps,
    getSitemaps,
    setSitemap,
    getPage
}
