
import gulp from 'gulp';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

// List of URLs to download JSON files from
const urls = [
"address-validation",
"appeals-status",
"benefits-claims",
"benefits-documents",
"benefits-intake",
"benefits-education",
"benefits-reference-data",
"fhir-clinical-health",
"community-care-eligibility",
"appeals-decision-reviews",
"direct-deposit-management",
"lgy-remittance",
"loan_guaranty_property",
"loan-review",
// "fhir-patient-health",
"provider-directory-r4",
"facilities",
"forms",
"va-letter-generator",
"veteran-confirmation",
"veteran-verification",
];

// Directory to save JSON files
const outputDir = 'src/assets/JSON';

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
  let link ="";

  for(let counter=4; counter>=0; counter--)
  try
  {
    link = "https://api.va.gov/internal/docs/"+ url + "/v" + counter + "/openapi.json";
    const response = await axios.get(link);
    const data = response.data;
    const fileName =  url + "-" + counter + ".json";
    const filePath = path.join(outputDir, fileName);

    const currentFileDate = await getFileModificationDate(filePath);
    const tempFilePath = path.join(outputDir, `temp_${fileName}`);

    // Save the downloaded JSON to a temporary file
    await fs.writeFile(tempFilePath, JSON.stringify(data, null, 2));

    const newFileDate = await getFileModificationDate(tempFilePath);

    if (currentFileDate && newFileDate > currentFileDate) {
      const backupFilePath = path.join(outputDir, `/backup/${fileName}`);
      await fs.rename(filePath, backupFilePath);
    }
    await fs.rename(tempFilePath, filePath);
    console.log(`Downloaded and saved: ${filePath}`);
    counter=0;
  }
  catch (error) {
    console.error(`Failed to download ${link}:`, error.message);
  }
}

// Gulp task to download all JSON files
gulp.task('download-json', async function () {
  await fs.ensureDir(outputDir);

  for (const url of urls) {
    await downloadJson(url);
  }
});
