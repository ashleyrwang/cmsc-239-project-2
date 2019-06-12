import React, {Component} from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalBarSeries
} from 'react-vis';
import {scaleLog} from 'd3-scale';
import {interpolateYlGnBu} from 'd3-scale-chromatic';

export default class BarChart extends Component {
  constructor(props) {
    super(props);

    const defaultSort = [...this.props.data]
      .sort((a, b) => b.order - a.order);
    const incomeSort = [...this.props.data]
      .sort((a, b) => a.med_income - b.med_income);
    const ridershipSort = [...this.props.data]
      .sort((a, b) => a.avg_rides - b.avg_rides);

    const alphabeticalSort = [...this.props.data].sort((a, b) => {
      if (a.station < b.station) {
        return 1;
      }
      if (a.station > b.station) {
        return -1;
      }
      return 0;
    });

    const incomeScale = scaleLog()
      .domain([20150, 140500])
      .range([1, 0]);

    this.state = {
      sortBy: 'alphabetically',
      scale: incomeScale,
      sorts: {
        geographically: defaultSort,
        alphabetically: alphabeticalSort,
        'by income': incomeSort,
        'by ridership': ridershipSort
      }
    };
  }

  state = {
    sortBy: 'alphabetically'
  }

  render() {
    const {
      sortBy,
      scale,
      sorts} = this.state;
    const chartWidth = 700;
    const chartHeight = 700;
    const margin = {
      left: 120,
      right: 10,
      top: 10,
      bottom: 40
    };
    const chartDomain = [0, 15000];

    const sorted = sorts[sortBy];
    const color = d => interpolateYlGnBu(scale(d));

    const reformat = sorted.map(d => ({
      y: d.station,
      x: d.avg_rides,
      inc: d.med_income
    }));

    return (
      <div className="bar-container">
        <XYPlot
          yType="ordinal"
          width={chartWidth}
          height={chartHeight}
          margin={margin}
          xDomain={chartDomain}
        >
          <XAxis title="Average Daily Ridership (2016)"/>
          <YAxis />
          <HorizontalBarSeries
            animation
            colorType="literal"
            data={reformat}
            getColor={v => color(v.inc)}
            onValueMouseOver={v => {
              console.log(v);
            }}
          />
        </XYPlot>
        Try re-sorting the bar chart:&nbsp;
        {['alphabetically', 'geographically', 'by ridership', 'by income'].map(v => {
          return (<button
            key={v}
            onClick={() => this.setState({sortBy: v})}
            >{v}</button>);
        })}
      </div>
    );
  }
}
