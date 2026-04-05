import { React } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import solidGauge from 'highcharts/modules/solid-gauge.js';
import highchartsMore from 'highcharts/highcharts-more.js';

export const projectsData = [
  {
    order_no: '#56123',
    couple_name: 'Jasmin & Ryan',
    create_date: '01/06/2023',
    due_date: '10/06/2023',
  },
  {
    order_no: '#23597',
    couple_name: 'Sophia & Ethan',
    create_date: '05/06/2023',
    due_date: '10/06/2023',
  },
  {
    order_no: '#56123',
    couple_name: 'Olivia & Liam',
    create_date: '01/06/2023',
    due_date: '10/06/2023',
  },
  {
    order_no: '#56123',
    couple_name: 'James & Lia',
    create_date: '01/06/2023',
    due_date: '10/06/2023',
  },
];

export default function ProjectOne() {
  highchartsMore(Highcharts);
  solidGauge(Highcharts);

  const circleOptions = {
    chart: {
      type: 'solidgauge',
      height: '110%',
    },

    title: {
      text: '%',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '20px',
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      borderWidth: 0,
      backgroundColor: 'none',
      shadow: false,
      style: {
        fontSize: '0',
      },
      valueSuffix: 'Days',
      positioner: function (labelWidth) {
        return {
          x: (this.chart.chartWidth - labelWidth) / 2,
          y: this.chart.plotHeight / 2 + 15,
        };
      },
    },

    pane: {
      startAngle: 0,
      endAngle: 360,
      background: [
        {
          // Track for Move
          outerRadius: '110%',
          innerRadius: '70%',
          backgroundColor: '#D6DFF4',
          borderWidth: 0,
        },
      ],
    },

    yAxis: {
      min: 0,
      max: 110,
      lineWidth: 0,
      tickPositions: [],
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
        linecap: 'round',
        stickyTracking: false,
        rounded: true,
      },
    },

    series: [
      {
        name: 'Leave',
        data: [
          {
            color: '#B7ABFF',
            radius: '110%',
            innerRadius: '70%',
            y: 80,
          },
        ],
      },
    ],
  };

  return (
    <>
      <div className="project_list_wrap mb20 bg-white p15 radius15 border">
        <div className="project_left_wrap">
          <h4 className="mb20">#56897</h4>
          <div className="project_box_wrap">
            <div className="project_box">
              <ul>
                <li>
                  <label>Company Name :</label>
                  <span>ABC Enterprise</span>
                </li>
                <li>
                  <label>Couple Name :</label>
                  <span>Kapil & Krupa</span>
                </li>
                <li>
                  <label>Project Type :</label>
                  <span>A</span>
                </li>
              </ul>
            </div>
            <div className="project_box border-0">
              <ul>
                <li>
                  <label>Data Size :</label>
                  <span>280 GB</span>
                </li>
                <li>
                  <label>Due Date :</label>
                  <span>16/07/2023</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="project_right_wrap">
          <div className="chart_left_wrap">
            <div className="project_box border-0 w-100">
              <h4 className="mb20">Assignee Items</h4>
              <ul>
                <li>
                  <label>Wedding Package Reel</label>
                  <div className="taser_status">
                    <span className="p-tag p-component p-tag-success">
                      In Review
                    </span>
                  </div>
                </li>
                <li>
                  <label>Teaser</label>
                  <div className="taser_status">
                    <span className="p-tag p-component p-tag-warning">
                      Progress
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="chart_right_wrap">
            <div className="chart_box d-flex align-items-center justify-content-between">
              <div className="circle_chart_wrap">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={circleOptions}
                />
              </div>
              <div className="circle_chart_content">
                <div className="taser_status percentage_status">
                  <span className="status_dot"></span>
                  <span>80% Work Done</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
