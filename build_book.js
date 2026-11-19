const fs = require('fs');

// Read validate_members.js
const src = fs.readFileSync('/Users/yasiru/Desktop/Alumni/validate_members.js', 'utf8');
const match = src.match(/const members = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Failed to read members array");
  process.exit(1);
}
const membersDataRaw = match[1];

console.log("Read members array, length in chars:", membersDataRaw.length);
