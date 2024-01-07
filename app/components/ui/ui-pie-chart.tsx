import {Fragment, useEffect, useId, useRef} from "react";
import * as d3 from "d3";
import {ColorSpacesType} from "../../type";
import chroma from "chroma-js";

interface UiPieChartProps {
  data: DataTypes[];
  size?: number;
  colorSummary?: boolean;
  colorSpace?: ColorSpacesType;
}

export type DataTypes = {
  name: string;
  color: string;
  ratio: number;
};

const UiPieChart = ({data, size = 256, colorSummary, colorSpace = "hex"}: UiPieChartProps) => {
  const ref = useRef<null | HTMLDivElement>(null);
  const uuid = useId();

  useEffect(() => {
    if (ref.current) {
      d3.select(ref.current).select("svg").remove();
    }

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

    svg
      .append("clipPath")
      .attr("id", uuid)
      .append("rect")
      .attr("width", size)
      .attr("height", size)
      .attr("x", size / -2)
      .attr("y", size / -2)
      .attr("rx", size / 8)
      .attr("ry", size / 8);

    // let defs = svg.append("defs");
    // let noiseFilter = defs.append("filter").attr("id", "noise");

    // noiseFilter
    //   .append("feTurbulence")
    //   .attr("type", "fractalNoise")
    //   .attr("baseFrequency", "19.5")
    //   .attr("numOctaves", "10")
    //   .attr("result", "turbulence");

    // noiseFilter
    //   .append("feComposite")
    //   .attr("operator", "in")
    //   .attr("in", "turbulence")
    //   .attr("in2", "SourceAlpha")
    //   .attr("result", "composite");

    // noiseFilter.append("feColorMatrix").attr("in", "composite").attr("type", "luminanceToAlpha");

    // noiseFilter
    //   .append("feBlend")
    //   .attr("in", "SourceGraphic")
    //   .attr("in2", "composite")
    //   .attr("mode", "color-burn");

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.color))
      .range(data.map((d) => d.color));

    const pie = d3.pie<DataTypes>().value((d) => d.ratio);
    const arc = d3.arc().innerRadius(0).outerRadius(size);
    const arcs = svg.selectAll("arc").data(pie(data)).enter().append("g");

    arcs
      .append("path")
      .attr("d", (d: d3.PieArcDatum<DataTypes>) => arc(d as unknown as d3.DefaultArcObject))
      .attr("fill", (d: d3.PieArcDatum<DataTypes>) => color(d.data.color) as string)
      // .on("click", (event, d: d3.PieArcDatum<dataTypes>) => {
      //   navigator.clipboard.writeText(d.data.color);
      // })
      // .on("mouseenter", function () {
      //   d3.select(this).style("opacity", 0.8);
      // })
      // .on("mouseleave", function () {
      //   d3.select(this).style("opacity", 1);
      // })
      // .attr("filter", "url(#noise)")
      .attr("clip-path", `url(#${uuid})`);
  }, [data]);

  const colorValue = (color: string) => {
    switch (colorSpace) {
      case "rgb":
        return chroma(color).css();
      case "hsl":
        return chroma(color).css("hsl");
      default:
        return color;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col" ref={ref} />
      {colorSummary && (
        <div className="grid grid-cols-[1rem_auto_1fr_auto] gap-2 items-center px-4">
          {data.map((d) => (
            <Fragment key={d.color}>
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: d.color,
                }}
              />
              <span>{d.name}</span>
              <span>{colorValue(d.color)}</span>
              <span>{d.ratio}%</span>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default UiPieChart;
