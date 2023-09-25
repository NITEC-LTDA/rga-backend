import { Readable } from 'node:stream'
import { ReadStream } from 'node:fs'
export abstract class StorageService {
  abstract getBlob(key: string): Promise<any>

  abstract putBlob(
    blobName: string,
    blob: Buffer,
    mimeType: string,
  ): Promise<any>

  abstract putStream(key: string, stream: ReadStream | Readable): Promise<void>

  abstract deleteBlob(key: string): Promise<any>

  abstract getObjectUrl(key: string): string
}
