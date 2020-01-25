import { getFileLink, uploadFile } from './fileComponent';
import { Response, Request } from 'express';

export async function download(req: Request, res: Response) {
  let response = await getFileLink(req.query.filename);
  res.send(response);
  res.end();
}


export async function upload(req: Request, res: Response) {
  let response = await uploadFile(req.file.originalname, req.file.path);
  res.send(response);
  res.end();
}