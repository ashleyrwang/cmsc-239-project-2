import React, {Component} from 'react';

import {XYPlot, ArcSeries, YAxis, CircularGridLines} from 'react-vis';
import {scaleLinear} from 'd3-scale';
import {interpolateRdBu} from 'd3-scale-chromatic';

function getDomain(data, accessor) {
  return data.reduce((acc, row) => {
    const val = Number(row[accessor]);
    return {
      min: Math.min(val, acc.min),
      max: Math.max(val, acc.max)
    };
  }, {min: Infinity, max: -Infinity});
}

export default class PhaseChart extends Component {
  constructor(props) {
    super(props);

    const monSort = this.props.data.filter(d => d.dow === 1);
    const tueSort = this.props.data.filter(d => d.dow === 2);
    const wedSort = this.props.data.filter(d => d.dow === 3);
    const thuSort = this.props.data.filter(d => d.dow === 4);
    const friSort = this.props.data.filter(d => d.dow === 5);
    const satSort = this.props.data.filter(d => d.dow === 6);
    const sunSort = this.props.data.filter(d => d.dow === 7);

    const wday = [1, 2, 3, 4, 5];
    const wend = [6, 7];
    const wdaySort = this.props.data.filter(d => wday.includes(d.dow));
    const wendSort = this.props.data.filter(d => wend.includes(d.dow));

    const tempScale = scaleLinear()
      .domain([-21, 85])
      .range([1, 0]);

    this.state = {
      filter: 'Weekday',
      filters: {
        Monday: monSort,
        Tuesday: tueSort,
        Wednesday: wedSort,
        Thursday: thuSort,
        Friday: friSort,
        Saturday: satSort,
        Sunday: sunSort,
        Weekday: wdaySort,
        Weekend: wendSort,
        All: this.props.data
      },
      scale: tempScale
    };
  }

  state = {
    filter: 'Weekday'
  }

  render() {
    const {filter, filters, scale} = this.state;

    const chartWidth = 700;
    const chartHeight = 700;

    const filtered = filters[filter];
    const color = d => interpolateRdBu(scale(d));
    const reformat = filtered.map((row, index) => {
      return {
        color: color(row.temp),
        radius0: 0,
        radius: row.ridership,
        angle: ((index + 1) * 2 * Math.PI) / filtered.length,
        angle0: (index * 2 * Math.PI) / filtered.length
      };
    });

    return (
      <div>
        <XYPlot xDomain={[-350000, 350000]} yDomain={[-350000, 350000]}
          width={chartWidth}
          height={chartHeight}>
          <ArcSeries
            animation
            radiusDomain={[0, 350000]}
            data={reformat}
            colorType={'literal'}
          />
          <CircularGridLines />
          <YAxis
            left={chartWidth / 2 + 5}
            tickFormat={(t, i) => t > 0 ? t : ''}
            style={{
              line: {display: 'none'},
              ticks: {stroke: '#000'},
              text: {stroke: 'none', fill: '#000'}
            }}/>
        </XYPlot>
        Filter data by:&nbsp;
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
          'Saturday', 'Sunday', 'Weekday', 'Weekend', 'All'].map(v => {
            return (<button
            key={v}
            onClick={() => this.setState({filter: v})}
            >{v}</button>);
          })}
      </div>
    );
  }
}
