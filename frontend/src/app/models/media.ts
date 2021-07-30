export interface Media {
    id: number;
    title: string;
    releaseYear?: number;
    publisher?: string;
    description?: string;
    genre?: string;
    mediaTyp: string,
    purchasePrice?: number;
    tags?: Array<string>;
}