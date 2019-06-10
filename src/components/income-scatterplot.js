import React, {Component} from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  RadialChart,
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
      return {x: elem.med_income, y: Math.round(elem.avg_rides)};
    });
    return (
      <div>
        <XYPlot width={500} height={500} margin={{left: 50, right: 10, top: 10, bottom: 40}}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
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
                <h4>Income: ${value.x}</h4>
                <h4>Riders: {value.y}</h4>
              </div>
            </Hint>
          }
        </XYPlot>
      </div>
    );
  }
}
