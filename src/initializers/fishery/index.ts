import { type Faker, faker } from '@faker-js/faker';
import { Factory, GeneratorFn } from 'fishery';

export abstract class Repository<
  Model,
  Creator extends Model,
  Transient,
> extends Factory<Model, Transient, Creator> {
  constructor(
    generate: (faker: Faker) => GeneratorFn<Model, Transient, Creator>,
  ) {
    super(generate(faker));
  }
}
