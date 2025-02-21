import React from 'react';
import Image from 'next/image';

type Player = {
    rank: number;
    name: string;
    avatar: string;
    points: number;
};

type RankingTableProps = {
    players: Player[];
    title: string;
    timer: string;
};

const RankingTable: React.FC<RankingTableProps> = ({
                                                       players = [],
                                                       title = 'Official WCGF Super Leagues',
                                                       timer = 'End in 3 days and 8 hours'
                                                   }) => {
    return (
        <div className="table-responsive">
            {/* Timer header */}
            <div className="lt-timer py-2 fs-5">
                {timer}
            </div>

            {/* Ranking table */}
            <div className="lt-table-container">
                <table className="lt-table table mb-0">
                    <tbody>
                    {players.map((player) => (
                        <tr key={player.rank} className="lt-row">
                            <td className="lt-rank">
                                <div className="lt-rank-number">
                                    {player.rank}
                                </div>
                            </td>
                            <td className="lt-avatar">
                                <Image
                                    src={player.avatar}
                                    alt={player.name}
                                    width={40}
                                    height={40}
                                />
                            </td>
                            <td className="fs-5">
                                {player.name}
                            </td>
                            <td className="lt-points">
                                <span className="p-2 fs-5 fw-bold rounded">{player.points} PTS</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="lt-footer">
                {title}
            </div>
        </div>
    );
};

export default RankingTable;