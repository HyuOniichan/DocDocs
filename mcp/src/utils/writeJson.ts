import { writeFile } from 'node:fs/promises'

// Hardcode path 
export default async function writeJson(data: unknown, filePath: string = "./src/storage/sitemaps.json") {
    writeFile(filePath, JSON.stringify(data, null, 4))
}
