type InfoType = {
    repository: string, 
    homepage: string
}

type DepsType = {
    dependencies: string[];
    devDependencies: string[];
}

type LinkType = {
    url: string; 
    title: string;
    content: string; 
}

type StoredDepType = {
    name: string; 
    info: InfoType; 
    links: LinkType[];
}

type StorageType = {
    storage: StoredDepType[];
}

export {
    InfoType, 
    DepsType, 
    LinkType, 
    StoredDepType, 
    StorageType
}
