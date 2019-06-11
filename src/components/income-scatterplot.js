import React, {Component} from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  DiscreteColorLegend,
  ChartLabel,
  Hint
} from 'react-vis';

function groupBy(data, key) {
  return data.reduce((acc, row) => {
    if (!acc[row[key]]) {
      acc[row[key]] = [];
    }
    acc[row[key]].push(row);
    return acc;
  }, {});
}

export default class IncomeScatter extends Component {
  constructor() {
    super();
    this.state = {
      value: false
    };
  }

  render() {
    const {value, hoverPointId} = this.state;
    const {data} = this.props;
    const formattedData = data.map(elem => {
      return {x: elem.med_income, y: Math.round(elem.avg_rides), station: elem.station};
    });
    return (
      <div>
        <XYPlot width={500} height={500} margin={{left: 80, right: 10, top: 10, bottom: 80}}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <ChartLabel
            text="MEDIAN HOUSEHOLD INCOME (2016)"
            includeMargin={false}
            xPercent={0.01}
            yPercent={1.13}
            style={{
              stroke: 'black'
            }}
          />
          <ChartLabel
            text="AVERAGE DAILY RIDERSHIP (2016)"
            includeMargin={false}
            xPercent={-0.13}
            yPercent={0.06}
            style={{
              stroke: 'black',
              transform: 'rotate(-90)',
              textAnchor: 'end'
            }}
          />
          <MarkSeries
            colorType="literal"
            onValueMouseOver={(v, {index}) => {
              this.setState({hoverPointId: index, value: v});
            }}
            onValueMouseOut={v => this.setState({value: false})}
            opacity={0.6}
            size={7}
            data={formattedData}
            getColor={(val) => {
              return (val.x === value.x && val.y === value.y) ?
                '#E74C3C' : '#1A5276';
            }}
          />
          {value !== false &&
            <Hint value={value}>
              <div >
                <h3>{value.station}</h3>
                <p>Income: ${value.x}</p>
                <p>Riders: {value.y}</p>
              </div>
            </Hint>
          }
        </XYPlot>
      </div>
    );
  }
}
