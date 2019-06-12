import React from 'react';
import {csv, json} from 'd3-fetch';
import PhaseChart from './phase';
import BarChart from './bar';
import IncomeScatter from './income-scatterplot';
import MonthlyScatter from './monthly-scatterplot';
import MonthlyLegend from './monthly-legend';

const longBlock = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

class RootComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      generalData: null,
      monthlyData: null,
      annualData: null,
      tempData: null,
      loading: true
    };
  }

  componentWillMount() {
    Promise.all([json('data/cta_data_avg.json'),
      json('data/cta_monthly_totals.json'), json('data/cta_annual_totals.json'),
      json('data/data.json')])
      .then(dataList => {
        this.setState({
          generalData: dataList[0],
          monthlyData: dataList[1],
          annualData: dataList[2],
          tempData: dataList[3],
          loading: false
        });
      });
  }

  render() {
    const {loading, generalData, monthlyData, annualData, tempData} = this.state;
    if (loading) {
      return <h1>LOADING</h1>;
    }
    return (
      <div className="react">
        <div className = "title">
        From Howard to 95th/Dan Ryan: <br />
        Ridership and Income Along the CTA'S Red Line
        </div>
        <p>— by Christina Ford, Connor Hopcraft, and Ashley Wang</p>
        <div>{`The example data was loaded! There are ${generalData.length} rows`}</div>
        <BarChart data={generalData}/>
        <div className = "text">{longBlock}</div>
        <PhaseChart data={tempData}/>
        <div className = "text">{longBlock}</div>
        <IncomeScatter data={generalData}/>
        <div className = "text">{longBlock}</div>
        <MonthlyScatter data={{annData: annualData, monData: monthlyData}}/>
        <MonthlyLegend/>

        <div className = "text">{longBlock}</div>
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
