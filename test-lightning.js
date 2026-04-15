try {
  const parts = [process.platform, process.arch, 'msvc'];
  const pkgName = `lightningcss-${parts.join('-')}`;
  console.log(`Trying to require ${pkgName}...`);
  const pkg = require(pkgName);
  console.log('Success! Package loaded.');
} catch (err) {
  console.error('Failed to load package:', err.message);
}
