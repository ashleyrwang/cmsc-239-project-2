import React, {Component} from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  ChartLabel,
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
      sortBy: 'default',
      scale: incomeScale,
      sorts: {
        default: defaultSort,
        alphabetical: alphabeticalSort,
        income: incomeSort,
        ridership: ridershipSort
      }
    };
  }

  state = {
    sortBy: 'default'
  }

  render() {
    const {
      sortBy,
      scale,
      sorts} = this.state;
    const chartWidth = 650;
    const chartHeight = 600;
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
      <div>
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
            colorType="literal"
            data={reformat}
            getColor={v => color(v.inc)}
          />
        </XYPlot>
        Sort by:&nbsp;
        {['default', 'alphabetical', 'income', 'ridership'].map(v => {
          return (<button
            key={v}
            onClick={() => this.setState({sortBy: v})}
            >{v}</button>);
        })}
      </div>
    );
  }
}
