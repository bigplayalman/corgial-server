import { getFileLink } from './fileComponent';
import { Response, Request } from 'express';

export async function download(req: Request, res: Response) {
  let response = await getFileLink(req.query.filename);
  res.send(response);
  res.end();
}
