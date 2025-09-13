set -ex

pushd packages/core/
rm -rf dist/
npm run build
npm publish
popd

pushd packages/svelte/
rm -rf dist/
npm run build
npm publish
popd