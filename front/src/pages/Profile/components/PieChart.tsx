import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";




const StyledText = styled("text")(() => ({
  fill: "white",
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 40,
  fontWeight: 500,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top,  } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2 + 10}>
      {children}
    </StyledText>
  );
}

export default function Pie({pieData}:any) {
    const Total = pieData[0] + pieData[1] + pieData[2];
    const data = [
  { value: pieData[0], color: "#22c55e", label: "Easy" },
  { value: pieData[1], color: "yellow", label: "Medium" },
  { value: pieData[2], color: "red", label: "Hard" },
];

 if(Total === 0) {
  return (
    <PieChart
        series={[
          {
            startAngle: -90,
            endAngle: 90,
            paddingAngle: 5,
            innerRadius: 60,
            outerRadius: 80,
            cy: '75%',
            data: [{ value: 1, label: "No Data", color: "gray"  }],
            color: "#ccc",
          },
        ]}
      
        hideLegend
        
      >
      <PieCenterLabel>{Total}</PieCenterLabel>
    </PieChart>
  );
}
  return (
    <PieChart
        series={[
          {
            startAngle: -90,
            endAngle: 90,
            paddingAngle: 5,
            innerRadius: 60,
            outerRadius: 80,
            cy: '75%',
            data:data,
          },
        ]}
        width={200}
        height={150}
        hideLegend
      >
      <PieCenterLabel>{Total}</PieCenterLabel>
    </PieChart>
  );
}
