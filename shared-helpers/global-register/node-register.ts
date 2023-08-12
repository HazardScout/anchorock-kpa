if (!process.version.match(/^v?18[.]/)) {
  throw new Error(`Node 18.X is required, but ${process.version} was used.`);
}
