import { setup } from 'xstate';

// State machine for a single Sandbox Task lifecycle.
// Enforces PENDING -> RUNNING -> COMPLETED or FAILED
// Prevents race conditions, double-launches, and orphaned tasks.
export const sandboxTaskMachine = setup({
  types: {
    context: {} as { id: string },
    events: {} as
      | { type: 'LAUNCH' }
      | { type: 'COMPLETE' }
      | { type: 'FAIL' }
      | { type: 'RETRY' }
      | { type: 'CANCEL' },
  },
}).createMachine({
  id: 'sandboxTask',
  context: { id: '' },
  initial: 'pending',
  states: {
    pending: {
      on: {
        LAUNCH: 'running',
        CANCEL: 'cancelled',
      },
    },
    running: {
      on: {
        COMPLETE: 'completed',
        FAIL: 'failed',
        CANCEL: 'cancelled',
      },
    },
    completed: {
      type: 'final',
    },
    failed: {
      on: {
        RETRY: 'pending',
      },
    },
    cancelled: {
      type: 'final',
    },
  },
});
