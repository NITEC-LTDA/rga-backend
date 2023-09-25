import { ReadStream } from 'node:fs'
import * as AWS_S3 from '@aws-sdk/client-s3'

import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Readable } from 'node:stream'
import { StorageService } from '../storage.service'
@Injectable()
export class S3StorageService implements StorageService {
  private S3: AWS_S3.S3Client
  private readonly BUCKET: string

  constructor() {
    this.S3 = new AWS_S3.S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_STORAGE_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_STORAGE_SECRET_ACCESS_KEY,
      },
      apiVersion: '2006-03-01',
    })
    this.BUCKET = process.env.AWS_BUCKET // Make sure to set this environment variable
  }

  /**
   * Retrieve a blob (file/object) from the S3 bucket.
   * @param {string} key - The key (filename) of the blob to retrieve.
   * @returns {Promise<AWS_S3.GetObjectOutput>} - A promise that resolves to the retrieved blob.
   */
  async getBlob(key: string): Promise<AWS_S3.GetObjectOutput> {
    const params = { Bucket: this.BUCKET, Key: key }
    return this.S3.send(new AWS_S3.GetObjectCommand(params))
  }

  /**
   * Upload a blob (file/object) to the S3 bucket.
   * @param {string} blobName - The name to give to the uploaded blob.
   * @param {Buffer} blob - The blob to upload.
   * @returns {Promise<AWS_S3.PutObjectOutput>} - A promise that resolves to the metadata of the uploaded blob.
   */
  async putBlob(
    blobName: string,
    blob: Buffer,
    mimeType: string, // new parameter
  ): Promise<AWS_S3.PutObjectOutput> {
    const params = {
      Bucket: this.BUCKET,
      Key: blobName,
      Body: blob,
      ContentType: mimeType, // use specific mime type
    }
    try {
      const command = new AWS_S3.PutObjectCommand(params)
      return await this.S3.send(command)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Uploads a stream of data to an AWS S3 bucket.
   * @param {string} key - The key (file name) under which to store the new object.
   * @param {ReadStream | Readable} stream - The stream of data to upload.
   * @returns {Promise<void>} - A promise that resolves when the upload is complete.
   */
  async putStream(key: string, stream: ReadStream | Readable): Promise<void> {
    const params = {
      Bucket: this.BUCKET,
      Key: key,
      Body: stream,
      ContentType: 'application/octet-stream',
    }
    try {
      await new Promise((resolve, reject) => {
        this.S3.send(
          new AWS_S3.PutObjectCommand(params),
          (err: Error, data: any) => {
            if (err) {
              reject(new InternalServerErrorException(err))
            } else {
              resolve(data)
            }
          },
        )
      })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Delete a blob (file/object) from the S3 bucket.
   * @param {string} key - The key (filename) of the blob to delete.
   * @returns {Promise<AWS_S3.DeleteObjectOutput>} - A promise that resolves to the metadata of the deleted blob.
   * @throws {InternalServerErrorException} - Throws an internal server error exception if the deletion fails.
   */
  async deleteBlob(key: string): Promise<AWS_S3.DeleteObjectOutput> {
    const params = {
      Bucket: this.BUCKET,
      Key: key,
    }
    try {
      return await this.S3.send(new AWS_S3.DeleteObjectCommand(params))
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Get the public URL of a blob (file/object) from the S3 bucket.
   * @param {string} key - The key (filename) of the blob whose URL is to be retrieved.
   * @returns {string} - The public URL of the blob.
   */
  getObjectUrl(key: string): string {
    return `https://${this.BUCKET}.s3.amazonaws.com/${key}`
  }
}
