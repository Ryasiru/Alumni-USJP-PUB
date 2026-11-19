const fs = require('fs');

// Read the existing generated index.html
let html = fs.readFileSync('/Users/yasiru/Desktop/Alumni/index.html', 'utf8');

// Replace or ensure branding mentions:
// "University of Sri Jayewardenepura"
// "Faculty of Management Studies & Commerce"
// "Department of Public Administration"
// "Alumni Directory" / "Membership Directory"

console.log("Checking current branding...");
console.log("Includes USJP:", html.includes("University of Sri Jayewardenepura"));
console.log("Includes Dept Public Admn:", html.includes("Department of Public Administration"));
