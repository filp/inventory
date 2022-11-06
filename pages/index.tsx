import { trpc } from '@lib/trpc';

export default function IndexPage() {
  const hello = trpc.bye.useQuery({ text: 'client' });

  if (!hello.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}
