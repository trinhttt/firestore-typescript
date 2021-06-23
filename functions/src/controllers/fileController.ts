import { admin, bucket } from '../config/firebase'
import { Request, Response, NextFunction } from 'express'
// import HTTPError from '../utilities/HTTPError'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  var localPath = req.body.filename
  // const tempFile = path.join(os.tmpdir(), fileName);

  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: uuidv4()//??
    },
    contentType: 'image/png',
    cacheControl: 'public, max-age=31536000',//??
  }
  try {
    await bucket.upload(
      localPath, {
      gzip: true,
      metadata: metadata
    })
    console.log(`${localPath} uploaded.`);
  } catch (e) {
    next(e)
  }
}

export const uploadFileData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
      next(err);
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      // const publicUrl = format(
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      // );
      res.status(200).send(publicUrl);
    });

    blobStream.end(req.body.file.buffer);
  } catch (e) {
    next(e)
  }
}

export const deleteFile = (srcFilename: string) => {
  const bucket = admin.storage().bucket();
  bucket.file(srcFilename).delete();
}

export const saveFile = (srcFilename: string, content: string) => {
  if (admin.apps.length) {
    const bucket = admin.storage().bucket();
    bucket.file(srcFilename).save(content);
  }
}

export const downloadFile = (srcFilename: string) => {
  if (admin.apps.length) {
    const bucket = admin.storage().bucket();
    return bucket.file(srcFilename).download();
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([Buffer.from('', 'utf8')]);
    }, 10);
  });
}
export async function deleteFilesInStorage(): Promise<void> {
  try {
    await admin
      .storage()
      .bucket()
      .deleteFiles();
    console.log(`Storage: all files removed from default bucket`);
  } catch (error) {
    console.error(`deleteFilesInStorage error:`, error);
    process.exit(1);
  }
}

export async function uploadInvoicesFiles(): Promise<void> {
  try {
    const filePath = 'invoices/invoice.jpg';
    await admin
      .storage()
      .bucket()
      .upload(path.resolve(`../../demo-data/storage/${filePath}`), {
        //   destination: getStoragePathToInvoiceImage({
        //     organizationId: 'IsNCAUUIfv9XJoAUyez5',
        //     locationId: 'ndmKZ3FpxsNVwKBOzwDm',
        //     userId: '00000001',
        //     invoiceId: 'INVOICE1',
        //     fileId: 'FILE1',
        //   }),
        metadata: {
          metadata: {
            // this is not a duplication of nested "metadata" field. Check the type if you don't trust me :)
            firebaseStorageDownloadTokens: uuidv4(),
          },
        },
      });
    console.log(`Storage: Invoice image uploaded. Invoice document in Firestore should be created by Cloud Function.`);
  } catch (error) {
    console.error(`uploadInvoicesFiles error:`, error);
    process.exit(1);
  }
}