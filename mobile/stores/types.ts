export type Command<State> = State & {
  execute(state?: State): Promise<void>;
  setState(state: Partial<State>): void;
  clearState(): void;
}