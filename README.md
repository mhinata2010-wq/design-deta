# design-deta

UI / design reference experiments and visual prototypes are stored here separately from the production application.

## Policy
- This repository is for design experiments, references, and prototypes.
- Production source of truth lives in `building-schedule`.
- Third-party commercial source code and assets are not stored here.
- Reference implementations should be clearly labeled with their source/inspiration and should remain independently implemented.

## References

### `codebase-client-ui/`
Codebase-style client UI archive for earlier construction SaaS experiments.

### `field-ops-motion-template/`
Construction field SaaS design template inspired by publicly available KANNA interface patterns, with independently implemented motion and interactions.

Includes:
- project dashboard information architecture
- weekly Gantt schedule
- draggable / resizable schedule bars
- sidebar collapse
- status stepper
- task detail drawer
- schedule creation modal
- command palette
- toast / loading / reduced-motion states

See [`field-ops-motion-template/README.md`](./field-ops-motion-template/README.md) for references, design rationale, and motion tokens.
