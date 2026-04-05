import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more.js';
import Highcharts from 'highcharts/highstock';
import solidGauge from 'highcharts/modules/solid-gauge.js';
import { Tag } from 'primereact/tag';
import { memo, useMemo } from 'react';

highchartsMore(Highcharts);
solidGauge(Highcharts);

const getSeverityValue = item => {
  switch (item) {
    case 1:
      return 'Intial';
    case 2:
      return 'Library Done';
    case 3:
      return 'In Progress';
    case 4:
      return 'In Checking';
    case 5:
      return 'Exporting';
    case 6:
      return 'Completed';
    default:
      return null;
  }
};

const getSeverity = product => {
  switch (product) {
    case 1:
      return 'info';
    case 2:
      return 'orange';
    case 3:
      return 'warning';
    case 4:
      return 'danger';
    case 5:
      return 'primary';
    case 6:
      return 'success';

    default:
      return null;
  }
};

const OngoingProject = ({ projectData }) => {
  const ongoingProjectRatio = useMemo(() => {
    const options = {
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
        max: 100,
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
              y: projectData?.work_done,
            },
          ],
        },
      ],
    };

    return options;
  }, [projectData]);

  return (
    <>
      <div className="project_list_wrap mb20 bg-white p15 radius15 border">
        <div className="project_left_wrap">
          <h4 className="mb20">{projectData?.inquiry_no}</h4>
          <div className="project_box_wrap">
            <div className="project_box">
              <ul>
                <li>
                  <label>Company Name :</label>
                  <span>{projectData?.company_name}</span>
                </li>
                <li>
                  <label>Couple Name :</label>
                  <span>{projectData?.couple_name}</span>
                </li>
                <li>
                  <label>Project Type :</label>
                  <span>{projectData?.project_type}</span>
                </li>
              </ul>
            </div>
            <div className="project_box border-0">
              <ul>
                <li>
                  <label>Data Size :</label>
                  <span>{projectData?.data_size} GB</span>
                </li>
                <li>
                  <label>Due Date :</label>
                  <span>{projectData?.due_date}</span>
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
                {projectData?.itemStatusInfo?.map((item, i) => {
                  return (
                    <li key={i}>
                      <label>{item?.item_name ? item?.item_name : ''}</label>

                      <div className="taser_status">
                        <Tag
                          value={getSeverityValue(item?.status)}
                          severity={getSeverity(item?.status)}
                        ></Tag>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="chart_right_wrap">
            <div className="chart_box d-flex align-items-center justify-content-between">
              <div className="circle_chart_wrap">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={ongoingProjectRatio}
                />
              </div>
              <div className="circle_chart_content">
                <div className="taser_status percentage_status">
                  <span className="status_dot"></span>
                  <span>
                    {projectData?.work_done ? projectData?.work_done : 0}% Work
                    Done
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(OngoingProject);
