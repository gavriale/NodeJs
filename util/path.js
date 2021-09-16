const path = require('path');

/**
 * This gives us the path to the file that responsibole to the fact that our app is running
 * This filname is what we put into the dirname to get a path to that directory
 */
module.exports = path.dirname(process.mainModule.filename);