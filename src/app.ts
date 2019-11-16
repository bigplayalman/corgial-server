import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import companion from '@uppy/companion';
import session from 'express-session';
import * as fileCtrl from './fileController';
require('dotenv').config();

const app = express();
app.use(bodyParser.json())
app.use(session({
  secret: 'some-secret',
  resave: true,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, Content-Type, Accept'
  )
  next()
})

// Routes
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.send('Welcome to Companion')
})

app.get('/api/download', asyncHandler(fileCtrl.download));

export function asyncHandler(handler: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!handler) {
      next(new Error(`Invalid handler ${handler}, it must be a function.`));
    } else {
      handler(req, res, next).catch(next);
    }
  };
}

// initialize uppy
const uppyOptions = {
  providerOptions: {
    s3: {
      getKey: (_req: Request, filename: string) => filename,
      key: process.env.S3_ACCESS_KEY_ID,
      secret: process.env.S3_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET_NAME,
      region: "us-east-1",
      useAccelerateEndpoint: false // default: false
    }
    // you can also add options for dropbox here
  },
  server: {
    host: 'localhost:3300',
    protocol: 'http'
  },
  filePath: './output',
  secret: 'some-secret',
  debug: true
}

app.use(companion.app(uppyOptions))

// handle 404
app.use((req, res, next) => {
  return res.status(404).json({ message: 'Not Found' })
})

// handle server errors
app.use((err, req, res, next) => {
  console.error('\x1b[31m', err.stack, '\x1b[0m')
  res.status(err.status || 500).json({ message: err.message, error: err })
})

companion.socket(app.listen(3300), uppyOptions)

console.log('Welcome to Companion!')
console.log(`Listening on http://0.0.0.0:${3300}`)