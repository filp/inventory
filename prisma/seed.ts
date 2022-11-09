import {
  seed,
  rand,
  randAccessory,
  randTextRange,
  randNumber,
  randAlphaNumeric,
  randDepartment,
  randBetweenDate,
  randProductAdjective,
  randCounty,
} from '@ngneat/falso';
import prisma from '../server/prisma';
import type { Area } from '../server/areas/schema';
import type { Thing } from '../server/things/schema';
import type { Spot } from '../server/spots/schema';
import type { Collection } from '../server/collections/schema';
import type { Label } from '../server/labels/schema';

const amounts = {
  collections: 3,
  areas: 25,
  spots: 100,
  things: 1200,
  labels: 50,
};

const randomLabelColor = () =>
  rand([
    '#38bdf8',
    '#6366f1',
    '#3730a3',
    '#9333ea',
    '#a21caf',
    '#e11d48',
    '#0d9488',
    '#ea580c',
  ]);

const asId = (id: number) => id + 1;

const randomCreatedAt = () =>
  randBetweenDate({ from: new Date('10/07/2020'), to: new Date('10/07/2021') });

const randomUpdatedAt = () =>
  randBetweenDate({ from: new Date('10/08/2021'), to: new Date() });

const randomDescription = () => randTextRange({ min: 3, max: 256 });

const randomTimeStamps = () => ({
  createdAt: randomCreatedAt(),
  updatedAt: randomUpdatedAt(),
  archivedAt: null,
});

type Id = { id: number };

const collectionFactory = ({ id }: Id): Collection => ({
  id,
  name: randCounty(),
  description: randomDescription(),
  ...randomTimeStamps(),
});

const areaFactory = ({ id }: Id): Area => ({
  id,
  name: randDepartment(),
  description: randomDescription(),

  ...randomTimeStamps(),
});

const spotFactory = ({
  id,
  areaId,
}: Id & {
  areaId: number;
}): Spot => ({
  id,
  areaId,
  name: randDepartment(),
  description: randomDescription(),

  ...randomTimeStamps(),
});

const thingFactory = ({
  collectionId,
  spotId,
}: {
  collectionId: number;
  spotId: number;
}): Thing => ({
  collectionId,
  spotId,
  uid: randAlphaNumeric({ length: 32 }).join(''),
  name: randAccessory(),
  description: randomDescription(),
  quantity: randNumber({ min: 1, max: 3000 }),

  ...randomTimeStamps(),
});

const labelFactory = ({ id }: Id): Label => ({
  id,
  name: randProductAdjective().toLowerCase(),
  description: randomDescription(),
  color: randomLabelColor(),
});

const seedCollections = async () => {
  const collections: Collection[] = [];

  for (let i = 0; i < amounts.collections; i++) {
    const id = asId(i);
    const data = collectionFactory({
      id,
    });

    collections.push(
      await prisma.collection.upsert({
        create: data,
        update: data,
        where: {
          id,
        },
      })
    );
  }

  return collections;
};

const seedLabels = async () => {
  const labels: Label[] = [];

  for (let i = 0; i < amounts.labels; i++) {
    const id = asId(i);
    const data = labelFactory({
      id,
    });

    labels.push(
      await prisma.label.upsert({
        create: data,
        update: data,
        where: {
          id,
        },
      })
    );
  }

  return labels;
};

const seedAreasAndSpots = async () => {
  const areas: Area[] = [];
  const spots: Spot[] = [];

  for (let i = 0; i < amounts.areas; i++) {
    const id = asId(i);
    const data = areaFactory({
      id,
    });

    areas.push(
      await prisma.area.upsert({
        create: data,
        update: data,
        where: {
          id,
        },
      })
    );
  }

  for (let i = 0; i < amounts.spots; i++) {
    const id = asId(i);
    const areaId = rand(areas).id;

    const data = spotFactory({
      id,
      areaId,
    });

    spots.push(
      await prisma.spot.upsert({
        create: data,
        update: data,
        where: {
          id,
        },
      })
    );
  }

  return {
    areas,
    spots,
  };
};

const seedThingsAndLabels = async ({
  collections,
  labels,
  spots,
}: {
  collections: Collection[];
  labels: Label[];
  spots: Spot[];
}) => {
  for (let i = 0; i < amounts.things; i++) {
    const id = asId(i);
    const data = thingFactory({
      collectionId: rand(collections).id,
      spotId: rand(spots).id,
    });

    const dataWithId = {
      ...data,
      id,
    };

    const labelIds = rand(labels, {
      length: randNumber({ min: 0, max: 6 }),
    }).map((l) => l.id);

    await prisma.thing.upsert({
      create: dataWithId,
      update: dataWithId,
      where: {
        id,
      },
    });

    // Delete all thingLabels for this thing:
    await prisma.thingLabel.deleteMany({
      where: {
        thingId: id,
      },
    });

    // rand above isn't guaranteed to return unique entries,
    // so we need to dedup ids:
    const uniqueLabelIds = Array.from(new Set(labelIds));

    // Create new thingLabels for each label:
    await prisma.thingLabel.createMany({
      data: uniqueLabelIds.map((l) => ({
        thingId: id,
        labelId: l,
      })),
    });
  }
};

const seedDatabase = async () => {
  seed('inventory-seed-v1');

  const collections = await seedCollections();
  const labels = await seedLabels();
  const { spots } = await seedAreasAndSpots();

  await seedThingsAndLabels({
    collections,
    labels,
    spots,
  });
};

void seedDatabase();
