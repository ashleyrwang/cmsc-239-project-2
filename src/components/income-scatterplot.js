import React, {Component} from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  ChartLabel,
  Hint,
  LineSeries
} from 'react-vis';

export default class IncomeScatter extends Component {
  constructor() {
    super();
    const trendLine = [
      {x: 0, y: 1971.7},
      {x: 150000, y: 12426.7}
    ];
    const trendlineIntercept = [
      {x: 0, y: 0},
      {x: 150000, y: 14445}
    ]
    this.state = {
      value: false,
      trendBy: 'No Trendline',
      trendline: {
        'No Trendline': [],
        'Linear': trendLine,
        'Linear with forced 0 y-intercept': trendlineIntercept
      }
    };
  }

  state = {
    trendBy: 'No Trendline'
  }

  render() {
    const {value, trendBy, trendline} = this.state;
    const {data} = this.props;
    const formattedData = data.map(elem => {
      return {x: elem.med_income, y: Math.round(elem.avg_rides), station: elem.station};
    });

    const trendData = trendline[trendBy];

    return (
      <div>
        <XYPlot width={700} height={500} margin={{left: 80, right: 10, top: 10, bottom: 80}}
          xDomain={[0, 150000]} yDomain={[0, 15000]}>
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
            xPercent={-0.1}
            yPercent={0.06}
            fontSize={48}
            style={{
              stroke: 'black',
              transform: 'rotate(-90)',
              textAnchor: 'end'
            }}
          />
          <LineSeries
            animation
            color="#C0392B"
            data={trendData}
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
        Add trendline:&nbsp;
        {['Linear',
          'Linear with forced 0 y-intercept'].map(v => {
            return (<button
              key={v}
              onClick={() => this.setState({trendBy: v})}
              >{v}</button>);
          })}
      </div>
    );
  }
}
