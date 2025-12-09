import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateRoadmapPDF = async (roadmap, selections, getLabel) => {
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '900px';
  tempDiv.style.padding = '40px';
  tempDiv.style.background = 'white';
  tempDiv.style.color = '#1a1a1a';
  tempDiv.style.fontFamily = 'Poppins, Arial, sans-serif';
  tempDiv.style.lineHeight = '1.5';
  
  tempDiv.innerHTML = `
    <div id="pdf-content" style="max-width: 820px; margin: 0 auto; font-size: 13px;">

      <!-- Header -->
      <div style="text-align: center; margin-bottom: 35px; padding: 30px; 
                  background: linear-gradient(135deg, #4b6cb7, #182848);
                  color: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
        <h1 style="margin: 0; font-size: 30px; letter-spacing: 0.5px;">AlgoRythm Learning Roadmap</h1>
        <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Your Personalized Skill Growth Plan 🚀</p>
      </div>

      <!-- Learner Profile -->
      <div style="margin-bottom: 30px; border: 2px solid #4b6cb7; border-radius: 10px; padding: 20px;">
        <h2 style="color: #4b6cb7; margin-bottom: 15px;">👤 Learner Profile</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr><td><strong>Field:</strong></td><td>${getLabel('field', selections.field)}</td></tr>
          <tr><td><strong>Role:</strong></td><td>${getLabel('role', selections.role)}</td></tr>
          <tr><td><strong>Language:</strong></td><td>${getLabel('language', selections.language)}</td></tr>
          <tr><td><strong>Generated On:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
        </table>
      </div>

      <!-- Overview -->
      <div style="margin-bottom: 30px; background: #f4f7ff; border-radius: 10px; padding: 20px;">
        <h2 style="color: #15d19a; margin-bottom: 15px;">📅 Roadmap Overview</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div><strong>Total Duration:</strong> ${roadmap.totalDuration}</div>
          <div><strong>Weekly Hours:</strong> ${roadmap.weeklyHours}</div>
          <div><strong>Start Date:</strong> ${new Date().toLocaleDateString()}</div>
          <div><strong>Goal:</strong> Build Core & Advanced Proficiency</div>
        </div>
      </div>

      <!-- Learning Phases -->
      <h2 style="color: #4b6cb7; text-align: center; margin-bottom: 25px;">🎓 Learning Phases</h2>

      ${roadmap.phases.map((phase, i) => `
        <div style="margin-bottom: 40px; page-break-inside: avoid; border-left: 6px solid #4b6cb7; padding-left: 15px;">
          <div style="background: linear-gradient(135deg, #4b6cb7, #3f5efb);
                      color: white; padding: 15px 20px; border-radius: 8px;
                      margin-bottom: 20px; box-shadow: 0 3px 8px rgba(0,0,0,0.15);">
            <h3 style="margin: 0; font-size: 18px;">Phase ${i + 1}: ${phase.phase}</h3>
            <p style="margin: 4px 0 0; opacity: 0.9;">⏱ Duration: ${phase.duration}</p>
          </div>

          ${phase.weeks.map(week => `
            <div style="background: #ffffff; border: 1px solid #e0e0e0; 
                        border-radius: 8px; padding: 15px; margin-bottom: 20px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <h4 style="margin: 0 0 12px 0; color: #15d19a; font-size: 15px;">📆 ${week.week}</h4>

              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; font-size: 12px;">
                
                <!-- Topics -->
                <div>
                  <h5 style="margin: 0 0 8px 0; color: #4b6cb7; font-size: 13px;">📘 Topics</h5>
                  <ul style="margin: 0; padding-left: 18px;">
                    ${week.topics.map(topic => `<li>${topic}</li>`).join('')}
                  </ul>
                </div>

                <!-- Resources -->
                <div>
                  <h5 style="margin: 0 0 8px 0; color: #4b6cb7; font-size: 13px;">🔗 Resources</h5>
                  <ul style="margin: 0; padding-left: 18px;">
                    ${week.resources.map(r => `<li>${r}</li>`).join('')}
                  </ul>
                </div>

                <!-- Projects -->
                <div>
                  <h5 style="margin: 0 0 8px 0; color: #4b6cb7; font-size: 13px;">🛠️ Projects</h5>
                  <ul style="margin: 0; padding-left: 18px;">
                    ${week.projects.map(p => `<li>${p}</li>`).join('')}
                  </ul>
                </div>

              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; border-top: 2px solid #4b6cb7; padding-top: 15px;">
        <p style="color: #777; font-size: 12px;">
          Generated by <strong>AlgoRythm</strong> • ${new Date().toLocaleDateString()} <br/>
          Keep learning. Keep growing. 🚀
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`AlgoRythm_Roadmap_${selections.field}_${selections.role}.pdf`);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    alert('⚠️ Failed to generate PDF. Try again!');
  } finally {
    document.body.removeChild(tempDiv);
  }
};
