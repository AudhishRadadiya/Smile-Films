import { Button, Col, Row } from 'react-bootstrap';
import { SelectButton } from 'primereact/selectbutton';
import { useState } from 'react';
import InfoIcon from '../../../Assets/Images/info.svg';
import CheckIcon from '../../../Assets/Images/check-green.svg';
import EditIcon from '../../../Assets/Images/edit.svg';

export default function UserReporting() {
  const [value, setValue] = useState('30 DAYS');
  const justifyOptions = [
    { value: '30 DAYS' },
    { value: 'JUN' },
    { value: 'May' },
    { value: 'APR' },
    { value: 'MAR' },
    { value: 'FEB' },
    { value: 'JAN' },
  ];

  const justifyTemplate = option => {
    return <span>{option.value}</span>;
  };

  return (
    <div className="main_Wrapper">
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Kapil</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper calender_filter_Wrap d-flex align-items-center justify-content-md-end">
                <SelectButton
                  value={value}
                  onChange={e => setValue(e.value)}
                  itemTemplate={justifyTemplate}
                  optionLabel="value"
                  options={justifyOptions}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="data_table_wrapper reporting_table_wrapper">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Date </span>
                  </th>
                  <th>
                    <span>Order No.</span>
                  </th>
                  <th>
                    <span>Company Name</span>
                  </th>
                  <th>
                    <span>Couple Name</span>
                  </th>
                  <th>
                    <span>Item Names</span>
                  </th>
                  <th>
                    <span>Work Describe</span>
                  </th>
                  <th>
                    <span>Working Hour</span>
                  </th>
                  <th>
                    <span>Created Date & time</span>
                  </th>
                  <th>
                    <span>Status</span>
                  </th>
                  <th>
                    <span>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jul 08, Wed</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>HH:MM:SS</td>
                  <td>-</td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={InfoIcon} alt="" />
                    </Button>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td rowSpan={2}>Jul 07, Tue</td>
                  <td>#56123</td>
                  <td>ABC Company</td>
                  <td>Kapil & Krupa</td>
                  <td>Wedding</td>
                  <td>
                    <p className="wrap_content_xl">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the
                    </p>
                  </td>
                  <td>05:30:00</td>
                  <td>08/05/2006 | 03:05:15 PM</td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={CheckIcon} alt="" />
                    </Button>
                  </td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={EditIcon} alt="" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>#56123</td>
                  <td>ABC Company</td>
                  <td>Kapil & Krupa</td>
                  <td>Wedding</td>
                  <td>
                    <p className="wrap_content_xl">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the
                    </p>
                  </td>
                  <td>05:30:00</td>
                  <td>08/05/2006 | 03:05:15 PM</td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={CheckIcon} alt="" />
                    </Button>
                  </td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={EditIcon} alt="" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>Jul 06, Mon</td>
                  <td>#56123</td>
                  <td>ABC Company</td>
                  <td>Kapil & Krupa</td>
                  <td>Wedding</td>
                  <td>
                    <p className="wrap_content_xl">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the
                    </p>
                  </td>
                  <td>05:30:00</td>
                  <td>08/05/2006 | 03:05:15 PM</td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={CheckIcon} alt="" />
                    </Button>
                  </td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={EditIcon} alt="" />
                    </Button>
                  </td>
                </tr>
                <tr className="weekly_off">
                  <td>Jul 05, Sun</td>
                  <td colSpan={9}>Full day weekly-off</td>
                </tr>
                <tr className="weekly_off">
                  <td>Jul 04, Sat</td>
                  <td colSpan={9}>Full day weekly-off</td>
                </tr>
                <tr>
                  <td>Jul 03, Fri</td>
                  <td>#56123</td>
                  <td>ABC Company</td>
                  <td>Kapil & Krupa</td>
                  <td>Wedding</td>
                  <td>
                    <p className="wrap_content_xl">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the
                    </p>
                  </td>
                  <td>05:30:00</td>
                  <td>08/05/2006 | 03:05:15 PM</td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={CheckIcon} alt="" />
                    </Button>
                  </td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={EditIcon} alt="" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>Jul 02, Thu</td>
                  <td>#56123</td>
                  <td>ABC Company</td>
                  <td>Kapil & Krupa</td>
                  <td>Wedding</td>
                  <td>
                    <p className="wrap_content_xl">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the
                    </p>
                  </td>
                  <td>05:30:00</td>
                  <td>08/05/2006 | 03:05:15 PM</td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={CheckIcon} alt="" />
                    </Button>
                  </td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={EditIcon} alt="" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>Jul 01, Wed</td>
                  <td>#56123</td>
                  <td>ABC Company</td>
                  <td>Kapil & Krupa</td>
                  <td>Wedding</td>
                  <td>
                    <p className="wrap_content_xl">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the
                    </p>
                  </td>
                  <td>05:30:00</td>
                  <td>08/05/2006 | 03:05:15 PM</td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={CheckIcon} alt="" />
                    </Button>
                  </td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={EditIcon} alt="" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>June 30, Tue</td>
                  <td>#56123</td>
                  <td>ABC Company</td>
                  <td>Kapil & Krupa</td>
                  <td>Wedding</td>
                  <td>
                    <p className="wrap_content_xl">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the
                    </p>
                  </td>
                  <td>05:30:00</td>
                  <td>08/05/2006 | 03:05:15 PM</td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={CheckIcon} alt="" />
                    </Button>
                  </td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={EditIcon} alt="" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>June 29, Mon</td>
                  <td>#56123</td>
                  <td>ABC Company</td>
                  <td>Kapil & Krupa</td>
                  <td>Wedding</td>
                  <td>
                    <p className="wrap_content_xl">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the
                    </p>
                  </td>
                  <td>05:30:00</td>
                  <td>08/05/2006 | 03:05:15 PM</td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={CheckIcon} alt="" />
                    </Button>
                  </td>
                  <td>
                    <Button className="btn_transparent">
                      <img src={EditIcon} alt="" />
                    </Button>
                  </td>
                </tr>
                <tr className="weekly_off">
                  <td>June 28, Sun</td>
                  <td colSpan={9}>Full day weekly-off</td>
                </tr>
                <tr className="weekly_off">
                  <td>June 27, Sat</td>
                  <td colSpan={9}>Full day weekly-off</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
