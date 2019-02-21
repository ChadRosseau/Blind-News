const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage');
const os = require('os');
const path = require('path');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// Point in video: 21:06. Try to figure out how to implement with additional pathing to image.
exports.onFileChange = functions.storage.object().onFinalize(event => {
	const object = event.data;
	const bucket = object.bucket;
	const contentType = object.contentType;
	const filePath = object.name;
	console.log("File change detected, function execution started.")
	
	if (path.basename(filePath).startsWith('renamed-')) {
		console.log("File already renamed.");
		return; 
	}

	const destBucket = gcs.bucket(bucket);
	const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
	const metadata = { contentType: contentType };
	return destBucket.file(filePath).download({
		destination: tmpFilePath
	}).then(() => {
		return destBucket.upload(tmpFilePath, {
			destination: 'renamed-' + path.basename(filePath),
			metadata: metadata
		})
	});
});

