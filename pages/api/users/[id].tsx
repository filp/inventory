import { endpoint, asHandler } from 'next-better-api';
import { z } from 'zod';
import { getUser } from '@lib/data';

export default asHandler([
  endpoint(
    {
      method: 'get',
      querySchema: z
        .object({
          id: z.string().min(1).max(128),
        })
        .strict(),
    },
    async ({ query }) => {
      const userId = query.id;
      const user = await getUser(userId);

      return {
        status: 200,
        body: user,
      };
    }
  ),
]);
