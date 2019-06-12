import React, {Component} from 'react';
import Select from 'react-select';

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

export default class MonthlyScatter extends Component {
  constructor(props) {
    super(props);
    const {monData, annData} = this.props.data;
    const reformatM = monData.map(elem => {
      return {x: new Date(elem.date), y: elem.total_rides, dateString: elem.date};
    });
    const reformatA = annData.map((elem, i) => {
      const average = i === 17 ? Math.round(elem.total_rides / 10) :
        Math.round(elem.total_rides / 12);
      return {
        x: new Date(elem.year),
        y: average,
        dateString: elem.year.slice(-4)};
    });

    const annualRides = reformatA.map(elem => elem.y);

    const meanReformatM = reformatM.map(elem => {
      return {
        x: elem.x,
        y: elem.y - annualRides[elem.x.getFullYear() - 2001],
        dateString: elem.dateString
      };
    });

    const meanReformatA = reformatA.map(elem => {
      return {
        x: elem.x,
        y: 0,
        dateString: elem.dateString
      };
    });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this.state = {
      value: false,
      valBy: 'Value',
      filterBy: null,
      months: monthNames,
      formattedMonthlyData: {
        Value: reformatM,
        'Value-Mean': meanReformatM
      },
      formattedAnnualData: {
        Value: reformatA,
        'Value-Mean': meanReformatA
      }
    };
  }

  state = {
    valBy: 'Value'
  }

  render() {
    const {
      value,
      valBy,
      months,
      formattedMonthlyData,
      formattedAnnualData} = this.state;

    const month = formattedMonthlyData[valBy];
    const annual = formattedAnnualData[valBy];

    return (
      <div>
        Show monthly data as:&nbsp;
        {['Value', 'Value-Mean'].map(v => {
          return (<button
          key={v}
          onClick={() => this.setState({valBy: v})}
          >{v}</button>);
        })} <br />
        <Select options={months}
          closeMenuOnSelect
          isClearable
          placeholder="Highlight a month"
          onChange={d => this.setState({filterBy: d ? d.value : null})}/>
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
            animation
            colorType="literal"
            onValueMouseOver={(v, {index}) => {
              this.setState({hoverPointId: index, value: v});
            }}
            onValueMouseOut={v => this.setState({value: false})}
            opacity={0.6}
            size={7}
            data={month}
            getColor={(val) => {
              return (val.dateString === value.dateString && val.y === value.y) ?
                '#E74C3C' : '#1A5276';
            }}
          />
          <LineSeries
            animation
            color="#C0392B"
            data={annual}
          />
          <MarkSeries
            animation
            colorType="literal"
            onValueMouseOver={(v, {index}) => {
              this.setState({hoverPointId: index, value: v});
            }}
            onValueMouseOut={v => this.setState({value: false})}
            size={7}
            data={annual}
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
