import React from "react";
import ChampionPlaque from "./ChampionPlaque";
import SeasonSummaryBox from "./SeasonSummaryBox";
import FinalStandingsTable from "./FinalStandingsTable";
import DraftVsFinishChart from "./DraftVsFinishChart";

const SeasonRecapPage = ({ champion, standings, seasonText, draftFinishData }) => {
  console.log("SeasonRecapPage props:", {
    champion,
    standings,
    seasonText,
    draftFinishData,
  });

  if (!champion || !standings || !seasonText || !draftFinishData) {
    return <div>Loading season recap data...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 text-gray-900 dark:text-gray-100">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">🏈 2024 Season Recap</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          A look back at the triumphs, turns, and turmoil
        </p>
      </div>

      {/* Champion Plaque */}
      <ChampionPlaque
        manager={champion.manager}
        record={champion.record}
        year={champion.year}
      />

      {/* Season Recap Text Box */}
      <SeasonSummaryBox text={seasonText} />

      {/* Final Standings Table */}
      <FinalStandingsTable data={standings} championName={champion.manager} />

      {/* Draft vs Finish Chart */}
      <DraftVsFinishChart data={draftFinishData} />
    </div>
  );
};

export default SeasonRecapPage;
