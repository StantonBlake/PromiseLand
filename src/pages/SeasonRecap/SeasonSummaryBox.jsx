import React, { useState } from "react";
import "./SeasonSummaryBox.css";

const SeasonSummaryBox = ({ text }) => {
  // text is expected to be an array of paragraphs
  const [expanded, setExpanded] = useState(false);

  if (!text || text.length === 0) return null;

  // Combine paragraphs for preview (e.g. first 2 paragraphs)
  const previewParagraphs = text.slice(0, 2);
  const remainingParagraphs = text.slice(2);

  return (
    <div className="season-summary-box">
      <h2 className="summary-title">Season Recap</h2>

      <div className={`summary-text ${expanded ? "expanded" : ""}`}>
        {expanded
          ? text.map((para, i) => <p key={i}>{para}</p>)
          : previewParagraphs.map((para, i) => <p key={i}>{para}</p>)}
      </div>

      {remainingParagraphs.length > 0 && (
        <button
          className="toggle-button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "Read Less ▲" : "Read More ▼"}
        </button>
      )}
    </div>
  );
};

export default SeasonSummaryBox;
