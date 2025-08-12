type StorageType = Record<string, DocLink[]>

type DocLink = {
    name: string; 
    url: string; 
}

type InfoType = {
    repository: string; 
    homepage: string;
}

export type {
    StorageType, 
    DocLink, 
    InfoType
}
