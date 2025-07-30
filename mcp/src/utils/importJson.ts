// Hardcode input path
export default async function importJson(filePath: string) {
    try {
        const packages = await import(filePath, {
            with: { type: "json" }
        }).then(m => m.default)

        return packages;
    } catch {
        return {
            error: "Failed to import json"
        }
    }
}
