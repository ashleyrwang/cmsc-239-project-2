import React, {Component} from 'react';

import {
  DiscreteColorLegend
} from 'react-vis';

export default class MonthlyLegend extends Component {
  constructor() {
    super();
    this.state = {
      value: false
    };
  }

  render() {
    return (
      <DiscreteColorLegend
        orientation={'horizontal'}
        items={[{title: 'Monthly', color: '#1A5276'}, {title: 'Annual', color: '#C0392B'}]}
        height={70}
      />
    );
  }
}
