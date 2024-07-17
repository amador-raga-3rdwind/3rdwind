
const gulp = require('gulp');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// List of URLs to download JSON files from
const urls = [
"https://api.va.gov/internal/docs/address-validation/v3/openapi.json",
"https://api.va.gov/internal/docs/appeals-status/v0/openapi.json",
"https://api.va.gov/internal/docs/benefits-claims/v2/openapi.json",
"https://api.va.gov/internal/docs/benefits-documents/v1/openapi.json",
"https://api.va.gov/internal/docs/benefits-intake/v1/openapi.json",
"https://api.va.gov/internal/docs/benefits-reference-data/v1/openapi.json"
];

// Directory to save JSON files
const outputDir = path.resolve(__dirname, 'src/assets/JSON');

// Helper function to get file modification date
async function getFileModificationDate(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime;
  } catch (error) {
    return null;
  }
}

// Helper function to download and save a JSON file
async function downloadJson(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    const fileName = url.replace("https://api.va.gov/internal/docs/","").replace("/openapi","").replace("/","-");
    const filePath = path.join(outputDir, fileName);

    const currentFileDate = await getFileModificationDate(filePath);
    const tempFilePath = path.join(outputDir, `temp_${fileName}`);

    // Save the downloaded JSON to a temporary file
    await fs.writeFile(tempFilePath, JSON.stringify(data, null, 2));

    const newFileDate = await getFileModificationDate(tempFilePath);

    if (currentFileDate && newFileDate > currentFileDate) {
      const backupFilePath = path.join(outputDir, `backup_${fileName}`);
      await fs.rename(filePath, backupFilePath);
    }

    await fs.rename(tempFilePath, filePath);

    console.log(`Downloaded and saved: ${filePath}`);
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
  }
}

// Gulp task to download all JSON files
gulp.task('download-json', async function () {
  await fs.ensureDir(outputDir);

  for (const url of urls) {
    await downloadJson(url);
  }
});
