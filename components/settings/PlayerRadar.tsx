import { Player } from "@/types/types";
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface Props {
  attributes?: Player["attributes"];
}

const DEFAULT_ATTRIBUTES: NonNullable<Player["attributes"]> = {
  pace: 0,
  shooting: 0,
  passing: 0,
  dribbling: 0,
  defense: 0,
  physical: 0,
  stamina: 0,
  workRate: 0,
};

export const PlayerRadar: React.FC<Props> = ({ attributes }) => {
  const attrs = attributes ?? DEFAULT_ATTRIBUTES;

  const data = [
    { subject: "PACE", A: attrs.pace, fullMark: 100 },
    { subject: "SHOT", A: attrs.shooting, fullMark: 100 },
    { subject: "PASS", A: attrs.passing, fullMark: 100 },
    { subject: "DRIB", A: attrs.dribbling, fullMark: 100 },
    { subject: "DEFN", A: attrs.defense, fullMark: 100 },
    { subject: "PHYS", A: attrs.physical, fullMark: 100 },
    { subject: "STAM", A: attrs.stamina, fullMark: 100 },
    { subject: "WR", A: attrs.workRate, fullMark: 100 },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Performance"
            dataKey="A"
            stroke="#ffea00"
            fill="#ffea00"
            fillOpacity={attributes ? 0.5 : 0.08}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
