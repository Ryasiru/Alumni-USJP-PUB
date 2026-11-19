const fs = require('fs');

// We will read the members data from validate_members.js
const content = fs.readFileSync('/Users/yasiru/Desktop/Alumni/validate_members.js', 'utf8');
// Extract the members array string
const match = content.match(/const members = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not extract members array!");
  process.exit(1);
}
const membersCode = match[1];
eval("var members = " + membersCode);
console.log("Successfully loaded members:", members.length);
