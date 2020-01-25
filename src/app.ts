import express, { RequestHandler } from 'express';
import expressAuth from 'express-basic-auth';
import * as fileCtrl from './fileController';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3300;

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));
// app.use(expressAuth({
//   users: { 'admin': 'admin' },
//   unauthorizedResponse: getUnauthorizedResponse,
//   challenge: true
// }));

app.listen(port, () => {
  console.log('Server listening on port %s.', port);
});

function getUnauthorizedResponse(req) {
  return req.auth
    ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
    : 'No credentials provided';
}

var storage = multer.diskStorage({
  destination: './files',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err, file.fieldname);

      cb(null, raw.toString('hex') + path.extname(file.originalname));
    })
  }
})

app.use(multer({ storage: storage }).single('file'));


app.get('/api/download', fileCtrl.download);
app.post('/api/upload', fileCtrl.upload);
