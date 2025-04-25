import { type Faker, faker } from '@faker-js/faker';
import { Factory, GeneratorFn } from 'fishery';

export abstract class Repository<T, C extends T> extends Factory<
  T,
  unknown,
  C
> {
  constructor(generate: (faker: Faker) => GeneratorFn<T, unknown, C>) {
    super(generate(faker));
  }
}
