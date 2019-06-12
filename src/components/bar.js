import React, {Component} from 'react';

import {RadialChart, Hint} from 'react-vis';

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

    const defaultSort = [...this.props.data];
    const alphabeticalSort = [...this.props.data];
    const incomeSort = [...this.props.data];
    const ridershipSort = [...this.props.data];

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
