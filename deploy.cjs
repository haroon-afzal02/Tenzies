const ghpages = require('gh-pages');

ghpages.publish(
  'dist', // folder to publish
  {
    branch: 'gh-pages',
    repo: 'https://github.com/haroon-afzal02/Tenzies.git',
    message: '🚀 Manual deploy from script',
  },
  function (err) {
    if (err) {
      console.error('❌ Deployment failed:', err);
    } else {
      console.log('✅ Successfully deployed to GitHub Pages!');
    }
  }
);
