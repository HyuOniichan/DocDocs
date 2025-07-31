import { DepsType, InfoType, LinkType, StorageType, StoredDepType } from '../types/'
import importJson from '../utils/importJson'
import config from '../config/config'
import { getInfo, getLinks } from './scrapeService';

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

        console.error(1)
        console.error(storage)
        console.error(storage.storage)

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
            editingPackage.info = await getInfo(name);

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
            const scrapedLinks = await getLinks(editingPackage.links.map((l: LinkType) => l.url));
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

export {
    getPackages,
    initSitemaps,
    getSitemaps,
    setSitemap
}
