const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const { format } = require('util');

const storage = new Storage({
  projectId: 'app-expand-business',
  keyFilename: './serviceAccountKey.json'
});

const bucketName = 'app-expand-business.appspot.com';

function uploadFileToFirebaseStorage(file, pathImage) {
  return new Promise((resolve, reject) => {
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(pathImage);

    const metadata = {
      contentType: 'image/png',
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    };

    const blobStream = blob.createWriteStream({ metadata });

    blobStream.on('error', (error) => {
      console.error('Error al subir el archivo a Firebase Storage:', error);
      reject(error);
    });

    blobStream.on('finish', () => {
      const url = format(
        `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media&dl=0&token=${uuid}`
      );
      resolve(url);
      console.log(url);
    });

    blobStream.end(file.buffer);
  });
}

async function getImagesOfExperience() {
  try {
    const [files] = await storage.bucket(bucketName).getFiles({ prefix: 'experience' });
    const images = [];
    for (const file of files) {
      const signedURL = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-9999'
      });
      images.push(signedURL[0]);
    }
    return images;
  } catch (error) {
    console.log(`Error al obtener las imágenes: ${error}`);
    return null;
  }
}

async function getCompanyImages() {
  try {
    const [files] = await storage.bucket(bucketName).getFiles({ prefix: 'companies' });
    const images = [];
    for (const file of files) {
      const signedURL = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-9999'
      });
      images.push(signedURL[0]);
    }
    return images;
  } catch (error) {
    console.log(`Error al obtener las imágenes: ${error}`);
    return null;
  }
}

module.exports = {
  uploadFileToFirebaseStorage,
  getImagesOfExperience,
  getCompanyImages
};
