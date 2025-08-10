import { writeFile } from 'node:fs/promises'
import { StorageType } from '../types/'

// Hardcode path 
export default async function writeJson(data: StorageType, filePath: string = "./src/storage/sitemaps.json") {
    writeFile(filePath, JSON.stringify(data, null, 4))
}
