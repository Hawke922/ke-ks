export interface ImageMetadata {
    id?: string;
    base64Image?: string;
    imageBlob?: Blob;
    name: string;
    type: string;
    size: number;
    lastModified?: Date;
}