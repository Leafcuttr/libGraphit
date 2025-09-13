# Development Guide

This guide helps you set up the development environment for libGraphit.

## Prerequisites

- Node.js 20+ 
- npm 10+

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd libgraphit
```

2. Install dependencies:
```bash
npm install
```

3. Build all packages:
```bash
npm run build
```

## Development Workflow

### Working on the Core Library

```bash
cd packages/core
npm run dev  # Watch mode for TypeScript compilation
```

### Working on the Svelte Adapter

```bash
cd packages/svelte  
npm run dev  # Watch mode for Svelte packaging
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=packages/core
npm test --workspace=packages/svelte
```

### Linting

```bash
# Lint all packages
npm run lint

# Lint specific package
npm run lint --workspace=packages/core
```

## Project Structure

```
libgraphit/
├── packages/
│   ├── core/                 # Framework-agnostic core library
│   │   ├── src/
│   │   │   ├── index.ts      # Main exports
│   │   │   ├── types.ts      # TypeScript interfaces
│   │   │   ├── constants.ts  # Constants and mappings
│   │   │   ├── parser.ts     # Grafana JSON parser
│   │   │   ├── mapper.ts     # Chart.js config mapper
│   │   │   ├── renderer.ts   # Main renderer class
│   │   │   └── utils.ts      # Utility functions
│   │   └── package.json
│   └── svelte/               # Svelte adapter
│       ├── src/
│       │   ├── index.ts      # Main exports
│       │   ├── types.ts      # Svelte-specific types
│       │   ├── GrafanaPanel.svelte  # Main component
│       │   └── action.ts     # Svelte action
│       └── package.json
├── examples/                 # Usage examples
├── docs/                     # Documentation
├── package.json              # Root package.json (workspace)
└── tsconfig.json             # Root TypeScript config
```

## Architecture

### Core Library (`@leafcuttr/libgraphit-core`)

The core library is framework-agnostic and handles:

1. **Grafana JSON Parsing** (`parser.ts`)
   - Validates panel JSON structure
   - Extracts queries, configuration, and metadata
   - Maps to internal representation

2. **Chart.js Configuration Mapping** (`mapper.ts`)
   - Maps panel types to Chart.js chart types
   - Generates Chart.js configuration objects
   - Applies themes and styling

3. **Renderer Orchestration** (`renderer.ts`)
   - Coordinates parsing and mapping
   - Creates and manages Chart.js instances
   - Handles updates and lifecycle

### Svelte Adapter (`@leafcuttr/libgraphit-svelte`)

The Svelte adapter provides:

1. **GrafanaPanel Component** (`GrafanaPanel.svelte`)
   - Reactive Svelte component
   - Handles canvas creation and lifecycle
   - Provides props for configuration

2. **Svelte Action** (`action.ts`)
   - Lower-level action for custom usage
   - Direct canvas manipulation
   - Manual lifecycle management

## Adding New Panel Types

To add support for a new Grafana panel type:

1. Add the panel type to `SUPPORTED_PANEL_TYPES` in `constants.ts`
2. Add Chart.js mapping in `CHART_TYPE_MAPPING`
3. Update the parser in `parser.ts` to handle the new type
4. Add specific configuration logic in `mapper.ts`
5. Add tests for the new panel type

## Adding Framework Adapters

To create a new framework adapter (e.g., React, Vue):

1. Create a new package directory: `packages/react`
2. Add workspace reference in root `package.json`
3. Create framework-specific components/hooks
4. Import and use the core library
5. Follow the same patterns as the Svelte adapter

## Testing Strategy

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test complete rendering pipeline
- **Component Tests**: Test framework-specific components
- **Visual Regression Tests**: Ensure chart output consistency

## Mock Implementation Notes

The current implementation includes mock functions and components for development:

- Chart.js dependencies are referenced but not actually used yet
- Prometheus plugin integration is mocked
- Console logging is used extensively for debugging
- Error handling includes mock error states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Release Process

1. Update version numbers in all package.json files
2. Update CHANGELOG.md
3. Create git tag
4. Publish to npm (when ready)

```bash
npm run build
npm run test
npm publish --workspaces
```