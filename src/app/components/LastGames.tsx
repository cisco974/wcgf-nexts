import React from "react";
import RankingTable from "./RankingTable";

type GameResult = {
  rank: number;
  avatar: string;
  name: string;
  gameTitle: string;
  result: number;
};

type LastGamesProps = {
  results: GameResult[];
  title?: string;
  sectionTitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

const LastGames: React.FC<LastGamesProps> = ({
  results = [],
  title = "Official WCGF Super Leagues",
  sectionTitle = "LAST 3 GAMES SERIE",
  buttonText = "VIEW MORE",
  onButtonClick = () => {},
}) => {
  return (
    <div className="last-games-container">
      {sectionTitle && (
        <div className="last-games-title text-center text-primary mb-3">
          <h4>{sectionTitle}</h4>
        </div>
      )}

      <RankingTable
        players={results}
        title={title}
        timer="Last Games"
        type="games"
        buttonText={buttonText}
        onButtonClick={onButtonClick}
        headerBgColor="#007bff"
      />
    </div>
  );
};

export default LastGames;
