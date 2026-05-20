// src/utils/resumeTemplates.js

// Shared helper to safely format lists and check array presence
const renderList = (arr, mapper) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "";
  return arr.map(mapper).join("");
};

export const TEMPLATES = {
  // 1. Classic Professional
  1: (data) => `
    <div style="font-family: 'Georgia', serif; padding: 40px; color: #111; line-height: 1.5; font-size: 14px; background: #fff; box-sizing: border-box; min-height: 1123px; width: 794px; margin: 0 auto; border: 1px solid #ddd;">
      <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0 0 5px 0; font-size: 28px; text-transform: uppercase; font-weight: normal; letter-spacing: 1px;">${data.name || "John Doe"}</h1>
        <p style="margin: 5px 0; color: #555;">
          ${data.email ? `${data.email} | ` : ""}${data.phone ? `${data.phone} | ` : ""}${data.location || ""}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #777;">
          ${data.linkedin ? `<a href="${data.linkedin}" style="color: #444; text-decoration: none;">LinkedIn</a> | ` : ""}
          ${data.github ? `<a href="${data.github}" style="color: #444; text-decoration: none;">GitHub</a>` : ""}
        </p>
      </div>
      
      ${data.summary ? `
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 5px 0; font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #bbb; padding-bottom: 3px; color: #222;">Professional Summary</h3>
        <p style="margin: 5px 0; text-align: justify; font-size: 13px;">${data.summary}</p>
      </div>` : ""}

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 5px 0; font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #bbb; padding-bottom: 3px; color: #222;">Education</h3>
        ${renderList(data.education, edu => `
          <div style="margin-bottom: 8px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>${edu.degree || ""} - ${edu.institution || ""}</span>
              <span>${edu.year || ""}</span>
            </div>
            <div style="color: #555;">Score/CGPA: ${edu.score || edu.cgpa || "N/A"}</div>
          </div>
        `)}
      </div>

      ${data.experience && data.experience.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 5px 0; font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #bbb; padding-bottom: 3px; color: #222;">Experience</h3>
        ${renderList(data.experience, exp => `
          <div style="margin-bottom: 12px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>${exp.title || ""} | ${exp.company || ""}</span>
              <span>${exp.duration || ""}</span>
            </div>
            <ul style="margin: 5px 0 0 20px; padding: 0; list-style-type: square;">
              ${renderList(exp.bullets || [], b => `<li style="margin-bottom: 3px;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>` : ""}

      ${data.projects && data.projects.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 5px 0; font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #bbb; padding-bottom: 3px; color: #222;">Projects</h3>
        ${renderList(data.projects, proj => `
          <div style="margin-bottom: 10px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>${proj.name || ""} <span style="font-weight: normal; font-size: 12px; color: #666;">(${proj.tech || ""})</span></span>
            </div>
            <ul style="margin: 5px 0 0 20px; padding: 0; list-style-type: disc;">
              ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 3px;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>` : ""}

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 5px 0; font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #bbb; padding-bottom: 3px; color: #222;">Skills</h3>
        <p style="margin: 5px 0; font-size: 13px;">
          <strong>Technical Skills:</strong> ${Array.isArray(data.skills?.technical) ? data.skills.technical.join(", ") : (data.skills?.technical || data.skills || "")}
        </p>
        ${data.skills?.soft && data.skills.soft.length > 0 ? `
        <p style="margin: 5px 0; font-size: 13px;">
          <strong>Soft Skills:</strong> ${Array.isArray(data.skills.soft) ? data.skills.soft.join(", ") : data.skills.soft}
        </p>` : ""}
      </div>

      ${data.certifications && data.certifications.length > 0 ? `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 5px 0; font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #bbb; padding-bottom: 3px; color: #222;">Certifications</h3>
        <ul style="margin: 5px 0 0 20px; padding: 0; font-size: 13px;">
          ${renderList(data.certifications, cert => `<li style="margin-bottom: 3px;"><strong>${cert.name || ""}</strong> - ${cert.issuer || ""} (${cert.year || ""})</li>`)}
        </ul>
      </div>` : ""}
    </div>
  `,

  // 2. Modern Minimal
  2: (data) => `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; display: flex; color: #2c3e50; background: #fff; min-height: 1123px; width: 794px; margin: 0 auto; border: 1px solid #ddd; box-sizing: border-box;">
      <!-- Left Column (Sidebar) -->
      <div style="width: 240px; background: #f8f9fa; border-right: 1px solid #e9ecef; padding: 30px 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px;">
        <div>
          <h2 style="margin: 0 0 5px 0; font-size: 20px; font-weight: 700; color: #1a252f;">${data.name || "John Doe"}</h2>
          <p style="margin: 0; font-size: 12px; color: #7f8c8d;">${data.location || ""}</p>
        </div>
        
        <div style="font-size: 12px; display: flex; flex-direction: column; gap: 8px; word-break: break-all;">
          <h4 style="margin: 0; text-transform: uppercase; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 3px;">Contact</h4>
          <span>📧 ${data.email || ""}</span>
          <span>📞 ${data.phone || ""}</span>
          ${data.linkedin ? `<span>🔗 <a href="${data.linkedin}" style="color: #2980b9; text-decoration: none;">LinkedIn</a></span>` : ""}
          ${data.github ? `<span>💻 <a href="${data.github}" style="color: #2980b9; text-decoration: none;">GitHub</a></span>` : ""}
        </div>

        <div style="font-size: 12px;">
          <h4 style="margin: 0 0 8px 0; text-transform: uppercase; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 3px;">Skills</h4>
          <p style="margin: 0 0 5px 0;"><strong>Technical:</strong></p>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${(Array.isArray(data.skills?.technical) ? data.skills.technical : (data.skills?.technical || data.skills || "").split(",")).map(s => `
              <span style="background: #eaf2f8; color: #2980b9; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${s.trim()}</span>
            `).join("")}
          </div>
          ${data.skills?.soft && data.skills.soft.length > 0 ? `
          <p style="margin: 10px 0 5px 0;"><strong>Soft Skills:</strong></p>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${(Array.isArray(data.skills.soft) ? data.skills.soft : data.skills.soft.split(",")).map(s => `
              <span style="background: #f2f4f4; color: #7f8c8d; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${s.trim()}</span>
            `).join("")}
          </div>` : ""}
        </div>

        ${data.certifications && data.certifications.length > 0 ? `
        <div style="font-size: 12px;">
          <h4 style="margin: 0 0 8px 0; text-transform: uppercase; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 3px;">Certifications</h4>
          ${renderList(data.certifications, cert => `
            <div style="margin-bottom: 6px;">
              <div style="font-weight: bold;">${cert.name || ""}</div>
              <div style="color: #7f8c8d; font-size: 11px;">${cert.issuer || ""} (${cert.year || ""})</div>
            </div>
          `)}
        </div>` : ""}
      </div>

      <!-- Right Column (Main Content) -->
      <div style="flex: 1; padding: 30px; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px;">
        ${data.summary ? `
        <div>
          <h3 style="margin: 0 0 8px 0; font-size: 15px; text-transform: uppercase; color: #2980b9; border-bottom: 2px solid #eaf2f8; padding-bottom: 5px;">Profile Summary</h3>
          <p style="margin: 0; font-size: 13px; text-align: justify; line-height: 1.4;">${data.summary}</p>
        </div>` : ""}

        <div>
          <h3 style="margin: 0 0 8px 0; font-size: 15px; text-transform: uppercase; color: #2980b9; border-bottom: 2px solid #eaf2f8; padding-bottom: 5px;">Education</h3>
          ${renderList(data.education, edu => `
            <div style="margin-bottom: 10px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; font-weight: bold; color: #34495e;">
                <span>${edu.degree || ""}</span>
                <span>${edu.year || ""}</span>
              </div>
              <div style="color: #7f8c8d;">${edu.institution || ""}</div>
              <div style="font-size: 12px; color: #16a085;">CGPA/Score: ${edu.score || edu.cgpa || ""}</div>
            </div>
          `)}
        </div>

        ${data.experience && data.experience.length > 0 ? `
        <div>
          <h3 style="margin: 0 0 8px 0; font-size: 15px; text-transform: uppercase; color: #2980b9; border-bottom: 2px solid #eaf2f8; padding-bottom: 5px;">Professional Experience</h3>
          ${renderList(data.experience, exp => `
            <div style="margin-bottom: 12px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; font-weight: bold; color: #34495e;">
                <span>${exp.title || ""}</span>
                <span style="font-weight: normal; color: #7f8c8d;">${exp.duration || ""}</span>
              </div>
              <div style="color: #7f8c8d; font-style: italic; margin-bottom: 4px;">${exp.company || ""}</div>
              <ul style="margin: 0; padding-left: 20px; color: #555;">
                ${renderList(exp.bullets || [], b => `<li style="margin-bottom: 3px;">${b}</li>`)}
              </ul>
            </div>
          `)}
        </div>` : ""}

        ${data.projects && data.projects.length > 0 ? `
        <div>
          <h3 style="margin: 0 0 8px 0; font-size: 15px; text-transform: uppercase; color: #2980b9; border-bottom: 2px solid #eaf2f8; padding-bottom: 5px;">Key Projects</h3>
          ${renderList(data.projects, proj => `
            <div style="margin-bottom: 10px; font-size: 13px;">
              <div style="font-weight: bold; color: #34495e;">${proj.name || ""} <span style="font-weight: normal; font-size: 11px; color: #7f8c8d;">[${proj.tech || ""}]</span></div>
              <ul style="margin: 4px 0 0 0; padding-left: 20px; color: #555;">
                ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
              </ul>
            </div>
          `)}
        </div>` : ""}
      </div>
    </div>
  `,

  // 3. Tech-Forward (Monospace styling, dark block header)
  3: (data) => `
    <div style="font-family: 'Courier New', Courier, monospace; padding: 0; color: #333; line-height: 1.4; font-size: 13px; background: #fff; min-height: 1123px; width: 794px; margin: 0 auto; border: 1px solid #ddd; box-sizing: border-box;">
      <div style="background: #111827; color: #10b981; padding: 30px; border-bottom: 4px solid #6366f1;">
        <h1 style="margin: 0; font-size: 26px; font-weight: bold; font-family: 'Sora', sans-serif;">&gt; ${data.name || "DEVELOPER"}</h1>
        <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
          LOC: ${data.location || "N/A"} | EMAIL: ${data.email || ""} | TEL: ${data.phone || ""}
        </p>
        <p style="margin: 5px 0 0 0; font-size: 11px;">
          ${data.github ? `[github]: <a href="${data.github}" style="color: #6366f1; text-decoration: none;">${data.github}</a> ` : ""}
          ${data.linkedin ? `| [linkedin]: <a href="${data.linkedin}" style="color: #6366f1; text-decoration: none;">${data.linkedin}</a>` : ""}
        </p>
      </div>

      <div style="padding: 30px; display: flex; flex-direction: column; gap: 20px;">
        ${data.summary ? `
        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #6366f1; font-weight: bold; border-bottom: 1px dashed #6366f1;"># PROFILE</h3>
          <p style="margin: 5px 0; text-align: justify;">${data.summary}</p>
        </div>` : ""}

        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #6366f1; font-weight: bold; border-bottom: 1px dashed #6366f1;"># TECHNICAL_SKILLS</h3>
          <p style="margin: 5px 0; font-size: 12px;">
            <strong>Skills:</strong> ${Array.isArray(data.skills?.technical) ? data.skills.technical.join(", ") : (data.skills?.technical || data.skills || "")}
          </p>
          ${data.skills?.soft && data.skills.soft.length > 0 ? `
          <p style="margin: 5px 0; font-size: 12px;">
            <strong>Soft Skills:</strong> ${Array.isArray(data.skills.soft) ? data.skills.soft.join(", ") : data.skills.soft}
          </p>` : ""}
        </div>

        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #6366f1; font-weight: bold; border-bottom: 1px dashed #6366f1;"># EDUCATION</h3>
          ${renderList(data.education, edu => `
            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; font-weight: bold;">
                <span>* ${edu.degree || ""} @ ${edu.institution || ""}</span>
                <span>[${edu.year || ""}]</span>
              </div>
              <div style="color: #666; font-size: 12px; margin-left: 12px;">GPA: ${edu.score || edu.cgpa || ""}</div>
            </div>
          `)}
        </div>

        ${data.experience && data.experience.length > 0 ? `
        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #6366f1; font-weight: bold; border-bottom: 1px dashed #6366f1;"># EXPERIENCE</h3>
          ${renderList(data.experience, exp => `
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; font-weight: bold;">
                <span>* ${exp.title || ""} - ${exp.company || ""}</span>
                <span>[${exp.duration || ""}]</span>
              </div>
              <ul style="margin: 4px 0 0 20px; padding: 0; list-style-type: '- ';">
                ${renderList(exp.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
              </ul>
            </div>
          `)}
        </div>` : ""}

        ${data.projects && data.projects.length > 0 ? `
        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #6366f1; font-weight: bold; border-bottom: 1px dashed #6366f1;"># PROJECTS</h3>
          ${renderList(data.projects, proj => `
            <div style="margin-bottom: 10px;">
              <div style="font-weight: bold;">* ${proj.name || ""} [Tech: ${proj.tech || ""}]</div>
              <ul style="margin: 4px 0 0 20px; padding: 0; list-style-type: '&gt; ';">
                ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
              </ul>
            </div>
          `)}
        </div>` : ""}
      </div>
    </div>
  `,

  // 4. Creative Edge (Sidebar with timeline accent color)
  4: (data) => `
    <div style="font-family: 'DM Sans', sans-serif; display: flex; color: #1e293b; background: #fff; min-height: 1123px; width: 794px; margin: 0 auto; border: 1px solid #ddd; box-sizing: border-box; overflow: hidden; position: relative;">
      <div style="position: absolute; top: 0; left: 0; width: 8px; height: 100%; background: linear-gradient(180deg, #6366f1, #8b5cf6);"></div>
      
      <div style="flex: 1; padding: 40px 30px 40px 45px; box-sizing: border-box; display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
          <div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #1e1b4b; font-family: 'Sora', sans-serif;">${data.name || "Alex Doe"}</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #6366f1; font-weight: bold;">Candidate for Placement</p>
          </div>
          <div style="font-size: 12px; color: #64748b; text-align: right;">
            <p style="margin: 2px 0;">📧 ${data.email || ""}</p>
            <p style="margin: 2px 0;">📞 ${data.phone || ""}</p>
            <p style="margin: 2px 0;">📍 ${data.location || ""}</p>
          </div>
        </div>

        ${data.summary ? `
        <div>
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #4338ca; text-transform: uppercase; font-family: 'Sora', sans-serif;">About Me</h3>
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #475569;">${data.summary}</p>
        </div>` : ""}

        <div>
          <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #4338ca; text-transform: uppercase; font-family: 'Sora', sans-serif;">Education</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${renderList(data.education, edu => `
              <div style="background: #f8fafc; border-left: 3px solid #8b5cf6; padding: 10px 15px; border-radius: 0 4px 4px 0;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; color: #0f172a;">
                  <span>${edu.degree} - ${edu.institution}</span>
                  <span style="color: #6366f1;">${edu.year}</span>
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Score/CGPA: ${edu.score || edu.cgpa || "N/A"}</div>
              </div>
            `)}
          </div>
        </div>

        ${data.experience && data.experience.length > 0 ? `
        <div>
          <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #4338ca; text-transform: uppercase; font-family: 'Sora', sans-serif;">Experience</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${renderList(data.experience, exp => `
              <div>
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 13px;">
                  <span style="color: #0f172a;">${exp.title}</span>
                  <span style="color: #64748b; font-weight: normal;">${exp.duration}</span>
                </div>
                <div style="font-size: 12px; color: #6366f1; margin-bottom: 4px;">${exp.company}</div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #475569;">
                  ${renderList(exp.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
                </ul>
              </div>
            `)}
          </div>
        </div>` : ""}

        ${data.projects && data.projects.length > 0 ? `
        <div>
          <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #4338ca; text-transform: uppercase; font-family: 'Sora', sans-serif;">Projects</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${renderList(data.projects, proj => `
              <div>
                <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${proj.name} <span style="font-weight: normal; color: #8b5cf6; font-size: 11px;">(${proj.tech})</span></div>
                <ul style="margin: 4px 0 0 0; padding-left: 20px; font-size: 12px; color: #475569;">
                  ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
                </ul>
              </div>
            `)}
          </div>
        </div>` : ""}
      </div>

      <div style="width: 210px; background: #faf5ff; padding: 40px 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px; border-left: 1px solid #f3e8ff;">
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #6b21a8; font-weight: bold; border-bottom: 1px solid #e9d5ff; padding-bottom: 3px;">Links</h4>
          <div style="font-size: 12px; display: flex; flex-direction: column; gap: 6px;">
            ${data.linkedin ? `<a href="${data.linkedin}" style="color: #6b21a8; text-decoration: none; word-break: break-all;">🔗 LinkedIn</a>` : ""}
            ${data.github ? `<a href="${data.github}" style="color: #6b21a8; text-decoration: none; word-break: break-all;">💻 GitHub</a>` : ""}
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #6b21a8; font-weight: bold; border-bottom: 1px solid #e9d5ff; padding-bottom: 3px;">Technical Skills</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${(Array.isArray(data.skills?.technical) ? data.skills.technical : (data.skills?.technical || data.skills || "").split(",")).map(s => `
              <span style="background: #f3e8ff; color: #6b21a8; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${s.trim()}</span>
            `).join("")}
          </div>
        </div>

        ${data.skills?.soft ? `
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #6b21a8; font-weight: bold; border-bottom: 1px solid #e9d5ff; padding-bottom: 3px;">Soft Skills</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${(Array.isArray(data.skills.soft) ? data.skills.soft : data.skills.soft.split(",")).map(s => `
              <span style="background: #f3f4f6; color: #4b5563; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${s.trim()}</span>
            `).join("")}
          </div>
        </div>` : ""}

        ${data.certifications && data.certifications.length > 0 ? `
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #6b21a8; font-weight: bold; border-bottom: 1px solid #e9d5ff; padding-bottom: 3px;">Certifications</h4>
          ${renderList(data.certifications, cert => `
            <div style="margin-bottom: 8px; font-size: 11px; color: #4b5563;">
              <div style="font-weight: bold; color: #6b21a8;">${cert.name}</div>
              <div>${cert.issuer} (${cert.year})</div>
            </div>
          `)}
        </div>` : ""}
      </div>
    </div>
  `,

  // 5. Executive (Clean, spacious, horizontal rule separator lines)
  5: (data) => `
    <div style="font-family: 'Times New Roman', Times, serif; padding: 45px; color: #111; line-height: 1.6; font-size: 14px; background: #fff; min-height: 1123px; width: 794px; margin: 0 auto; border: 1px solid #ddd; box-sizing: border-box;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="margin: 0 0 5px 0; font-size: 30px; font-weight: normal; letter-spacing: 1px; color: #111;">${data.name || "Jane Doe"}</h1>
        <p style="margin: 2px 0; font-size: 13px; color: #444; font-style: italic;">
          ${data.location || ""} &bull; ${data.email || ""} &bull; ${data.phone || ""}
        </p>
        <p style="margin: 2px 0; font-size: 12px; color: #555;">
          ${data.linkedin ? `<a href="${data.linkedin}" style="color: #0077b5; text-decoration: none;">LinkedIn</a>` : ""}
          ${data.github ? ` &bull; <a href="${data.github}" style="color: #333; text-decoration: none;">GitHub</a>` : ""}
        </p>
      </div>

      ${data.summary ? `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1.5px solid #222; padding-bottom: 2px; color: #111; letter-spacing: 0.5px;">Summary</h4>
        <p style="margin: 6px 0 0 0; text-align: justify; font-size: 13px;">${data.summary}</p>
      </div>` : ""}

      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1.5px solid #222; padding-bottom: 2px; color: #111; letter-spacing: 0.5px;">Education</h4>
        ${renderList(data.education, edu => `
          <div style="margin-top: 8px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>${edu.institution || ""}</span>
              <span>${edu.year || ""}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-style: italic; color: #333;">
              <span>${edu.degree || ""}</span>
              <span>Score/CGPA: ${edu.score || edu.cgpa || ""}</span>
            </div>
          </div>
        `)}
      </div>

      ${data.experience && data.experience.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1.5px solid #222; padding-bottom: 2px; color: #111; letter-spacing: 0.5px;">Professional Experience</h4>
        ${renderList(data.experience, exp => `
          <div style="margin-top: 10px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>${exp.company || ""}</span>
              <span>${exp.duration || ""}</span>
            </div>
            <div style="font-style: italic; color: #333; margin-bottom: 4px;">${exp.title || ""}</div>
            <ul style="margin: 0; padding-left: 20px; list-style-type: circle;">
              ${renderList(exp.bullets || [], b => `<li style="margin-bottom: 2px; text-align: justify;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>` : ""}

      ${data.projects && data.projects.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1.5px solid #222; padding-bottom: 2px; color: #111; letter-spacing: 0.5px;">Key Projects</h4>
        ${renderList(data.projects, proj => `
          <div style="margin-top: 8px; font-size: 13px;">
            <div style="font-weight: bold;">${proj.name || ""} &mdash; <span style="font-weight: normal; font-style: italic; font-size: 12px; color: #444;">${proj.tech || ""}</span></div>
            <ul style="margin: 2px 0 0 0; padding-left: 20px; list-style-type: disc;">
              ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 2px; text-align: justify;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>` : ""}

      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1.5px solid #222; padding-bottom: 2px; color: #111; letter-spacing: 0.5px;">Skills & Capabilities</h4>
        <div style="margin-top: 6px; font-size: 13px;">
          <p style="margin: 3px 0;"><strong>Technical:</strong> ${Array.isArray(data.skills?.technical) ? data.skills.technical.join(", ") : (data.skills?.technical || data.skills || "")}</p>
          ${data.skills?.soft ? `<p style="margin: 3px 0;"><strong>Professional:</strong> ${Array.isArray(data.skills.soft) ? data.skills.soft.join(", ") : data.skills.soft}</p>` : ""}
        </div>
      </div>
    </div>
  `,

  // 6. Academic (Research and Publications focused)
  6: (data) => `
    <div style="font-family: 'Palatino', 'Book Antiqua', Palatino Linotype, serif; padding: 45px; color: #222; line-height: 1.5; font-size: 13.5px; background: #fff; min-height: 1123px; width: 794px; margin: 0 auto; border: 1px solid #ddd; box-sizing: border-box;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="margin: 0 0 5px 0; font-size: 26px; font-weight: bold; letter-spacing: 0.5px;">${data.name || "Dr. John Doe"}</h1>
        <p style="margin: 2px 0; color: #555;">
          ${data.location || ""} | ${data.email || ""} | ${data.phone || ""}
        </p>
        ${data.linkedin || data.github ? `
        <p style="margin: 2px 0; font-size: 12px; color: #777;">
          ${data.linkedin ? `<a href="${data.linkedin}" style="color: #666; text-decoration: none;">LinkedIn</a>` : ""}
          ${data.github ? ` | <a href="${data.github}" style="color: #666; text-decoration: none;">GitHub</a>` : ""}
        </p>` : ""}
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2px; font-weight: bold;">Educational Qualifications</h3>
        ${renderList(data.education, edu => `
          <div style="margin-top: 6px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between;">
              <strong>${edu.degree}</strong>
              <span>${edu.year}</span>
            </div>
            <div style="color: #555;">${edu.institution}</div>
            <div style="font-size: 12px; color: #555;">Academic Score: ${edu.score || edu.cgpa || "N/A"}</div>
          </div>
        `)}
      </div>

      ${data.research && data.research.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2px; font-weight: bold;">Publications & Research Projects</h3>
        <ol style="margin: 5px 0 0 20px; padding: 0; font-size: 13px;">
          ${renderList(data.research, res => `
            <li style="margin-bottom: 8px;">
              <strong>"${res.title || ""}"</strong>, <em>${res.journal || "Unknown Journal"}</em> (${res.year || ""})
              ${res.link ? `<br/><a href="${res.link}" style="color: #2980b9; font-size: 11px; text-decoration: none;">[View Publication]</a>` : ""}
            </li>
          `)}
        </ol>
      </div>` : ""}

      ${data.projects && data.projects.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2px; font-weight: bold;">Technical Research & Projects</h3>
        ${renderList(data.projects, proj => `
          <div style="margin-top: 6px; font-size: 13px;">
            <div style="font-weight: bold;">${proj.name} <span style="font-weight: normal; font-size: 12px; color: #555;">(${proj.tech})</span></div>
            <ul style="margin: 2px 0 0 20px; padding: 0; list-style-type: square;">
              ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>` : ""}

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 5px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 2px; font-weight: bold;">Areas of Expertise</h3>
        <p style="margin: 5px 0; font-size: 13px;">
          <strong>Technical Competencies:</strong> ${Array.isArray(data.skills?.technical) ? data.skills.technical.join(", ") : (data.skills?.technical || data.skills || "")}
        </p>
        ${data.skills?.soft ? `
        <p style="margin: 5px 0; font-size: 13px;">
          <strong>Professional Competencies:</strong> ${Array.isArray(data.skills.soft) ? data.skills.soft.join(", ") : data.skills.soft}
        </p>` : ""}
      </div>
    </div>
  `,

  // 7. Startup Ready (Card layout, modern structure)
  7: (data) => `
    <div style="font-family: 'DM Sans', sans-serif; padding: 35px; color: #334155; line-height: 1.4; font-size: 13px; background: #f8fafc; min-height: 1123px; width: 794px; margin: 0 auto; border: 1px solid #e2e8f0; box-sizing: border-box;">
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);">
        <div>
          <h1 style="margin: 0; font-size: 26px; font-weight: bold; color: #0f172a; font-family: 'Sora', sans-serif;">🚀 ${data.name || "Innovator"}</h1>
          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">📍 ${data.location || ""} | 📧 ${data.email || ""} | 📞 ${data.phone || ""}</p>
        </div>
        <div style="display: flex; gap: 8px;">
          ${data.linkedin ? `<a href="${data.linkedin}" style="background: #f1f5f9; color: #0f172a; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600;">LinkedIn</a>` : ""}
          ${data.github ? `<a href="${data.github}" style="background: #0f172a; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600;">GitHub</a>` : ""}
        </div>
      </div>

      ${data.summary ? `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4f46e5; letter-spacing: 0.5px;">💡 Profile Overview</h3>
        <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.5;">${data.summary}</p>
      </div>` : ""}

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <!-- Left Subgrid -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05); flex: 1;">
            <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4f46e5;">🎓 Education</h3>
            ${renderList(data.education, edu => `
              <div style="margin-bottom: 8px;">
                <div style="font-weight: bold; color: #0f172a; font-size: 12px;">${edu.degree}</div>
                <div style="color: #64748b; font-size: 11px;">${edu.institution} (${edu.year})</div>
                <div style="color: #10b981; font-weight: bold; font-size: 11px;">Score: ${edu.score || edu.cgpa}</div>
              </div>
            `)}
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);">
            <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4f46e5;">🛠️ Skills Stack</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
              ${(Array.isArray(data.skills?.technical) ? data.skills.technical : (data.skills?.technical || data.skills || "").split(",")).map(s => `
                <span style="background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 500;">${s.trim()}</span>
              `).join("")}
            </div>
            ${data.skills?.soft ? `
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${(Array.isArray(data.skills.soft) ? data.skills.soft : data.skills.soft.split(",")).map(s => `
                <span style="background: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${s.trim()}</span>
              `).join("")}
            </div>` : ""}
          </div>
        </div>

        <!-- Right Subgrid -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4f46e5;">💻 Core Projects</h3>
          ${renderList(data.projects, proj => `
            <div style="margin-bottom: 12px;">
              <div style="font-weight: bold; color: #0f172a; font-size: 12px;">${proj.name}</div>
              <div style="font-size: 11px; color: #4f46e5; margin-bottom: 3px;">Tech: ${proj.tech}</div>
              <ul style="margin: 0; padding-left: 15px; font-size: 11px; color: #475569;">
                ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
              </ul>
            </div>
          `)}
        </div>
      </div>

      ${data.experience && data.experience.length > 0 ? `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.05);">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4f46e5;">💼 Experience</h3>
        ${renderList(data.experience, exp => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: #0f172a;">
              <span>${exp.title} - ${exp.company}</span>
              <span style="font-weight: normal; color: #64748b; font-size: 11px;">${exp.duration}</span>
            </div>
            <ul style="margin: 4px 0 0 0; padding-left: 15px; font-size: 11px; color: #475569;">
              ${renderList(exp.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>` : ""}
    </div>
  `,

  // 8. Google/FAANG (Clean, extremely dense, quantitative metrics)
  8: (data) => `
    <div style="font-family: Arial, sans-serif; padding: 30px; color: #222; line-height: 1.35; font-size: 12px; background: #fff; min-height: 1123px; width: 794px; margin: 0 auto; border: 1px solid #ccc; box-sizing: border-box;">
      <div style="text-align: center; margin-bottom: 12px;">
        <h1 style="margin: 0 0 2px 0; font-size: 24px; font-weight: bold; color: #000;">${data.name || "FAANG Engineer"}</h1>
        <p style="margin: 0; font-size: 11px; color: #333;">
          ${data.location || ""} | ${data.phone || ""} | ${data.email || ""}
        </p>
        <p style="margin: 2px 0 0 0; font-size: 11px; color: #0066cc;">
          ${data.github ? `<a href="${data.github}" style="color: #0066cc; text-decoration: none;">GitHub</a>` : ""}
          ${data.linkedin ? ` | <a href="${data.linkedin}" style="color: #0066cc; text-decoration: none;">LinkedIn</a>` : ""}
        </p>
      </div>

      <div style="margin-bottom: 10px;">
        <h3 style="margin: 0 0 3px 0; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #222; font-weight: bold; color: #000;">Education</h3>
        ${renderList(data.education, edu => `
          <div style="margin-bottom: 4px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>${edu.institution}</span>
              <span>${edu.year}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #444;">
              <span>${edu.degree}</span>
              <span>Cumulative GPA: ${edu.score || edu.cgpa}</span>
            </div>
          </div>
        `)}
      </div>

      ${data.experience && data.experience.length > 0 ? `
      <div style="margin-bottom: 10px;">
        <h3 style="margin: 0 0 3px 0; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #222; font-weight: bold; color: #000;">Experience</h3>
        ${renderList(data.experience, exp => `
          <div style="margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>${exp.company}</span>
              <span>${exp.duration}</span>
            </div>
            <div style="font-style: italic; color: #444; font-size: 11px; margin-bottom: 2px;">${exp.title}</div>
            <ul style="margin: 0; padding-left: 15px; list-style-type: disc;">
              ${renderList(exp.bullets || [], b => `<li style="margin-bottom: 2px; text-align: justify;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>` : ""}

      ${data.projects && data.projects.length > 0 ? `
      <div style="margin-bottom: 10px;">
        <h3 style="margin: 0 0 3px 0; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #222; font-weight: bold; color: #000;">Technical Projects</h3>
        ${renderList(data.projects, proj => `
          <div style="margin-bottom: 6px;">
            <div style="font-weight: bold;">${proj.name} <span style="font-weight: normal; font-size: 11px; color: #555;">— ${proj.tech}</span></div>
            <ul style="margin: 2px 0 0 0; padding-left: 15px; list-style-type: disc;">
              ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 2px; text-align: justify;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>` : ""}

      <div style="margin-bottom: 10px;">
        <h3 style="margin: 0 0 3px 0; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #222; font-weight: bold; color: #000;">Technical Skills</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <tr>
            <td style="width: 15%; font-weight: bold; vertical-align: top;">Languages:</td>
            <td>${Array.isArray(data.skills?.technical) ? data.skills.technical.join(", ") : (data.skills?.technical || data.skills || "")}</td>
          </tr>
          ${data.skills?.soft ? `
          <tr>
            <td style="font-weight: bold; vertical-align: top;">Professional:</td>
            <td>${Array.isArray(data.skills.soft) ? data.skills.soft.join(", ") : data.skills.soft}</td>
          </tr>` : ""}
        </table>
      </div>

      ${data.certifications && data.certifications.length > 0 ? `
      <div>
        <h3 style="margin: 0 0 3px 0; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #222; font-weight: bold; color: #000;">Additional Information</h3>
        <p style="margin: 3px 0; font-size: 11px;">
          <strong>Certifications:</strong> ${data.certifications.map(c => `${c.name} (${c.issuer}, ${c.year})`).join("; ")}
        </p>
      </div>` : ""}
    </div>
  `,

  // 9. Infographic Light (Visual skill indicators)
  9: (data) => `
    <div style="font-family: 'DM Sans', sans-serif; padding: 35px; color: #2c3e50; background: #fff; min-height: 1123px; width: 794px; margin: 0 auto; border: 1px solid #ddd; box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2c3e50; padding-bottom: 15px; margin-bottom: 25px;">
        <div>
          <h1 style="margin: 0 0 5px 0; font-size: 32px; font-weight: 800; color: #2c3e50; font-family: 'Sora', sans-serif;">${data.name || "Visual Resume"}</h1>
          <p style="margin: 0; font-size: 14px; color: #16a085; font-weight: bold;">🧑‍💻 Technology Specialist</p>
        </div>
        <div style="font-size: 12px; color: #7f8c8d; text-align: right;">
          <p style="margin: 2px 0;">📍 ${data.location || ""}</p>
          <p style="margin: 2px 0;">📧 ${data.email || ""}</p>
          <p style="margin: 2px 0;">📞 ${data.phone || ""}</p>
        </div>
      </div>

      ${data.summary ? `
      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 8px 0; font-size: 15px; text-transform: uppercase; font-weight: bold; color: #2c3e50;">🎯 Objective & Summary</h3>
        <p style="margin: 0; font-size: 13px; line-height: 1.5; text-align: justify;">${data.summary}</p>
      </div>` : ""}

      <div style="display: flex; gap: 30px; margin-bottom: 25px;">
        <!-- Left Side -->
        <div style="flex: 1.3; display: flex; flex-direction: column; gap: 20px;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-size: 15px; text-transform: uppercase; font-weight: bold; color: #2c3e50;">💼 Experience Timeline</h3>
            ${renderList(data.experience, (exp, i) => `
              <div style="margin-bottom: 15px; position: relative; padding-left: 15px; border-left: 2px solid #16a085;">
                <div style="position: absolute; left: -6px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #16a085;"></div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px;">
                  <span>${exp.title}</span>
                  <span style="color: #7f8c8d; font-weight: normal; font-size: 11px;">${exp.duration}</span>
                </div>
                <div style="color: #16a085; font-weight: bold; font-size: 11px; margin-bottom: 4px;">${exp.company}</div>
                <ul style="margin: 0; padding-left: 15px; font-size: 11px; color: #555;">
                  ${renderList(exp.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
                </ul>
              </div>
            `)}
          </div>

          <div>
            <h3 style="margin: 0 0 10px 0; font-size: 15px; text-transform: uppercase; font-weight: bold; color: #2c3e50;">💻 Portfolio Projects</h3>
            ${renderList(data.projects, proj => `
              <div style="margin-bottom: 10px; font-size: 13px;">
                <div style="font-weight: bold; color: #2c3e50;">${proj.name} <span style="color: #16a085; font-size: 11px;">[${proj.tech}]</span></div>
                <ul style="margin: 2px 0 0 0; padding-left: 15px; font-size: 11px; color: #555;">
                  ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
                </ul>
              </div>
            `)}
          </div>
        </div>

        <!-- Right Side -->
        <div style="flex: 0.9; display: flex; flex-direction: column; gap: 20px;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-size: 15px; text-transform: uppercase; font-weight: bold; color: #2c3e50;">🎓 Education</h3>
            ${renderList(data.education, edu => `
              <div style="margin-bottom: 10px; font-size: 12px;">
                <div style="font-weight: bold; color: #2c3e50;">${edu.degree}</div>
                <div style="color: #7f8c8d;">${edu.institution}</div>
                <div style="color: #16a085; font-weight: bold;">Graduated: ${edu.year} | CGPA: ${edu.score || edu.cgpa}</div>
              </div>
            `)}
          </div>

          <div>
            <h3 style="margin: 0 0 10px 0; font-size: 15px; text-transform: uppercase; font-weight: bold; color: #2c3e50;">🛠️ Tech Stack Strength</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${(Array.isArray(data.skills?.technical) ? data.skills.technical : (data.skills?.technical || data.skills || "").split(",")).slice(0, 7).map((s, idx) => `
                <div style="font-size: 11px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>${s.trim()}</span>
                    <span style="color: #7f8c8d;">${90 - (idx * 6)}%</span>
                  </div>
                  <div style="width: 100%; height: 6px; background: #ecf0f1; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${90 - (idx * 6)}%; height: 100%; background: #16a085; border-radius: 3px;"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  // 10. ATS Ultra-Clean (Plain text layout, optimal parse efficiency, zero tables/columns)
  10: (data) => `
    <div style="font-family: Arial, sans-serif; padding: 40px; color: #000000; line-height: 1.5; font-size: 12px; background: #ffffff; min-height: 1123px; width: 794px; margin: 0 auto; box-sizing: border-box;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 22px; font-weight: bold; text-transform: uppercase;">${data.name || "ATS Standard Candidate"}</h1>
        <p style="margin: 5px 0;">
          Email: ${data.email || ""} | Phone: ${data.phone || ""} | Location: ${data.location || ""}
        </p>
        <p style="margin: 5px 0;">
          LinkedIn: ${data.linkedin || "N/A"} | GitHub: ${data.github || "N/A"}
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #000; margin: 15px 0;" />

      ${data.summary ? `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; font-weight: bold;">Professional Summary</h3>
        <p style="margin: 0; text-align: justify;">${data.summary}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #000; margin: 15px 0;" />
      ` : ""}

      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; font-weight: bold;">Education</h3>
        ${renderList(data.education, edu => `
          <div style="margin-bottom: 8px;">
            <p style="margin: 0; font-weight: bold;">
              ${edu.institution} - ${edu.year}
            </p>
            <p style="margin: 0;">
              ${edu.degree} | Score: ${edu.score || edu.cgpa}
            </p>
          </div>
        `)}
      </div>

      <hr style="border: none; border-top: 1px solid #000; margin: 15px 0;" />

      ${data.experience && data.experience.length > 0 ? `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; font-weight: bold;">Professional Experience</h3>
        ${renderList(data.experience, exp => `
          <div style="margin-bottom: 10px;">
            <p style="margin: 0; font-weight: bold;">
              ${exp.company} - ${exp.duration}
            </p>
            <p style="margin: 0; font-style: italic;">
              ${exp.title}
            </p>
            <ul style="margin: 3px 0 0 20px; padding: 0;">
              ${renderList(exp.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>
      <hr style="border: none; border-top: 1px solid #000; margin: 15px 0;" />
      ` : ""}

      ${data.projects && data.projects.length > 0 ? `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; font-weight: bold;">Projects</h3>
        ${renderList(data.projects, proj => `
          <div style="margin-bottom: 8px;">
            <p style="margin: 0; font-weight: bold;">
              ${proj.name} (${proj.tech})
            </p>
            <ul style="margin: 3px 0 0 20px; padding: 0;">
              ${renderList(proj.bullets || [], b => `<li style="margin-bottom: 2px;">${b}</li>`)}
            </ul>
          </div>
        `)}
      </div>
      <hr style="border: none; border-top: 1px solid #000; margin: 15px 0;" />
      ` : ""}

      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; font-weight: bold;">Technical Skills</h3>
        <p style="margin: 2px 0;">
          <strong>Technical Skills:</strong> ${Array.isArray(data.skills?.technical) ? data.skills.technical.join(", ") : (data.skills?.technical || data.skills || "")}
        </p>
        ${data.skills?.soft ? `
        <p style="margin: 2px 0;">
          <strong>Soft Skills:</strong> ${Array.isArray(data.skills.soft) ? data.skills.soft.join(", ") : data.skills.soft}
        </p>` : ""}
      </div>
    </div>
  `
};

export function renderTemplate(templateId, data) {
  const tid = parseInt(templateId, 10);
  return TEMPLATES[tid]?.(data) || TEMPLATES[1](data);
}
