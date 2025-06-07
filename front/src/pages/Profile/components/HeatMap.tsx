import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";

const ActivityHeatmapCard = ({ userData }: { userData: any }) => {
  // Initial date range (6 months)
  const initialStartDate = new Date("2025-01-01");
  const initialEndDate = new Date("2025-06-30");

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [heatMapData, setHeatMapData] = useState<Record<string, number>>({});

  const calRef = useRef<typeof CalHeatmap | null>(null); // Ref to store CalHeatmap instance

  // Function to process data into a format suitable for cal-heatmap
 

  useEffect(() => {
    // Process user data and update heatmap data
    setHeatMapData(userData);
  }, [userData]);

  // Shift the date range by one month (forward or backward)
  const shiftDate = (direction: "forward" | "backward") => {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (direction === "forward") {
      newStartDate.setMonth(newStartDate.getMonth() + 1);
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else {
      newStartDate.setMonth(newStartDate.getMonth() - 1);
      newEndDate.setMonth(newEndDate.getMonth() - 1);
    }

    // Ensure the new end date is after the start date
    if (newEndDate <= newStartDate) {
      return; // Prevent invalid range
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Render heatmap when data or start date changes
  useEffect(() => {
    console.log("heatMapData", heatMapData);  
    
    if (heatMapData) {
      // 1. Destroy previous instance if it exists
      if (calRef.current) {
        calRef.current.destroy(); // Clean up the previous heatmap instance
      }

      // 2. Clear the calendar container to ensure it's empty
      const calendarContainer = document.getElementById('cal-heatmap');
      if (calendarContainer) {
        calendarContainer.innerHTML = ''; // Clear any existing content
      }

      // 3. Initialize a new CalHeatmap instance
      const cal = new CalHeatmap();
      calRef.current = cal;

      // 4. Paint the new heatmap
      cal.paint({
        itemSelector: "#cal-heatmap",
        domain: {
          type: "month",
          gutter: 4,
          label: { text: "MMM", textAlign: "middle", position: "top" },
        },
        subDomain: { type: "day", radius: 2, width: 11, height: 11, gutter: 4 },
        date: { start: startDate }, // Set start date dynamically
        range: 12,
        data: {
          source: heatMapData,
          x: "date",
          y: "count", 
          defaultValue: 0,
        },
        scale: {
          color: {
            type: "threshold",
            range: ["#f3f4f6", "#a3e635", "#4ade80", "#22c55e"], // Example colors, adjust as needed
            domain: [1, 5, 10],
          },
        },
      });
    }
  }, [heatMapData, startDate, endDate]); // Added endDate dependency

  return (
    <div className="w-full">
      {/* Header controls */}
      <div className="flex justify-between items-center mb-4">
        <ChevronLeft
          className="cursor-pointer hover:text-orange-400"
          onClick={() => shiftDate("backward")}
        />
        <p className="text-sm text-center flex-1">Track Your Activity</p>
        <ChevronRight
          className="cursor-pointer hover:text-orange-400"
          onClick={() => shiftDate("forward")}
        />
      </div>

      {/* Heatmap area */}
      <div className="w-full">
        <div className="min-w-[750px]">
          {/* cal-heatmap container */}
          <div id="cal-heatmap"></div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmapCard;
