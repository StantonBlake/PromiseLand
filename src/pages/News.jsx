import React, { useState } from 'react';
import './News.css';

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="news-card">
      <div className="news-header" onClick={() => setIsOpen(!isOpen)}>
        <h2>{title}</h2>
        <span>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && <div className="news-content">{children}</div>}
    </div>
  );
};

const NewsSection = () => {
  return (
    <div className="news-container">
      <CollapsibleSection title="Feature Updates" defaultOpen={true}>
      <p>
          <strong>Road Map:</strong> 
          <li>
          Home-Completed. 
          </li>
          <li>
          League-Season Preview completed Post Draft. Keeper Core-Future addition. Manager Portfolio-Future Addition.
          </li>
          <li>
           Draft- Draft Room-functional. Recap-Post Draft Update. Teams-Functional. Archive-implement with new database.
           </li>
           <li>
            History-new Database implementation first.
           </li>
        </p>
        <p>
          <strong>July 31, 2025:</strong> Deployed legacy scoreboard on
          dashboard.Created Teams page.Created Keeper toggles allowing quick
          calcs for users.
        </p>
        <p>
          <strong>July 31, 2025:</strong> Mobile layout overhaul for Draft Room
          finalized.
        </p>
        <p>
          <strong>July 28, 2025:</strong> Legacy Calculator deployed to Manager
          Portfolios tab.
        </p>
        <p>
          <strong>July 25, 2025:</strong> Built Backend Data Support.
        </p>
        <p>
          <strong>July 9, 2025:</strong> Site Framework.
        </p>
        <p>
          <strong>July 7, 2025:</strong> Project Start.
        </p>
      </CollapsibleSection>
      <CollapsibleSection title="Legacy Scoring">
        <p>This section details the creation of the Legacy Score:</p>
        <ul>
          <li>
            <strong>1st:</strong> +100
          </li>
          <li>
            <strong>2nd:</strong> +60
          </li>
          <li>
            <strong>3rd:</strong> +40
          </li>
          <li>
            <strong>4th:</strong> +15
          </li>
          <li>
            <strong>8th:</strong> -10
          </li>
          <li>
            <strong>9th:</strong> -15
          </li>
          <li>
            <strong>Last:</strong> -25
          </li>
          <li>
            <strong>Wins:</strong> +3
          </li>
          <li>
            <strong>Undefeated Season:</strong> +50
          </li>
          <li>
            <strong>Winless Season:</strong> -50
          </li>
          <li>
            <strong>Most reg season Wins(Per Season):</strong> +20
          </li>
          <li>
            <strong>Most points scored(All-Time):</strong> +50
          </li>
          <li>
            <strong>Grinder(low draft, made playoffs):</strong> +20
          </li>
          <li>
            <strong>Drafted fantasy #1 scorer:</strong> +25
          </li>
          <li>
            <strong>Drafted #1 positional player:</strong> +10
          </li>
          <li>
            <strong>50 wins:</strong> +10
          </li>
          <li>
            <strong>100 wins:</strong> +25
          </li>
          <li>
            <strong>150 wins:</strong> +50
          </li>
          <li>
            <strong>200 wins:</strong> +100
          </li>
          <li>
            <strong>250 wins:</strong> +150
          </li>
          <li>
            <strong>2-time champ:</strong> +50
          </li>
          <li>
            <strong>Back-to-Back Champion:</strong> +125
          </li>
          <li>
            <strong>
              Steelers mentality(over .500 for 3 straight seasons:
            </strong>{' '}
            +20
          </li>
          <li>
            <strong>4 straight +.500:</strong> +40
          </li>
          <li>
            <strong>5 straight +.500:</strong> +75
          </li>
          <li>
            <strong>6 straight +.500:</strong> +100
          </li>
        </ul>
        <p>
          Movement is calculated based on draft slot average and season finish
          rank.
        </p>
      </CollapsibleSection>

      <CollapsibleSection title="Draft vs Finish Movement">
        <p>
          This section highlights how managers perform relative to where they
          drafted:
        </p>
        <ul>
          <li>
            <strong>+3 Movement:</strong> Finished 3+ places higher than draft
            slot.
          </li>
          <li>
            <strong>–2 Movement:</strong> Finished 2 spots lower than draft
            slot.
          </li>
          <li>
            <strong>Draft Bust:</strong> Finished in bottom 3 after top-3 draft
            position.
          </li>
        </ul>
        <p>
          Movement is calculated based on draft slot average and season finish
          rank.
        </p>
      </CollapsibleSection>
    </div>
  );
};

export default NewsSection;
