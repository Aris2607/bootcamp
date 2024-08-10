import { faker } from "@faker-js/faker";

export const commentsData = [
  {
    id: 1,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
  {
    id: 2,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
  {
    id: 3,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
  {
    id: 4,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
  {
    id: 5,
    name: faker.person.fullName(),
    imgURL: faker.image.avatar(),
    content: faker.lorem.sentence(),
    time: faker.date.soon().toString(),
  },
];
