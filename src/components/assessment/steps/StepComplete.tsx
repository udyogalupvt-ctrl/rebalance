import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, Check, MessageCircle, Info, Search } from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { brand, assessmentSuccessCopy } from "@/data/content";

export default function StepComplete() {
  const { data, lastSubmissionId } = useAssessment();
  const [copied, setCopied] = useState(false);

  /*
   * The real submission id, from the context.
   *
   * This used to read `window._submissionId`, which nothing in the codebase
   * ever assigned, so it always fell through to the literal string
   * "SUBMITTED" and every patient was shown the same reference: "SUBMITTE".
   * That is also the code they need in order to track the application, so it
   * had to be the real one.
   */
  const submissionId = lastSubmissionId ?? "";
  const refCode = submissionId ? submissionId.slice(0, 8).toUpperCase() : "—";
  const firstName = data.details.fullName?.split(" ")[0] || "there";

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Prevent back navigation by modifying history
  useEffect(() => {
    // Push a dummy state so back button stays here
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="af-complete-wrapper">
      <div className="af-complete-icon-wrap">
        <div className="af-ring" />
        <div className="af-ring af-ring--delay" />
        <CheckCircle2 />
      </div>

      <h1 className="af-complete-title">That's everything, {firstName}.</h1>
      <p className="af-complete-body">
        {assessmentSuccessCopy.body} {assessmentSuccessCopy.detail}
      </p>

      <div className="af-reference-panel">
        <div className="af-reference-label">Reference</div>
        <div className="af-reference-value">{refCode}</div>
        <button
          onClick={handleCopy}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            padding: 4,
          }}
          title="Copy reference"
        >
          {copied ? <Check size={16} color="var(--primary)" /> : <Copy size={16} />}
        </button>
      </div>

      <div className="af-what-next">
        <div className="af-what-next-label">What happens next</div>

        <div className="af-what-next-row">
          <div className="af-what-next-number">1</div>
          <div>
            <div className="af-what-next-title">Your Discovery Call payment is verified</div>
            <div className="af-what-next-desc">
              We confirm the screenshot against our records. If anything&rsquo;s unclear,
              we&rsquo;ll message you.
            </div>
          </div>
        </div>

        <div className="af-what-next-row">
          <div className="af-what-next-number">2</div>
          <div>
            <div className="af-what-next-title">Your answers are reviewed</div>
            <div className="af-what-next-desc">
              Your health, lifestyle and nutrition log are read in full before we speak.
            </div>
          </div>
        </div>

        <div className="af-what-next-row">
          <div className="af-what-next-number">3</div>
          <div>
            <div className="af-what-next-title">
              We get in touch to schedule your Discovery Call
            </div>
            <div className="af-what-next-desc">On the number you gave us.</div>
          </div>
        </div>
      </div>

      <div className="af-complete-actions">
        {/* Was hardcoded to wa.me/919999999999 -- a placeholder number. A
            patient who had just paid and clicked this reached nobody. */}
        <a
          href={`https://wa.me/${brand.phoneRaw}`}
          target="_blank"
          rel="noopener noreferrer"
          className="af-submit-btn"
          style={{
            borderRadius: 999,
            padding: "0 24px",
            height: 56,
            textDecoration: "none",
            display: "inline-flex",
            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          Message us on WhatsApp
          <MessageCircle size={18} style={{ marginLeft: 8 }} />
        </a>
        <Link
          to="/"
          className="af-back-btn"
          style={{
            borderRadius: 999,
            padding: "0 24px",
            height: 56,
            textDecoration: "none",
            display: "inline-flex",
            fontWeight: 600,
            fontSize: "15px",
            border: "1.5px solid var(--border)",
          }}
        >
          Back to home
        </Link>
      </div>

      {/* Tracking. The reference is carried in the link so the patient never
          has to type it, and it is also remembered on this device. */}
      <div className="af-track-cta">
        <Link
          to="/track"
          search={submissionId ? { ref: submissionId } : {}}
          className="af-track-cta-link"
        >
          <Search size={16} />
          Track your application
        </Link>
        <p className="af-track-cta-note">
          You can check the status any time with your phone number and this reference.
        </p>
      </div>

      <div className="af-micro-line">
        <Info />
        Save your reference number in case you need to follow up.
      </div>
    </div>
  );
}
