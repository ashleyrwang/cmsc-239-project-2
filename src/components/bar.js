import React, {Component} from 'react';
import {RadialChart, Hint} from 'react-vis';
import RadioButtonMenu from './radio-button-menu';

function groupBy(data, key) {
  return data.reduce((acc, row) => {
    if (!acc[row[key]]) {
      acc[row[key]] = [];
    }
    acc[row[key]].push(row);
    return acc;
  }, {});
}

export default class BarChart extends Component {
  constructor(props) {
    super(props);

    const defaultSort = [...this.props.data]
      .sort((a, b) => a.order - b.order);
    const incomeSort = [...this.props.data]
      .sort((a, b) => b.med_income - a.med_income);
    const ridershipSort = [...this.props.data]
      .sort((a, b) => b.avg_rides - a.avg_rides);

    const alphabeticalSort = [...this.props.data].sort((a, b) => {
      if (a.station < b.station) {
        return -1;
      }
      if (a.station > b.station) {
        return 1;
      }
      return 0;
    });

    this.state = {
      value: false,
      sortBy: 'default',
      sorts: {
        default: defaultSort,
        alphabetical: alphabeticalSort,
        income: incomeSort,
        ridership: ridershipSort
      }
    };
  }

  render() {
    const {value, keyOfInterest} = this.state;
    const {data} = this.props;
    const preppedData = Object.entries(groupBy(data, keyOfInterest)).map(([key, values]) => {
      return {key, size: values.length};
    });
    return (
      <div>
      Sort rows:&nbsp;
        <RadioButtonMenu
            buttonValues={['alphabetical', 'mean', 'max']}
            currentValue={sortBy}
            onClick={value => this.setState({sortBy: value})}
            />
        <RadialChart
          animation
          innerRadius={100}
          radius={140}
          getAngle={d => d.size}
          data={preppedData}
          onValueMouseOver={v => this.setState({value: v})}
          onSeriesMouseOut={v => this.setState({value: false})}
          width={300}
          height={300}
          padAngle={0.04}
        >
          {value !== false && <Hint value={value} />}
        </RadialChart>
        {Object.keys(data[0]).map(key => {
          return (<button
            key={key}
            onClick={() => this.setState({keyOfInterest: key})}
            >{key}</button>);
        })}
      </div>
    );
  }
}
