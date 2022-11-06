import type { GetServerSideProps, NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';
import { dehydrate } from '@lib/hydration';
import { getUser, type User } from '@lib/data';

const HomePage: NextPage = () => {
  const query = useQuery<User>(['user', 1], async () => {
    const resp = await fetch('http://localhost:3000/api/users/a');

    return resp.json();
  });

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6">
      {query.isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="text-4xl text-indigo-800">
          Hey <span className="bg-yellow-200 p-2">{query.data?.name}.</span>
        </div>
      )}
      <p className="text-slate-600">
        Start by editing{' '}
        <code className="rounded-lg bg-slate-600 p-1 text-slate-200">
          pages/index.tsx
        </code>
      </p>
    </div>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userId = params?.id as string;
  const user = await getUser(userId);

  return await dehydrate(async (queryClient) => {
    queryClient.setQueryData(['user', userId], user);
  });
};
