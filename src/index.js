function createSpecs(packagePath) {
  const src = extendPackagePathSrc(packagePath),
    dist = extendPackagePathDist(packagePath),
    result = extendPackagePathResult(packagePath);

  const bookings = fs.readFilesInDirSync(dist.bookings);
  const specs = fs.readFilesInDirSync(src.specs);

  bookings.forEach(booking => {
    specs.forEach(spec => {
      const specName = `${path.basename(booking.name, ".json")}__${spec.name}`;
      const specBaseName = path.basename(specName, ".spec.js");
      fs.outputFileSync(
        path.join(dist.specs, specName),
        `/* injected */
          const injected = ${booking.content};
          let screenshotIndex = 0;
          function shot(name) {
            return;
            browser.saveScreenshot('${
              result.successShots
            }' + screenshotIndex + '__${specBaseName}__' + name + '.png');
            screenshotIndex++;
          }

        /* injected */
        ${spec.content}`
      );
    });
  });
}
console.log("Hello world!");
