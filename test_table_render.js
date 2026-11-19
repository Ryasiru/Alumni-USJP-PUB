const member = {
  name:"Prof. M.D. Pushpakumari", 
  address:"161 E Walaw watte, Ihalagama, Gampaha", 
  office:"Dept. of Business Admn. USJP", 
  tel:"077 3465280", 
  residenceNo:"", 
  email:"pushpakumarimd@sjp.ac.lk", 
  designation:"Sen. Lecturer", 
  graduation:"1990", 
  amLm:"LM", 
  membershipNo:"18"
};

function renderMemberRow(m) {
  const safe = (val) => (val && val.trim() !== "" ? val.trim() : "—");
  const badge = m.amLm && m.amLm.trim() !== "" 
    ? `<span class="pill-badge">${m.amLm.trim()}</span>` 
    : "—";

  return `
    <tr class="member-row">
      <td class="col-num">${safe(m.membershipNo)}</td>
      <td class="col-info">
        <div class="name-line">
          <strong class="member-name">${safe(m.name)}</strong>
          ${badge}
        </div>
        <div class="sub-line"><span class="meta-label">Desig:</span> ${safe(m.designation)}</div>
        <div class="sub-line"><span class="meta-label">Office:</span> ${safe(m.office)}</div>
      </td>
      <td class="col-contact">
        <div class="sub-line"><span class="meta-label">Tel:</span> ${safe(m.tel)}</div>
        <div class="sub-line"><span class="meta-label">Email:</span> ${safe(m.email)}</div>
        <div class="sub-line addr-text"><span class="meta-label">Addr:</span> ${safe(m.address)}</div>
      </td>
      <td class="col-meta">
        <div class="grad-tag">${safe(m.graduation)}</div>
      </td>
    </tr>
  `;
}

console.log(renderMemberRow(member));
