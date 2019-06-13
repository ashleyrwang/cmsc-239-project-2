import React, {Component} from 'react';
import {scaleLinear} from 'd3-scale';

import {Treemap, Hint} from 'react-vis';

function _formatData(data) {
  const max = Math.max(...data.map(x => x.avgrides));
  const min = Math.min(...data.map(x => x.avgrides));
  const scaleColor = scaleLinear().domain([min, max]).range([0, 1]);
  const dataSum = data.map(x => x.avgrides).reduce((sum, elem) => sum + elem);

  const leaves = data.map((leaf) => {
    return {
      name: `${leaf.station}: ${Math.round(10000 * (Math.round(leaf.avgrides) / dataSum)) / 100}%`,
      size: leaf.avgrides,
      color: scaleColor(leaf.avgrides),
      style: {
        border: 'thin solid white'
      }
    };
  });
  return {
    title: 'Station Treemap',
    color: 1,
    children: leaves
  };
}

function _indexToYear(index) {
  switch (index) {
  case 0:
    return 2001;
  case 1:
    return 2006;
  case 2:
    return 2011;
  case 3:
    return 2016;
  default:
    return undefined;
  }
}

export default class StopTree extends Component {
  constructor() {
    super();
    this.state = {
      dataIndex: 3,
      selectedValue: false
    };
  }

  render() {
    const {dataList} = this.props;
    const {dataIndex, selectedValue} = this.state;
    const formattedDataList = dataList.map(x => _formatData(x));

    return (
      <div className="dynamic-treemap-example" margin-left={1}>
        <h3>
        Relative Ridership By Station:&nbsp;{_indexToYear(dataIndex)} <br />
        </h3>
        Select Year:&nbsp;
          {['2001', '2006', '2011', '2016'].map(v => {
            return (<button
              key={v}
              onClick={() => this.setState({dataIndex: ['2001', '2006', '2011', '2016'].indexOf(v)})}
              >{v}</button>);
          })} <br /> <br />
        <Treemap
          height={500}
          width={1000}
          colorRange={['#FFD54F', '#BF360C']}
          mode={'resquarify'}
          animation={{damping: 50, stiffness: 500}}
          onLeafClick={() => this.setState({dataIndex: dataIndex < 3 ? (dataIndex + 1) : 0})}
          data={formattedDataList[dataIndex]}
          getLabel={x => x.name}
          onLeafMouseOver={(node) => this.setState({selectedValue: node})}
          onLeafMouseOut={() => this.setState({selectedValue: false})}
        />
      </div>
    );
  }
}
