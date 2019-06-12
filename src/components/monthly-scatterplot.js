import React, {Component} from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  DiscreteColorLegend,
  LineSeries,
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

export default class MonthlyScatter extends Component {
  constructor() {
    super();
    this.state = {
      value: false
    };
  }

  render() {
    const {value} = this.state;
    const {monData, annData} = this.props.data;
    console.log(monData);
    const formattedMonthlyData = monData.map(elem => {
      return {x: new Date(elem.date), y: elem.total_rides, dateString: elem.date};
    });
    const formattedAnnualData = annData.map(elem => {
      return {x: new Date(elem.year), y: Math.round(elem.total_rides / 12), dateString: elem.year.slice(-4)};
    });

    return (
      <div>
        <XYPlot width={1000} height={500} margin={{left: 90, right: 10, top: 10, bottom: 50}} xType="time">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <ChartLabel
            text="YEAR"
            includeMargin={false}
            xPercent={0.01}
            yPercent={1.13}
            style={{
              stroke: 'black'
            }}
          />
          <ChartLabel
            text="RIDERSHIP"
            includeMargin={false}
            xPercent={-0.08}
            yPercent={0.06}
            fontSize={48}
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
            data={formattedMonthlyData}
            getColor={(val) => {
              return (val.dateString === value.dateString && val.y === value.y) ?
                '#E74C3C' : '#1A5276';
            }}
          />
          <LineSeries
            color="#C0392B"
            data={formattedAnnualData}
          />
          <MarkSeries
            colorType="literal"
            onValueMouseOver={(v, {index}) => {
              this.setState({hoverPointId: index, value: v});
            }}
            onValueMouseOut={v => this.setState({value: false})}
            size={7}
            data={formattedAnnualData}
            getColor={(val) => {
              return (val.dateString === value.dateString && val.y === value.y) ?
                '#F2D7D5' : '#C0392B';
            }}
          />

          {value !== false &&
            <Hint value={value}>
              <div >
                <h3>{value.dateString}</h3>
                <p>Riders: {value.y}</p>
              </div>
            </Hint>
          }
        </XYPlot>
      </div>
    );
  }
}
