import React from 'react';
import { InputText } from 'primereact/inputtext';
import ExportIcon from '../../Assets/Images/export.svg';
import { Accordion, AccordionTab } from 'primereact/accordion';
import CommonCalender from './CommonCalender';
import { Col, Dropdown, Row } from 'react-bootstrap';

export default function EditingCalendar() {
  return (
    <div className="table_main_Wrapper bg-white">
      <div className="top_filter_wrap">
        <Row className="align-items-center">
          <Col md={3}>
            <div className="page_title">
              <h3 class="m-0">Editing Calendar</h3>
            </div>
          </Col>
          <Col md={9}>
            <div className="right_filter_wrapper">
              <ul>
                <li>
                  <li class="search_input_wrap">
                    <div class="form_group">
                      <InputText
                        placeholder="Search"
                        className="input_wrap search_wrap"
                      />
                    </div>
                  </li>
                </li>
                <li>
                  <Dropdown className="dropdown_common export_dropdown position-static">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="btn_border icon_btn"
                    >
                      <img src={ExportIcon} alt="" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item>PDF</Dropdown.Item>
                      <Dropdown.Item>XLS</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
      <div className="calender_view_Wrapper">
        <div className="calender_filter_Wrap">
          <Accordion activeIndex={0}>
            <AccordionTab header="All Events">
              <ul>
                <li>Event 1</li>
                <li>Event 2</li>
                <li>Event 3</li>
                <li>Event 4</li>
                <li>Event 5</li>
                <li>Event 6</li>
                <li>Event 7</li>
                <li>Event 8</li>
                <li>Event 9</li>
                <li>Event 10</li>
                <li>Event 11</li>
                <li>Event 12</li>
                <li>Event 13</li>
                <li>Event 14</li>
                <li>Event 15</li>
              </ul>
            </AccordionTab>
            <AccordionTab header="All Employees ">
              <ul>
                <li>Employee 1</li>
                <li>Employee 2</li>
                <li>Employee 3</li>
                <li>Employee 4</li>
                <li>Employee 5</li>
                <li>Employee 6</li>
                <li>Employee 7</li>
                <li>Employee 8</li>
                <li>Employee 9</li>
                <li>Employee 10</li>
                <li>Employee 11</li>
                <li>Employee 12</li>
                <li>Employee 13</li>
                <li>Employee 14</li>
                <li>Employee 15</li>
              </ul>
            </AccordionTab>
          </Accordion>
        </div>
        <div className="calender_main_wrap">
          <CommonCalender />
        </div>
      </div>
    </div>
  );
}
