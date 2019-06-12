import React from 'react';
import {csv, json} from 'd3-fetch';
import PhaseChart from './phase';
import BarChart from './bar';
import IncomeScatter from './income-scatterplot';
import MonthlyScatter from './monthly-scatterplot';
import MonthlyLegend from './monthly-legend';

const introP = `
The CTA Red Line, also known as the Howard-Dan Ryan Line, is the busiest line on the L system. It
had a total ridership of 73,606,207 in 2016, and spans over 20 miles, from Rogers Park in the North
Side to Roseland in the South Side. The Red Line also runs 24 hours a day, making it the most well-travelled
and available L line to take. What factors affect the ridership of the Red Line, and how has the ridership of
the Red Line changed over time?
`;

const bar1P = `
Consider the bar chart below, where the bars are arranged vertically in alphabetical order,
and the bars are color-coded by household median income — light yellow for high incomes, and dark blue
for low incomes:`;

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

const phaseP = `
So it seems that the geographic location may have something to do with why people choose to take the Red Line,
but what else could drive demand? Perhaps the day of the week or temperature? In this phase diagram, each slice of
the diagram represents total ridership on the Red Line for a single day. The length of the bar encodes that total
ridership, and the fill is a diverging colormap, with a darker blue meaning colder, and a darker red meaning warmer.
By filtering out the data points, you can view trends for similar data points (seeing all Monday riderships, weekends, etc.).
Generally, it seems like temperature is not a heavy factor for ridership (people still need to commute), but day of the week
is a stroner indicator of ridership. For example, we generally see that on the weekends, there are more people commuting
on Saturdays than on Sundays.
`;

const scatter1_1P = `
So let us consider a scatterplot instead, with median household income on the x-axis and average daily
ridership on the y-axis. Hover over the points to see the station name, the exact income, and the
exact ridership:
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
The blue points represent total monthly ridership, while the red line graph represents average annual
ridership. Hover over the points to see the time and the exact ridership:
`;

const scatter2_2P=`
We can see that ridership steadily increased from 2001 until 2013, where we saw a solid dip
because of station closures from construction. Ridership increased again from 2013 to 2016. However, since 2015,
ridership has been declining, which the CTA has blamed on several factors, including low gas prices, telecommuting, and the advent of
ride-sharing services such as Uber and Lyft.`;

const scatter2_3P=`
Toggle the view of the scatterplot to "Value-Mean", and view the scatterplot with ridership values
normalized relative to average annual ridership. Note the increased variance in monthly ridership
as the years go on. Which months tend to have higher ridership than the annual average, and
which months tend to have below-average ridership? Try highlighting the month of "October".`;

const treemapP = `
this is a paragraph about the treemap.
`;

const concP = `
There are a lot of factors that could affect ridership on the Red Line. We have found that generally, people will take
the Red Line because they need to go places. But income affects how many people may get on a stop, and special events may
also affect how many people take the train. The day of the week generally shows little variance, but there are usually
differences between the days of the week. [something about the treemap].
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
        <MonthlyLegend/>
        <div className = "text">{scatter2_2P}</div>
        <div className = "text">{scatter2_3P}</div><hr />
        <div className = "text">{phaseP}</div>
        <PhaseChart data={tempData}/>
        <div className = "text">{treemapP}</div>
        <div className = "text">{concP}</div>
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
