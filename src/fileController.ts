import { getFileLink, uploadFile } from './fileComponent';
import { Response, Request } from 'express';

export interface file {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export async function download(req: Request, res: Response) {
  let response = await getFileLink(req.query.filename);
  res.send(response);
  res.end();
}

export async function upload(req: Request & { file: file }, res: Response) {
  console.log('request', req);
  let response = await uploadFile(req.file.originalname, req.file.path);
  res.send(response);
  res.end();
}