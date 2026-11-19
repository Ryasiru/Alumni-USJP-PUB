#!/usr/bin/env node
/**
 * USJ Alumni Directory - Standalone Direct Member Adder
 * 
 * Directly updates:
 * 1. `members` array in validate_members.js
 * 2. `baseMembers` array in index.html
 * 
 * ZERO server. ZERO API calling. Zero external dependencies.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DIR = __dirname;
const VAL_PATH = path.join(DIR, 'validate_members.js');
const INDEX_PATH = path.join(DIR, 'index.html');

function getNextMembershipNo() {
  if (!fs.existsSync(VAL_PATH)) return 459;
  const content = fs.readFileSync(VAL_PATH, 'utf8');
  const matches = content.match(/membershipNo:\s*["'](\d+)["']/g) || [];
  let maxNo = 458;
  matches.forEach(m => {
    const num = parseInt(m.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > maxNo) maxNo = num;
  });
  return maxNo + 1;
}

function formatMemberJsLine(m, no) {
  return '  {' +
    'name:' + JSON.stringify(String(m.name || '').trim()) + ', ' +
    'address:' + JSON.stringify(String(m.address || '').trim()) + ', ' +
    'office:' + JSON.stringify(String(m.office || '').trim()) + ', ' +
    'tel:' + JSON.stringify(String(m.tel || '').trim()) + ', ' +
    'residenceNo:' + JSON.stringify(String(m.residenceNo || '').trim()) + ', ' +
    'email:' + JSON.stringify(String(m.email || '').trim()) + ', ' +
    'designation:' + JSON.stringify(String(m.designation || '').trim()) + ', ' +
    'graduation:' + JSON.stringify(String(m.graduation || '').trim()) + ', ' +
    'amLm:' + JSON.stringify(String(m.amLm || 'LM').trim()) + ', ' +
    'membershipNo:' + JSON.stringify(String(no).trim()) +
    '},\n';
}

function updateValidateMembers(memberLine, membershipNo) {
  if (!fs.existsSync(VAL_PATH)) {
    console.error('Error: validate_members.js not found at ' + VAL_PATH);
    return false;
  }
  let content = fs.readFileSync(VAL_PATH, 'utf8');

  // Check if membership number already exists
  if (content.includes('membershipNo:"' + membershipNo + '"') || content.includes('membershipNo: "' + membershipNo + '"')) {
    console.warn(`[WARN] Membership #${membershipNo} already exists in validate_members.js`);
    return false;
  }

  const closeIdx = content.lastIndexOf('];');
  if (closeIdx === -1) {
    console.error('Error: Could not find closing "];" in validate_members.js');
    return false;
  }

  const before = content.slice(0, closeIdx).trimEnd();
  if (!before.endsWith(',') && !before.endsWith('[')) {
    content = before + ',\n' + memberLine + content.slice(closeIdx);
  } else {
    content = content.slice(0, closeIdx) + memberLine + content.slice(closeIdx);
  }
  fs.writeFileSync(VAL_PATH, content, 'utf8');
  console.log('✓ Successfully appended to members array in validate_members.js');
  return true;
}

function updateIndexHtml(memberLine, membershipNo) {
  if (!fs.existsSync(INDEX_PATH)) {
    console.error('Error: index.html not found at ' + INDEX_PATH);
    return false;
  }
  let content = fs.readFileSync(INDEX_PATH, 'utf8');

  // Check if membership number already exists in baseMembers
  if (content.includes('membershipNo:"' + membershipNo + '"') || content.includes('membershipNo: "' + membershipNo + '"')) {
    console.warn(`[WARN] Membership #${membershipNo} already exists in index.html`);
    return false;
  }

  // Target the end of baseMembers array
  const marker = '];\n    let members = baseMembers.slice();';
  const markerIdx = content.indexOf(marker);

  if (markerIdx !== -1) {
    const before = content.slice(0, markerIdx).trimEnd();
    if (!before.endsWith(',') && !before.endsWith('[')) {
      content = before + ',\n' + memberLine + content.slice(markerIdx);
    } else {
      content = content.slice(0, markerIdx) + memberLine + content.slice(markerIdx);
    }
  } else {
    // Fallback: search for closing of baseMembers
    const match = content.match(/(\n\s*const baseMembers = \[[\s\S]*?)(\n\s*\];[\s\S]*?let members = baseMembers\.slice)/);
    if (!match) {
      console.error('Error: Could not find baseMembers array in index.html');
      return false;
    }
    const insertPos = match.index + match[1].length;
    const before = content.slice(0, insertPos).trimEnd();
    if (!before.endsWith(',') && !before.endsWith('[')) {
      content = before + ',\n' + memberLine + content.slice(insertPos);
    } else {
      content = content.slice(0, insertPos) + '\n' + memberLine.trimEnd() + content.slice(insertPos);
    }
  }

  fs.writeFileSync(INDEX_PATH, content, 'utf8');
  console.log('✓ Successfully appended to baseMembers array in index.html');
  return true;
}

function addMember(memberData) {
  const name = String(memberData.name || '').trim();
  if (!name) {
    console.error('Error: Member name is required.');
    return null;
  }

  let no = String(memberData.membershipNo || '').trim();
  if (!no) {
    no = String(getNextMembershipNo());
  }

  const memberLine = formatMemberJsLine(memberData, no);

  const okVal = updateValidateMembers(memberLine, no);
  const okIdx = updateIndexHtml(memberLine, no);

  if (okVal || okIdx) {
    console.log(`\n🎉 Member #${no} (${name}) has been permanently added to both files!`);
    return { name, membershipNo: no, success: true };
  }
  return null;
}

function replaceMemberInValidateMembers(originalNo, newMemberLine) {
  if (!fs.existsSync(VAL_PATH)) return false;
  let content = fs.readFileSync(VAL_PATH, 'utf8');

  const regex = new RegExp(`^[ \\t]*\\{[^\\n]*?membershipNo:\\s*["']${originalNo}["'][^\\n]*?\\},?\\r?\\n`, 'm');
  if (!regex.test(content)) {
    console.error(`Member #${originalNo} not found in validate_members.js`);
    return false;
  }

  content = content.replace(regex, newMemberLine);
  fs.writeFileSync(VAL_PATH, content, 'utf8');
  console.log(`✓ Successfully updated Member #${originalNo} in validate_members.js`);
  return true;
}

function replaceMemberInIndexHtml(originalNo, newMemberLine) {
  if (!fs.existsSync(INDEX_PATH)) return false;
  let content = fs.readFileSync(INDEX_PATH, 'utf8');

  const regex = new RegExp(`^[ \\t]*\\{[^\\n]*?membershipNo:\\s*["']${originalNo}["'][^\\n]*?\\},?\\r?\\n`, 'm');
  if (!regex.test(content)) {
    console.error(`Member #${originalNo} not found in index.html`);
    return false;
  }

  content = content.replace(regex, newMemberLine);
  fs.writeFileSync(INDEX_PATH, content, 'utf8');
  console.log(`✓ Successfully updated Member #${originalNo} in index.html`);
  return true;
}

function updateMember(memberData) {
  const origNo = String(memberData.originalMembershipNo || memberData.membershipNo || '').trim();
  if (!origNo) {
    console.error('Error: Original membership number is required.');
    return null;
  }

  const newNo = String(memberData.membershipNo || origNo).trim();
  const name = String(memberData.name || '').trim();
  if (!name) {
    console.error('Error: Member name is required.');
    return null;
  }

  const memberLine = formatMemberJsLine(memberData, newNo);

  const okVal = replaceMemberInValidateMembers(origNo, memberLine);
  const okIdx = replaceMemberInIndexHtml(origNo, memberLine);

  if (okVal || okIdx) {
    console.log(`\n🎉 Member #${origNo} -> #${newNo} (${name}) has been permanently updated in both files!`);
    return { name, membershipNo: newNo, originalMembershipNo: origNo, success: true };
  }
  return null;
}

function getBaseMembersFromIndexHtml() {
  if (!fs.existsSync(INDEX_PATH)) return [];
  const content = fs.readFileSync(INDEX_PATH, 'utf8');
  const match = content.match(/const\s+baseMembers\s*=\s*(\[[\s\S]*?\]);\s*let\s+members/);
  if (match) {
    try {
      return (new Function('return ' + match[1]))();
    } catch (e) {
      console.error('Failed to parse baseMembers from index.html:', e);
    }
  }
  return [];
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        result[key] = next;
        i++;
      } else {
        result[key] = true;
      }
    }
  }
  return result;
}

// Interactive prompt
function runInteractive() {
  const nextNo = getNextMembershipNo();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('========================================================');
  console.log('  USJ Alumni Directory - Add New Member');
  console.log('========================================================');
  console.log(`Next available membership number: #${nextNo}\n`);

  rl.question('Full Name *: ', (name) => {
    if (!name.trim()) {
      console.log('Name is required. Aborted.');
      rl.close();
      return;
    }

    rl.question(`Membership No [${nextNo}]: `, (num) => {
      const finalNum = num.trim() || String(nextNo);

      rl.question('Membership Type (LM/AM) [LM]: ', (amLm) => {
        const finalAmLm = (amLm.trim().toUpperCase() === 'AM') ? 'AM' : 'LM';

        rl.question('Year of Graduation: ', (grad) => {
          rl.question('Designation: ', (desig) => {
            rl.question('Office / Organization: ', (office) => {
              rl.question('Telephone: ', (tel) => {
                rl.question('Email: ', (email) => {
                  rl.question('Address: ', (address) => {
                    addMember({
                      name: name.trim(),
                      membershipNo: finalNum,
                      amLm: finalAmLm,
                      graduation: grad.trim(),
                      designation: desig.trim(),
                      office: office.trim(),
                      tel: tel.trim(),
                      residenceNo: '',
                      email: email.trim(),
                      address: address.trim()
                    });
                    rl.close();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function startDaemon(port = 4567) {
  const http = require('http');
  const server = http.createServer((req, res) => {
    // Enable CORS for file:/// and localhost
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const reqPath = (req.url || '').split('?')[0];

    if (req.method === 'POST' && (reqPath === '/add' || reqPath === '/api/add')) {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          const result = addMember(data);
          if (result && result.success) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, result }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Could not add member.' }));
          }
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }

    if (req.method === 'POST' && (reqPath === '/update' || reqPath === '/api/update')) {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          const result = updateMember(data);
          if (result && result.success) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, result }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Could not update member.' }));
          }
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && (reqPath === '/next' || reqPath === '/api/next')) {
      const nextNo = getNextMembershipNo();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ nextNo }));
      return;
    }

    if (req.method === 'GET' && (reqPath === '/baseMembers' || reqPath === '/api/baseMembers' || reqPath === '/members' || reqPath === '/api/members')) {
      const list = getBaseMembersFromIndexHtml();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, baseMembers: list, total: list.length }));
      return;
    }

    if (req.method === 'GET' && (reqPath === '/status' || reqPath === '/api/status')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'running', service: 'USJ Alumni Directory Auto-Updater' }));
      return;
    }

    if (reqPath === '/run-start-command' || reqPath === '/api/run-start-command' || reqPath === '/start' || reqPath === '/api/start') {
      const { exec } = require('child_process');
      const isWin = process.platform === 'win32';
      const scriptName = isWin ? 'start.bat' : 'start.command';
      const scriptPath = path.join(DIR, scriptName);

      const cmd = isWin ? `"${scriptPath}" --no-open` : `bash "${scriptPath}" --no-open`;
      exec(cmd, { cwd: DIR }, (err, stdout, stderr) => {
        if (err) {
          console.error(`[Auto-Updater] Error executing ${scriptName}:`, err.message);
        } else {
          console.log(`✓ [Auto-Updater] ${scriptName} triggered and executed successfully`);
        }
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `${scriptName} executed successfully` }));
      return;
    }

    res.writeHead(404);
    res.end();
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`✓ USJ Alumni Directory auto-updater running on http://127.0.0.1:${port}`);
  });

  process.on('SIGTERM', () => { server.close(); process.exit(0); });
  process.on('SIGINT', () => { server.close(); process.exit(0); });
}

if (require.main === module) {
  const parsed = parseArgs();
  if (parsed.daemon || process.argv.includes('--daemon') || parsed.listen) {
    startDaemon();
  } else if (parsed.help || parsed.h) {
    console.log(`USJ Alumni Directory - Add Member (Node.js)

Usage:
  node add_member.js --daemon                  (Start background updater for web UI)
  node add_member.js                           (Interactive terminal prompt)
  node add_member.js --name "Name" [options]   (Single command addition)

Options:
  --name         Full name (required)
  --membershipNo Membership number (defaults to next available)
  --amLm         LM or AM (default: LM)
  --graduation   Graduation year (e.g. 1995)
  --designation  Designation / Title
  --office       Office / Organization
  --tel          Telephone / Mobile
  --email        Email address
  --address      Postal / Residential address
`);
    process.exit(0);
  } else if (parsed.name) {
    addMember(parsed);
  } else {
    runInteractive();
  }
}

module.exports = { addMember, updateMember, getBaseMembersFromIndexHtml, getNextMembershipNo, formatMemberJsLine, startDaemon };
