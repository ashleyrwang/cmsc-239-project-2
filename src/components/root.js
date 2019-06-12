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
Consider the bar chart below, where the bars are arranged vertically in geographical order (north to south),
and the bars are color-coded by household median income — light yellow for high median incomes, and dark blue
for low median incomes:`;

const bar2P = `
The first way we visualized data was through a bar chart. By cycling through the different buttons below, you
can resort the bar chart to see different relationships between ridership and various variables.
In the middle of the line (Loop area up to Wrigley
Field), we saw relatively high income and high ridership compared to the rest of the line.
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

const scatter1P = `
The first scatterplot shows the relationship between median household income and average daily ridership. Each data
point is a station. Although this data was already discussed in the first bar chart, this scatterplot allows for greater
clarity about the exact relationship between income and ridership. Each data point, on mouseover, shows the stop name,
income, and ridership. The buttons on the bottom allow you to add a trendline to the data, fitting the data in various
ways and then showing the equation below. In statistics, an R-squared value that is closer to 1 means it fits the line better,
thus meaning the line is more accurate to the data. From this, we found that a quadratic line was the best fit, meaning
that as income increases, ridership increases slightly less.
`;

const scatter2P = `
The second scatterplot further explores the relationship between time and ridership. The scatterplot shows total line
ridership from 2001 to 2018. Each blue point on the scatterplot shows the date and ridership. The red points show the
average ridership of the year. From this view, we can see that ridership steadily increased from 2001 until 2013, where
we saw a solid dip in data because of line closures from construction. Since 2015, ridership has been declining. Although
we are unsure of the exact reason why, it could be due to rideshare services like Uber and Lyft expanding. In 2014, both
Uber and Lyft increased funding (Series E funding) and continued their expansion throughout the US and internationally.
In the second view, we show ridership values that are normalized (the mean is substracted from the value). From this view,
we see that there is greater variance as the years go on, which could probably also speak to the general trend of ridership
decreasing past 2015.
`;

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
        <div className = "text">{bar2P}</div> <hr />
        <div className = "text">{scatter1P}</div>
        <IncomeScatter data={generalData}/>
        <div className = "text">{phaseP}</div>
        <PhaseChart data={tempData}/>
        <div className = "text">{scatter2P}</div>
        <MonthlyScatter data={{annData: annualData, monData: monthlyData}}/>
        <MonthlyLegend/>
        <div className = "text">{treemapP}</div>
        <div className = "text">{concP}</div>
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
