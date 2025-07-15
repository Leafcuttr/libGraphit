import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
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
            [1672531200, '0.5'],
            [1672531260, '0.6'],
            [1672531320, '0.4'],
            [1672531380, '0.5'],
            [1672531440, '0.7'],
            [1672531500, '0.8'],
            [1672531560, '0.6'],
            [1672531620, '0.5'],
            [1672531680, '0.4'],
            [1672531740, '0.5']
          ]
        }
      ]
    }
  };

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
