const membersCount = 433;
const perPage = 7;
const totalContentPages = Math.ceil(membersCount / perPage);
console.log("Total Content Pages:", totalContentPages);

// Sheets:
// Sheet 0: Front Cover / Inside Front Cover
// Sheet 1: Content Page 1 / Content Page 2
// ...
// Sheet k: Content Page (2k-1) / Content Page 2k
const totalContentSheets = Math.ceil(totalContentPages / 2);
console.log("Content Sheets needed:", totalContentSheets);

// Final sheet:
// If totalContentPages is 55 (odd):
// Sheet 28: Content Page 55 / Inside Back Cover
// Sheet 29: End of Directory / Back Cover
console.log("Total Sheets:", totalContentSheets + 2);
