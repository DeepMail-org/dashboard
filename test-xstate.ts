import { setup, createActor } from 'xstate';
const machine = setup({
  types: { events: {} as { type: 'LAUNCH' } }
}).createMachine({
  initial: 'pending',
  states: {
    pending: { on: { LAUNCH: 'running' } },
    running: {}
  }
});
const actor = createActor(machine, { state: machine.resolveState({ value: 'pending', context: undefined }) });
actor.start();
actor.send({ type: 'LAUNCH' });
console.log(actor.getSnapshot().value);
