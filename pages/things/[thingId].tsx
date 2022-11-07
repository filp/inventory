import { useThing } from '@lib/things/useThing';

const ThingPage = () => {
  const { thing } = useThing({ id: 3 });

  return <div>{thing?.name}</div>;
};

export default ThingPage;
