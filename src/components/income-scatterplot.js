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

    const numX = 140;
    const xs = [...new Array(numX)].map((d, i) => i / numX * 150000);

    const exp = {
      data: xs.map(d => ({
        x: d,
        y: 2709.8 * Math.exp(0.00001 * d)
      })),
      equation: 'y = 2709.8e^(0.00001x)',
      rsquared: 0.4099
    };

    const quad = {
      data: xs.map(d => ({
        x: d,
        y: -0.0000005 * Math.pow(d, 2) + 0.1424 * d - 115.19
      })),
      equation: 'y = -0.0000005x^2 + 0.1424x - 115.19',
      rsquared: 0.4311
    };

    const trendLine = {
      data: xs.map(d => ({
        x: d,
        y: 0.0697 * d + 1971.7
      })),
      equation: 'y = 0.0697x + 1971.7',
      rsquared: 0.4093
    };

    const trendlineIntercept = {
      data: xs.map(d => ({
        x: d,
        y: 0.0963 * d
      })),
      equation: 'y = 0.0963x',
      rsquared: 0.3345
    };

    const noTrend = {
      data: [],
      equation: 'N/A',
      rsquared: 'N/A'
    }

    this.state = {
      value: false,
      trendBy: 'No Trendline',
      trendline: {
        'No Trendline': noTrend,
        'Linear': trendLine,
        'Linear with b=0': trendlineIntercept,
        'Exponential': exp,
        'Quadratic': quad
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
            data={trendData.data}
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
                {value.station}<br />
                Income: ${value.x}<br />
                Riders: {value.y}
              </div>
            </Hint>
          }
        </XYPlot>
        Add trendline:&nbsp;
        {['Linear', 'Linear with b=0', 'Exponential', 'Quadratic'].map(v => {
            return (<button
              key={v}
              onClick={() => this.setState({trendBy: v})}
              >{v}</button>);
          })} <br />
        Equation:&nbsp;{trendData.equation} <br />
        R-squared:&nbsp;{trendData.rsquared} <br />
      </div>
    );
  }
}
