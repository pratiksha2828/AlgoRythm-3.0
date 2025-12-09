import React from 'react';

const AccordionItem = ({ title, children, delay = 0 }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="faq-item" style={{ animationDelay: `${delay}ms` }}>
      <button
        className={`faq-question ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="q-left">
          <span className="q-icon">{open ? '✦' : '✧'}</span>
          <span className="q-title">{title}</span>
        </div>
        <div className="q-right">{open ? '−' : '+'}</div>
      </button>

      <div className={`faq-answer ${open ? 'visible' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default function FAQ() {
  const items = [
    {
      q: 'What makes AlgoRythm different from other coding platforms?',
      a: (
        <>
          <p>
            AlgoRythm combines structured learning paths with practical code analysis in one unified platform. Unlike fragmented resources, we provide organized learning roadmaps based on your chosen domains, AI-powered code refactoring, public repository analysis, and motivational streaks—all designed to bridge the gap between theoretical knowledge and real-world coding skills.
          </p>
        </>
      ),
    },
    {
      q: 'How does the personalized learning roadmap work?',
      a: (
        <>
          <p>
            AlgoRythm generates customized learning paths based on your selected interests and skill levels. You choose from domains like Web Development, Data Structures, and Algorithms, and we create structured roadmaps that adapt to your progress, focusing on areas where you need the most improvement.
          </p>
        </>
      ),
    },
    {
      q: 'What AI models power the code analysis and refactoring features?',
      a: (
        <>
          <p>
            We use specialized AI models including CodeLlama for code refactoring and Mistral for intelligent assessment. This approach ensures you get quality assistance for different tasks—whether you need concise explanations or detailed code improvements.
          </p>
        </>
      ),
    },
    {
      q: 'Can I analyze private repositories?',
      a: (
        <>
          <p>
            Currently, AlgoRythm supports analysis of public GitHub repositories only. This ensures transparency and accessibility while maintaining platform security and performance.
          </p>
        </>
      ),
    },
    {
      q: 'How does the motivational streak system work?',
      a: (
        <>
          <p>
            Our streak system tracks your consistent learning across different categories: algorithm tracing, test completion, project work, and daily challenges. Maintaining streaks helps build coding habits and provides visual progress indicators to keep you motivated throughout your learning journey.
          </p>
        </>
      ),
    },
    {
      q: 'What kind of repository analysis can I perform?',
      a: (
        <>
          <p>
            AlgoRythm offers comprehensive public repository analysis including basic metrics (stars, forks, contributors), code structure insights, dependency mapping, AI-powered chatbots for codebase exploration, and documentation quality assessment. This helps you understand complex codebases and learn from real-world projects.
          </p>
        </>
      ),
    },
    {
      q: 'Is there collaborative learning support?',
      a: (
        <>
          <p>
            AlgoRythm focuses on personalized individual learning experiences. Our platform is designed to help you build personal coding skills through structured roadmaps and AI-assisted tools tailored to your learning journey.
          </p>
        </>
      ),
    },
    {
      q: 'How accurate are the AI-generated code explanations?',
      a: (
        <>
          <p>
            Our AI system has shown 83% user satisfaction in beta testing. The explanations are contextually relevant and designed to deepen understanding of both individual code blocks and overall system architecture. We continuously improve our models based on user feedback.
          </p>
        </>
      ),
    },
    {
      q: 'What educational research supports AlgoRythm\'s approach?',
      a: (
        <>
          <p>
            AlgoRythm is built on proven educational principles including 40% higher completion rates with structured learning paths, 72% improvement in conceptual understanding through interactive tracing, and 79% mastery rates in programming courses using dedicated platforms.
          </p>
        </>
      ),
    },
    {
      q: 'Can beginners with no coding experience use AlgoRythm?',
      a: (
        <>
          <p>
            Absolutely! AlgoRythm is designed for learners at all levels. Beginners receive foundational roadmaps starting with basic programming concepts, while experienced developers get advanced challenges and architectural insights. Our platform has proven effective for both technical and non-technical students.
          </p>
        </>
      ),
    },
    {
      q: 'How do I get started and what support is available?',
      a: (
        <>
          <p>
            Simply choose your learning domains and skill level to begin your personalized learning journey. Use the feedback system to report any issues or suggest features. Our platform includes comprehensive documentation, and we're continuously improving based on user input.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="faq-wrap">
      <div className="background-layer" aria-hidden="true" />

      <div className="faq-hero">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="faq-sub">Helpful answers and guidance to get the most from the platform.</p>
      </div>

      <div className="faq-list">
        {items.map((it, i) => (
          <AccordionItem key={i} title={it.q} delay={i * 80}>
            {it.a}
          </AccordionItem>
        ))}
      </div>

      <style>{`
        :root{--accent:#7ec8ff;--muted:#0b1626;--card-bg:rgba(255,255,255,0.03)}
        .faq-wrap{min-height:80vh;padding:72px 20px 120px;display:flex;flex-direction:column;align-items:center;position:relative;color:#dff7fb}

        .background-layer {
          position: fixed;
          inset: 0;
          z-index: -1; /* sit behind content but above page background */
          background-image: url('/images/Generate%20a%20cosmic%20sp.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          pointer-events: none;
          /* lighten image so it's visible under overlay */
          filter: brightness(0.78) saturate(1);
          transition: filter .6s ease;
        }

        .background-layer:hover { filter: brightness(0.9) saturate(1.05); }

        .background-layer::after {
          content: '';
          position: absolute;
          inset: 0;
          /* lighter overlay so background remains visible */
          background: linear-gradient(180deg, rgba(2,8,23,0.18), rgba(2,8,23,0.28));
          transition: background .6s ease;
        }

        .background-layer::before{
          content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px);background-size:100px 100px;opacity:0.06;mix-blend-mode:screen;animation:pan 40s linear infinite;}

        @keyframes pan{from{transform:translateY(0)}to{transform:translateY(-200px)}}

        .faq-hero{max-width:1100px;text-align:center;margin-bottom:28px;z-index:1}
        .faq-title{font-family:"Mountains of Christmas", serif; font-weight:700;font-size:3.2rem;color:var(--accent);text-shadow:0 6px 30px rgba(0,0,0,0.6),0 0 18px rgba(126,200,255,0.12);margin:0;animation:float 6s ease-in-out infinite}
        .faq-sub{font-family:'Marhey',Poppins,system-ui;color:#cfeefb;margin-top:8px;font-size:1.05rem;opacity:0.95}

        /* subtle floating animation for the title */
        @keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}

        .faq-list{width:100%;max-width:1100px;margin-top:6px;z-index:1}
        .faq-item{margin-bottom:16px;opacity:0;transform:translateY(12px);animation:fadeInUp .6s ease forwards}

        .faq-question{width:100%;display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-radius:12px;background:var(--card-bg);border:1px solid rgba(126,200,255,0.06);backdrop-filter:blur(6px);cursor:pointer;transition:all .28s cubic-bezier(.2,.9,.3,1)}
        .faq-question:hover{transform:translateY(-4px) scale(1.01);box-shadow:0 12px 40px rgba(0,0,0,0.6)}
        .faq-question.open{background:linear-gradient(135deg, rgba(126,200,255,0.02), rgba(9,14,26,0.12));border-color:rgba(126,200,255,0.12)}

        .q-left{display:flex;align-items:center;gap:14px}
        .q-icon{width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#2dd4bf,#60a5fa);color:#012;text-shadow:0 1px 0 rgba(255,255,255,0.3);box-shadow:0 6px 18px rgba(96,165,250,0.08);transition:transform .28s ease, box-shadow .28s ease}
        .faq-question.open .q-icon{transform:rotate(20deg) scale(1.05);box-shadow:0 14px 26px rgba(96,165,250,0.16)}
  .q-title{font-family:'Poppins','Inter',system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;font-weight:600;font-size:1.06rem;letter-spacing:0.2px;color:#e9fbff}
        .q-right{font-family:'Marhey',Poppins,system-ui;font-size:1.2rem;color:#9de8ff;transition:transform .25s ease}
        .faq-question.open .q-right{transform:rotate(90deg)}

        .faq-answer{max-height:0;overflow:hidden;padding:0 20px;border-left:3px solid rgba(126,200,255,0.06);background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);transition:max-height .45s ease, padding .35s ease;transform-origin:top}
        .faq-answer.visible{padding:16px 20px 20px;max-height:520px}
        .faq-answer p{margin:0;color:#dff7fb;font-family:'Marhey',Poppins,system-ui;line-height:1.7}

        @keyframes fadeInUp{from{opacity:0;transform:translateY(12px) scale(.995)}to{opacity:1;transform:translateY(0) scale(1)}}

        /* small twinkle effect for q-icon */
        @keyframes twinkle{0%{filter:brightness(0.95)}50%{filter:brightness(1.18)}100%{filter:brightness(0.95)}}
        .q-icon{animation:twinkle 6s ease-in-out infinite}

        @media (max-width:768px){.faq-title{font-size:2.2rem}.faq-question{padding:14px}.q-title{font-size:1rem}}
  `}</style>
    </div>
  );
}