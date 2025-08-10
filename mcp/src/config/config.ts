const config = {
    input: "../../data/package.json",
    output: "../storage/sitemaps.json",
    outputContext: (name: string) => `../storage/context/${name}.json`
}

export default config
