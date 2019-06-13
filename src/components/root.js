import React from 'react';
import {csv, json} from 'd3-fetch';
import PhaseChart from './phase';
import BarChart from './bar';
import IncomeScatter from './income-scatterplot';
import MonthlyScatter from './monthly-scatterplot';
import MonthlyLegend from './monthly-legend';
import StopTree from './stopTreemap';


const introP = `
The CTA Red Line, also known as the Howard-Dan Ryan Line, is the busiest line on the L system. It
had a total ridership of 73,606,207 in 2016, and spans over 20 miles, from Rogers Park in the North
Side to Roseland in the South Side. The Red Line also runs 24 hours a day, making it the most well-travelled
and available L line in Chicago. What factors affect the ridership of the Red Line, and how has the 
ridership of the Red Line changed over time?
`;

const bar1P = `
Consider the bar chart below, where the bars are arranged vertically in alphabetical order.  
Each bar is color-coded by the household median income of the surrounding zipcode. 
Light yellow represents high incomes, and dark blue represents low incomes:`;

const bar2P = `
Sorting the bar graph geographically, we can see that based on ridership and income, the Red Line stations
can be separated into 3 subsets: Howard to Wilson (North Side), Sheridan to Roosevelt
(Central), and Cermak-Chinatown to 95th/Dan Ryan (South Side). The North Side stations have low ridership
and moderate income, the Central stations have moderate-to-high ridership and high income,
and the South Side stations have low-to-moderate ridership and low income. Note also
that the terminuses of the Red Line (i.e., Howard and 95th/Dan Ryan) have higher ridership than
the stations adjacent to them.
`;

const bar3P = `
Sorting the bar graph by ridership or by income suggests that there may be a relationship
between income and ridership, but the relationship is difficult to discern.
`;

const phase1P = `
Now, let's look at the relationship between time and ridership on a smaller scale. This is a phase diagram,
where each slice of the diagram represents total ridership on the Red Line for a single day. The slices
are color-coded by temperature: dark red for warm days, dark blue for cold days (freezing point is white).
`;

const phase2P = `
Filter the data by the days of the week. What do you see? Notice that Sundays tend to have lower ridership
than Saturdays, which in turn have lower ridership than weekdays.`;

const scatter1_1P = `
So let us consider a scatterplot instead, with median household income on the x-axis and average daily
ridership on the y-axis. Each point represents a Red Line station. Hover over the points to see the station 
name, the exact income, and the exact ridership:
`;

const scatter1_2P = `
Which trendline describes the data most accurately? This is a difficult question to answer. In statistics, the R-squared
value measures how close the data is to the trendline. Notice that the R-squared values for the
linear, exponential, and quadratic trendlines are all within 0.02 of each other. However, the
important takeaway is that no matter the type of trendline, they all have a positive slope, meaning
that the relationship between income and ridership is positive — i.e., as income increases, so does
ridership.
`;

const scatter2_1P = `
Let us consider another scatterplot, with time (from 2001 to 2018) on the x-axis and ridership on the y-axis.
The blue points represent total monthly ridership, while the red line graph shows average monthly ridership
for each year. Hover over the points to see the time and the exact ridership:
`;

const scatter2_2P=`
We can see that ridership steadily increased from 2001 until 2013, where we see a solid dip
due to station closures from construction. Ridership increased again from 2013 to 2016. However, since 2015,
ridership has been declining, which the CTA has blamed on several factors, including low gas prices, 
telecommuting, and the advent of ride-sharing services such as Uber and Lyft.`;

const scatter2_3P=`
Toggle the view of the scatterplot to "Value-Mean", and view the scatterplot with ridership values
normalized relative to average annual ridership. Note the increased variance in monthly ridership
as the years go on. Which months tend to have higher ridership than the annual average, and
which months tend to have below-average ridership? Try highlighting the month of "October".`;

const treemap1P = `
Continuing with our examination of the relationship between time and ridership,
consider this treemap of relative ridership at the Red Line stations over four years: 2001, 2006,
2011, and 2016:
`;

const treemap2P = `
Try selecting different years to see how relative ridership at each station has changed over the
course of 15 years. Notably, the relative ridership at 95th/Dan Ryan has increased from
4.71% in 2001 to 7.12% in 2016.
`;

const concP = `
Ridership on the Red Line is a phenomenon that can be influenced by many variables. In this article, we have
looked at the effect that geographical location, income, time, day of week, and temperature have on
ridership. The geographical location of a station impacts how many people board the Red Line at the station.
The median income may not only indicate how affordable the Red Line is for residents near a particular station,
but it may also indicate how popular the station is as an origin and a destination for visitors.
Red Line ridership has also changed
over the years, with particular events such as the 2013 Reconstruction Project having a significant impact.
Furthermore, within each day of the week, there is little variance in ridership; yet, there are significant differences across
days of the week. [something about the treemap].
`;

class RootComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      generalData: null,
      monthlyData: null,
      annualData: null,
      tempData: null,
      general16: null,
      general11: null,
      general06: null,
      general01: null,
      loading: true
    };
  }

  componentWillMount() {
    Promise.all([json('data/cta_data_avg.json'),
      json('data/cta_monthly_totals.json'), json('data/cta_annual_totals.json'),
      json('data/data.json'), json('data/cta_data_avg16.json'), json('data/cta_data_avg11.json'),
      json('data/cta_data_avg06.json'), json('data/cta_data_avg01.json')])
      .then(dataList => {
        this.setState({
          generalData: dataList[0],
          monthlyData: dataList[1],
          annualData: dataList[2],
          tempData: dataList[3],
          general16: dataList[4],
          general11: dataList[5],
          general06: dataList[6],
          general01: dataList[7],
          loading: false
        });
      });
  }

  render() {
    const {loading, generalData, monthlyData, annualData, tempData,
      general16, general11, general06, general01} = this.state;
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
        <div className = "text">{introP}</div> <hr />
        <div className = "text">{bar1P}</div>
        <BarChart data={generalData}/>
        <div className = "text">{bar2P}</div>
        <div className = "text">{bar3P}</div><hr />
        <div className = "text">{scatter1_1P}</div>
        <IncomeScatter data={generalData}/>
        <div className = "text">{scatter1_2P}</div><hr />
        <div className = "text">{scatter2_1P}</div>
        <MonthlyScatter data={{annData: annualData, monData: monthlyData}}/>
        <div className = "text">{scatter2_2P}</div>
        <div className = "text">{scatter2_3P}</div><hr />
        <div className = "text">{treemap1P}</div>
        <StopTree dataList={[general01, general06, general11, general16]}/>
        <div className = "text">{treemap2P}</div> <hr />
        <div className = "text">{phase1P}</div>
        <PhaseChart data={tempData}/>
        <div className = "text">{phase2P}</div><hr />
        <div className = "text">{concP}</div>
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
