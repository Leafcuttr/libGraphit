import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const now = Date.now() / 1000; // Convert to seconds
  const data = {
    status: 'success',
    data: {
      resultType: 'matrix',
      result: [
        {
          metric: {
            __name__: 'cpu_usage',
            instance: 'localhost:9090',
            job: 'prometheus'
          },
          values: [
            [now, '0.5'],
            [now-60, '0.6'],
            [now-60*2, '0.4'],
            [now-60*3, '0.5'],
            [now-60*4, '0.7'],
            [now-60*5, '0.8'],
            [now-60*6, '0.6'],
            [now-60*7, '0.5'],
            [now-60*8, '0.4'],
            [now-60*9, '0.5']
          ]
        }
      ]
    }
  };

  return json(data);
};
