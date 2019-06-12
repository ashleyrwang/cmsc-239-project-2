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
  LineMarkSeries,
  ChartLabel,
  LabelSeries,
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
      valueMon: false,
      valueAnn: false
    };
  }

  render() {
    const {valueMon, valueAnn} = this.state;
    const {monData, annData} = this.props.data;
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

          <ChartLabel
            text="Construction"
            includeMargin={false}
            xPercent={0.64}
            yPercent={0.7}
            style={{
              fontSize: 100
            }}
          />
          <LineMarkSeries
            colorType="literal"
            lineStyle={{stroke: '#C0392B'}}
            onValueMouseOver={(v, {index}) => {
              this.setState({hoverPointId: index, valueAnn: v});
            }}
            onValueMouseOut={() => this.setState({valueAnn: false})}
            size={7}
            data={formattedAnnualData}
            getColor={(val) => {
              return (val.dateString === valueAnn.dateString && val.y === valueAnn.y) ?
                '#F2D7D5' : '#C0392B';
            }}
          />
          <MarkSeries
            colorType="literal"
            onValueMouseOver={(v, {index}) => {
              this.setState({hoverPointIdMonth: index, valueMon: v});
            }}
            onValueMouseOut={() => this.setState({valueMon: false})}
            opacity={0.5}
            size={7}
            data={formattedMonthlyData}
            getColor={(val) => {
              return (val.dateString === valueMon.dateString && val.y === valueMon.y) ?
                '#E74C3C' : '#1A5276';
            }}
          />
          <DiscreteColorLegend
            style={{position: 'absolute', left: '100px', top: '25px'}}
            orientation={'horizontal'}
            items={[{title: 'Monthly Total', color: '#1A5276'}, {title: 'Yearly Average', color: '#C0392B'}]}
            height={70}
          />
          {valueMon !== false &&
            <Hint value={valueMon}>
              <div>
                <h3>{valueMon.dateString}</h3>
                <p>Riders: {valueMon.y}</p>
              </div>
            </Hint>
          }
          {valueAnn !== false &&
            <Hint value={valueAnn}>
              <div>
                <h3>{valueAnn.dateString}</h3>
                <p>Avg: {valueAnn.y}</p>
              </div>
            </Hint>
          }
        </XYPlot>
      </div>
    );
  }
}
