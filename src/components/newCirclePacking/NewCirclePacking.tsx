import React, { useEffect, useRef } from 'react';
import CirclePack from 'circlepack-chart';
import { useDispatch } from 'react-redux';
import { isExpanded, setList } from '../../features/youtubeList/youtubeListSlice';
import 'd3-transition';

interface Node {
  name: string;
  value?: number;
  color?: string;
  children?: Node[];
}

interface CirclePackingChartProps {
  data?: Node;
}

// Deep clone function to create a mutable copy of the data
const deepClone = (obj: unknown): object => {
  return JSON.parse(JSON.stringify(obj));
};

// Constants for generating large datasets
const CHILDREN_PROB_DECAY = 0.15; // Probability of having children decreases per level
const MAX_CHILDREN = 20; // Maximum number of children per node
const MAX_VALUE = 100; // Maximum value for leaf nodes

// Function to generate a large dataset dynamically
const genNode = (name: string = 'root', probOfChildren: number = 1): Node => {
  if (Math.random() < probOfChildren) {
    return {
      name,
      children: [...Array(Math.round(Math.random() * MAX_CHILDREN))].map((_, i) =>
        genNode(`Node-${i}`, probOfChildren - CHILDREN_PROB_DECAY)
      ),
    };
  } else {
    return {
      name,
      value: Math.round(Math.random() * MAX_VALUE),
    };
  }
};

export const NewCirclePackingChart: React.FC<CirclePackingChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<CirclePack | null>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!chartRef.current) return;

    // Use provided data or generate a large dataset dynamically
    const chartData = data ? deepClone(data) : genNode();

    const createChart = () => {
      if (!chartRef.current) return;

      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }

      // Create a new chart instance
      chartInstance.current = new CirclePack(chartRef.current)
        .data(chartData) // Use the provided or generated data
        .color((_, info) => {
          // Calculate a shade of purple based on depth
          if (info) {
            const depth = info.depth; // Get the depth of the node
            const maxDepth = 5; // Set a maximum depth for normalization
            const lightness = Math.max(10, 50 - (depth / maxDepth) * 40);
        
            // Ensure lightness stays within a valid range (20% to 100%)
            const clampedLightness = Math.max(20, Math.min(100, lightness));
            return `hsl(280, 100%, ${clampedLightness}%)`; // HSL color with purple hue (280°)
          } else {
            return 'hsl(280, 100%, 50%)'; // Fallback purple color if info is not available
          }
        })        
        .showLabels(true) // Hide labels for better performance with large datasets
        .minCircleRadius(8) // Set a minimum circle radius to avoid clutter
        .excludeRoot(false) // Exclude the root node from rendering
        .tooltipContent((d, node) => `Videos: <i>${node.data.value}</i>`) // Add tooltips
        .width(chartRef.current.clientWidth)
        .transitionDuration(0)
        .height(chartRef.current.clientHeight)
        .onClick((data) => {
          if (data?.videos_id) {
            dispatch(setList(data.videos_id));
            dispatch(isExpanded(true));
          }
        });
    };

    createChart();

    // Observe size changes to dynamically adjust chart dimensions
    resizeObserver.current = new ResizeObserver(() => {
      if (chartInstance.current && chartRef.current) {
        chartInstance.current.width(chartRef.current.clientWidth);
        chartInstance.current.height(chartRef.current.clientHeight);
      }
    });

    resizeObserver.current.observe(chartRef.current);

    // Cleanup function
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
        resizeObserver.current = null;
      }

      if (chartInstance.current) {
        // chartInstance.current.destroy(); // Properly destroy the chart instance
        chartInstance.current = null;
      }

      if (chartRef.current) {
        chartRef.current.innerHTML = ''; // Clear the container
      }
    };
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    ></div>
  );
};