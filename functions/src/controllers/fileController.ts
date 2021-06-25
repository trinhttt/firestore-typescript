import { db, bucket } from '../config/firebase'
import { Request, Response, NextFunction } from 'express'
import returnSuccess from '../utilities/successHandler'
import { v4 as uuidv4 } from 'uuid'
import BusBoy from 'busboy';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export const uploadFileViaPath = async (req: Request, res: Response, next: NextFunction) => {
  var localPath = req.body.filename
  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      // If image doesn't have token, it will be loading 4E
      firebaseStorageDownloadTokens: uuidv4()
    },
    contentType: 'image/png',
    //By default, Cache-Control is set to private. 
    //This means that if you don't explicitly set Cache-Control to public, 
    //only the browser of the requesting user is allowed to cache the content.
    //max-age: Tells the browser and the CDN how many seconds that they can cache the content
    // Full HD: https://firebase.google.com/docs/hosting/manage-cache
    cacheControl: 'public, max-age=31536000',// 1 year
  }
  try {
    await bucket.upload(
      localPath, {
      // gzip is a form of data compression: it typically reduces the size of a file
      // file to be transferred faster and stored using less space
      gzip: true,
      metadata: metadata
    })
    console.log(`${localPath} uploaded.`);
    
    returnSuccess(201, res, `Uploaded ${req.body.filename}`, null)
  } catch (e) {
    next(e)
  }
}

// Use busBoy is ok with functions.https.onRequest(app)
export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const busBoy = new BusBoy({
      headers: req.headers
    });

    let imageFileName: string;
    let imageToBeUploaded: { [key: string]: string } = {};//??KDL

    // @ts-ignore
    busBoy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
      console.log(fieldName, file, fileName, encoding, mimeType);
      if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
        return res.status(400).json({
          error: 'Wrong file type submitted!'
        });
      } else {
        // example: my.image.png
        const imageExtension = fileName.split(`.`)[fileName.split(`.`).length - 1];
        // example: 56473829495738239.png
        imageFileName = `${Math.round(Math.random() * 10000000000)}.${imageExtension}`;
        // "/var/folders/lv/qh6x80rd0fb5x5zj23xp4pxm0000gn/T"
        const filePath = path.join(os.tmpdir(), imageFileName);

        imageToBeUploaded = {
          filePath, mimeType
        };

        //creates a file
        //pipe sẽ nối từ một readable stream sang một writable stream.
        // readable: file
        // writable: fs.createWriteStream(filePath)
        file.pipe(fs.createWriteStream(filePath));
      }
    });

    busBoy.on('finish', async () => {
      await bucket.upload(
        imageToBeUploaded.filePath,
        {
          resumable: false,
          metadata: {
            metadata: {
              firebaseStorageDownloadTokens: uuidv4(),
              contentType: imageToBeUploaded.mimeType
            }
          }
        });
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/vietnam-api-demo.appspot.com/o/${imageFileName}?alt=media`;
      //req.user.handle
      await db
          .collection(`entries`)
          .doc(req.params.entryId)
          .update({ imageUrl });
      returnSuccess(201, res, `Uploaded image.`, { imageURL: imageUrl })
    });

    // @ts-ignore
    busBoy.end(req.rawBody);
    return
  } catch (err) {
    next(err)
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  const srcFilename = req.params.filename
  try {
    await bucket.file(srcFilename).delete()
    returnSuccess(200, res, "Deleted Image", null)
  } catch (error) {
    next(error)
  }
}

// NOT WORK
export const saveFile = async (req: Request, res: Response, next: NextFunction) => {
  const srcFilename = req.body.filename
  try {
    // var bufferStream = new stream.PassThrough();
    // bufferStream.end(Buffer.from(req.body.base64Image, 'base64'));

    let buffer = Buffer.from(req.body.base64Image, 'base64')
    bucket.file(srcFilename).save(buffer);

    returnSuccess(200, res, "Saved File", null)
  } catch (error) {
    next(error)
  }
}
export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
  const srcFilename = req.params.filename
  try {
    //s.tmpdir(): "/var/folders/lv/qh6x80rd0fb5x5zj23xp4pxm0000gn/T"
    //tempFilePath: '/var/folders/lv/qh6x80rd0fb5x5zj23xp4pxm0000gn/T/file.png'
    const tempFilePath = path.join(os.tmpdir(), srcFilename);
    await bucket
      .file(srcFilename)
      .download({
        destination: tempFilePath,
        // avoid error down image upload with gzip: The downloaded data did not match the data from the server. 
        // To be sure the content is the same, you should download the file again
        validation: false 
      });
    returnSuccess(200, res, "downloaded File", null)
  } catch (error) {
    next(error)
  }
}

export const deleteAllFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await bucket.deleteFiles();
    returnSuccess(200, res, "deleted all files", null)
  } catch (error) {
    next(error)
  }
}

// import Multer from "multer"
const Multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).single("file");
//NOTE:req.file is always empty with functions.https.onRequest(app)
export const uploadFileData = async (req: Request, res: Response) => {
  try {
    await processFile(req, res);
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err: any) => {
      console.log(err);
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      // const publicUrl = format(
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      // );
      res.status(200).send(publicUrl);
    });

    blobStream.end(req.body.file.buffer);
  } catch (err) {
    console.log(err);
  }
}
