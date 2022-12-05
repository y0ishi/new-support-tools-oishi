// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Result } from 'type/lib';
type OKResponse = {
  user: {
    cgg_id: string;
    name: string;
  };
  service: {
    deleted: boolean;
  };
};
type ErrorResponse = {
  errorMessage: string;
};
type Response = Result | ErrorResponse;
export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const request = JSON.parse(req.body);
    const response = await fetch('https://mk973d5m18.execute-api.ap-northeast-1.amazonaws.com/test_frontend/aa', {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
        }),
     });
    if (response.status == 200) {
      const data: OKResponse = await response.json();
      const fixedData = [
        {
          user: data.user,
          service: {
            allowServiceSentence: data.service.deleted ? '解除済み' : '利用中',
            allowServiceImage: data.service.deleted
              ? 'https://img.icons8.com/external-others-phat-plus/64/null/external-authentication-biometric-outline-others-phat-plus-2.png'
              : 'https://img.icons8.com/external-others-phat-plus/64/null/external-authentication-biometric-outline-others-phat-plus.png',
          },
        },
      ];
      res.status(200).json(fixedData);
    } else if (response.status == 404) {
      const emptyText = 'データが見つかりません';
      res.status(404).json({ errorMessage: emptyText });
    } else {
      const data: ErrorResponse = await response.json();
      res.status(response.status).json({ errorMessage: data.errorMessage });
    }
  } catch (error: any) {
    console.log('ERROR', String(error));
    res.status(500).json({ errorMessage: '予期せぬエラーが発生しました。問い合わせてください' });
  }
}
