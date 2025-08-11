type DocLink = {
    id: string;
    name: string;
    url: string;
    selected: boolean;
}

type TechDoc = {
    id: string;
    name: string;
    links: DocLink[];
    expanded: boolean;
}

export type {
    TechDoc, DocLink
}
