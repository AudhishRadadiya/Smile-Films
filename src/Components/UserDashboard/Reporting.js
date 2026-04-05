import React, { useState } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { Button, Col, Row } from 'react-bootstrap';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import InfoIcon from '../../Assets/Images/info.svg';
import CheckIcon from '../../Assets/Images/check-green.svg';
import EditIcon from '../../Assets/Images/edit.svg';
import PlusIcon from '../../Assets/Images/plus.svg';
import ReactSelectSingle from '../Common/ReactSelectSingle';

export default function Reporting() {
  const [show, setShow] = useState(false);
  const [orderSelect, setOrderSelect] = useState([]);
  const [companySelect, setCompanySelect] = useState([]);
  const [coupleSelect, setCoupleSelect] = useState([]);
  const [eventSelect, setEventSelect] = useState([]);
  const [itemSelect, setItemSelect] = useState([]);
  const [date, setDate] = useState();
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

  const stateOrderChange = e => {
    setOrderSelect(e.value);
  };
  const stateCompanyChange = e => {
    setCompanySelect(e.value);
  };
  const stateCoupleChange = e => {
    setCoupleSelect(e.value);
  };
  const stateEventChange = e => {
    setEventSelect(e.value);
  };
  const stateItemChange = e => {
    setItemSelect(e.value);
  };

  const Order = [
    { label: '#564892', value: '#564892' },
    { label: '#564892', value: '#564892' },
    { label: '#564892', value: '#564892' },
  ];
  const Company = [
    { label: 'ABC Company', value: 'abc company' },
    { label: 'BCD Company', value: 'bcd company' },
    { label: 'DEF Company', value: 'def company' },
  ];
  const Couple = [
    { label: 'Kapil & Manshi', value: 'kapil & manshi' },
    { label: 'Manish & Manisha', value: 'manish & manisha' },
    { label: 'Keval & Kajal', value: 'keval & kajal' },
  ];
  const Event = [
    { label: 'ABC Event', value: 'abc event' },
    { label: 'BCD Event', value: 'bcd event' },
    { label: 'DEF Event', value: 'def event' },
  ];
  const Item = [
    { label: 'ABC Event', value: 'abc event' },
    { label: 'BCD Event', value: 'bcd event' },
    { label: 'DEF Event', value: 'def event' },
  ];

  const justifyTemplate = option => {
    return <span>{option.value}</span>;
  };

  return (
    <div className="main_Wrapper">
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="page_title">
                <h3 className="m-0">Reporting</h3>
              </div>
            </Col>
            <Col md={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li>
                    <div className="calender_filter_Wrap d-flex align-items-center justify-content-end">
                      <SelectButton
                        value={value}
                        onChange={e => setValue(e.value)}
                        itemTemplate={justifyTemplate}
                        optionLabel="value"
                        options={justifyOptions}
                      />
                    </div>
                  </li>
                  <li>
                    <Button
                      className="btn_primary"
                      onClick={() => setShow(true)}
                    >
                      <img src={PlusIcon} alt="PlusIcon" />
                      Add Reporting
                    </Button>
                  </li>
                </ul>
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

      {/* Add Reporting popup */}
      <Dialog
        header="Add Reporting"
        className="modal_medium modal_Wrapper"
        visible={show}
        onHide={() => setShow(false)}
        draggable={false}
      >
        <div className="delete_popup_wrapper">
          <Row>
            <Col md={6}>
              <div className="form_group mb-3">
                <label>Creat Date</label>
                <div className="date_select">
                  <Calendar
                    value={date}
                    placeholder="27/08/2023"
                    onChange={e => setDate(e.value)}
                    showIcon
                  />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div class="form_group mb-3">
                <label>Order No</label>
                <ReactSelectSingle
                  filter
                  value={orderSelect}
                  options={Order}
                  onChange={e => {
                    stateOrderChange(e);
                  }}
                  placeholder="Select Company"
                />
              </div>
            </Col>
            <Col md={6}>
              <div class="form_group mb-3">
                <label>Company Name</label>
                <ReactSelectSingle
                  filter
                  value={companySelect}
                  options={Company}
                  onChange={e => {
                    stateCompanyChange(e);
                  }}
                  placeholder="Company Names"
                />
              </div>
            </Col>
            <Col md={6}>
              <div class="form_group mb-3">
                <label>Couple Name</label>
                <ReactSelectSingle
                  filter
                  value={coupleSelect}
                  options={Couple}
                  onChange={e => {
                    stateCoupleChange(e);
                  }}
                  placeholder="Couple Names"
                />
              </div>
            </Col>
            <Col md={6}>
              <div class="form_group mb-3">
                <label>Event Name</label>
                <ReactSelectSingle
                  filter
                  value={eventSelect}
                  options={Event}
                  onChange={e => {
                    stateEventChange(e);
                  }}
                  placeholder="Event Names"
                />
              </div>
            </Col>
            <Col md={6}>
              <div class="form_group mb-3">
                <label>Item Names</label>
                <ReactSelectSingle
                  filter
                  value={itemSelect}
                  options={Item}
                  onChange={e => {
                    stateItemChange(e);
                  }}
                  placeholder="Item Names"
                />
              </div>
            </Col>
            <Col md={6}>
              <div class="form_group mb-3">
                <label>Working Hour</label>
                <input
                  placeholder="HH:MM:SS"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
            <Col sm={12}>
              <div class="amount-condition-wrapper border radius15">
                <div class="p20 p10-md border-bottom">
                  <h5 class="m-0">Work Describe</h5>
                </div>
                <div class="condition-content">
                  <InputTextarea
                    placeholder="Write here"
                    id="Remark"
                    className="border-0"
                    rows={6}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <div className="delete_btn_wrap mt-3 p-0">
            <Button className="btn_primary">Save</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
