import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import PlusIcon from '../../../Assets/Images/plus.svg';
import TrashIcon from '../../../Assets/Images/trash.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

export default function Wedding() {
  const [date, setDate] = useState();
  const [visible, setVisible] = useState(false);
  return (
    <div className="wedding_wrap">
      <div className="bg_light_blue py15 px20 border radius15">
        <div className="table-responsive">
          <table className="Wedding_table table table-borderless m-0">
            <thead>
              <tr>
                <th>
                  <Button
                    className="btn_primary"
                    onClick={() => setVisible(true)}
                  >
                    <img src={PlusIcon} alt="PlusIcon" /> Create
                  </Button>
                </th>
                <th>
                  <div className="wedding_time">
                    <h4>03:30:00</h4>
                    <h6 className="m-0 text_gray">Final Output Hour</h6>
                  </div>
                </th>
                <th>
                  <div className="wedding_time">
                    <h4>08:30:00</h4>
                    <h6 className="m-0 text_gray">Total Raw Hour</h6>
                  </div>
                </th>
                <th>Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr className="orange_table_bg">
                <td>
                  <div className="function_time">
                    <h4>Haldi Event</h4>
                    <h6 className="mb-0 text_gray">Date : DD-MM-YYYY</h6>
                  </div>
                </td>
                <td>
                  <div className="function_time text-center">
                    <h4>00:00:00</h4>
                    <h6 className="mb-0 text_gray">Date : DD-MM-YYYY</h6>
                  </div>
                </td>
                <td>
                  <div className="function_time text-center">
                    <h4>00:00:00</h4>
                    <h6 className="mb-0 text_gray">Date : DD-MM-YYYY</h6>
                  </div>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button
                      className="btn_transparent"
                      onClick={() => setVisible(true)}
                    >
                      <img src={EditIcon} alt="EditIcon" />
                    </Button>
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <h4 className="fw_400 m-0">Camera 1</h4>
                </td>
                <td>
                  <h4 className="fw_400 m-0 text-center">0:00:00</h4>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <h4 className="fw_400 m-0">Camera 2</h4>
                </td>
                <td>
                  <h4 className="fw_400 m-0 text-center">02:00:00</h4>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <h4 className="fw_400 m-0">Camera 3</h4>
                </td>
                <td>
                  <h4 className="fw_400 m-0 text-center">03:00:00</h4>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <h4 className="fw_400 m-0">Camera 4</h4>
                </td>
                <td>
                  <h4 className="fw_400 m-0 text-center">02:30:00</h4>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr className="purpul_table_bg">
                <td>
                  <div className="function_time">
                    <h4>Garba Night Event</h4>
                    <h6 className="mb-0 text_gray">Date : DD-MM-YYYY</h6>
                  </div>
                </td>
                <td>
                  <div className="function_time text-center">
                    <h4>00:00:00</h4>
                    <h6 className="mb-0 text_gray">Date : DD-MM-YYYY</h6>
                  </div>
                </td>
                <td>
                  <div className="function_time text-center">
                    <h4>00:00:00</h4>
                    <h6 className="mb-0 text_gray">Date : DD-MM-YYYY</h6>
                  </div>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button
                      className="btn_transparent"
                      onClick={() => setVisible(true)}
                    >
                      <img src={EditIcon} alt="EditIcon" />
                    </Button>
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <h4 className="fw_400 m-0">Camera 1</h4>
                </td>
                <td>
                  <h4 className="fw_400 m-0 text-center">0:00:00</h4>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <h4 className="fw_400 m-0">Camera 2</h4>
                </td>
                <td>
                  <h4 className="fw_400 m-0 text-center">0:00:00</h4>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr className="blue_table_bg">
                <td>
                  <div className="function_time">
                    <h4>Garba Night Event</h4>
                    <h6 className="mb-0 text_gray">Date : DD-MM-YYYY</h6>
                  </div>
                </td>
                <td>
                  <div className="function_time text-center">
                    <h4>00:00:00</h4>
                    <h6 className="mb-0 text_gray">Date : DD-MM-YYYY</h6>
                  </div>
                </td>
                <td>
                  <div className="function_time text-center">
                    <h4>00:00:00</h4>
                    <h6 className="mb-0 text_gray">Date : DD-MM-YYYY</h6>
                  </div>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button
                      className="btn_transparent"
                      onClick={() => setVisible(true)}
                    >
                      <img src={EditIcon} alt="EditIcon" />
                    </Button>
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <h4 className="fw_400 m-0">Camera 1</h4>
                </td>
                <td>
                  <h4 className="fw_400 m-0 text-center">0:00:00</h4>
                </td>
                <td>
                  <div className="delete_btn_wrap mt-0">
                    <Button className="btn_transparent">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Create popup */}
      <Dialog
        header="Create Workflow"
        className="modal_Wrapper modal_medium"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
      >
        <Row>
          <Col md={6}>
            <div className="form_group mb-3">
              <label>Event Name</label>
              <InputText
                placeholder="Write a Event name"
                className="input_wrap"
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="form_group mb-3">
              <label>Create Date</label>
              <div className="date_select text-end">
                <Calendar
                  value={date}
                  placeholder="30/06/2023"
                  onChange={e => setDate(e.value)}
                  showIcon
                />
              </div>
            </div>
          </Col>
        </Row>
        <div className="mt20 mb20">
          <h3 className="mb20">Raw Time</h3>
          <Row>
            <Col md={6}>
              <ul className="d-flex gap-2">
                <li>
                  <div className="form_group mb-3">
                    <label>Raw Time 1</label>
                    <InputText
                      placeholder="Write name"
                      className="input_wrap"
                    />
                  </div>
                </li>
                <li>
                  <div className="form_group mb-3">
                    <Button className="btn_transparent btn_right add_btn">
                      ADD
                      <img src={PlusIcon} alt="PlusIcon" />
                    </Button>
                    <InputText
                      placeholder="HH : MM : SS"
                      className="input_wrap"
                    />
                  </div>
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="d-flex gap-2">
                <li>
                  <div className="form_group mb-3">
                    <label>Raw Time 2</label>
                    <InputText
                      placeholder="Write name"
                      className="input_wrap"
                    />
                  </div>
                </li>
                <li>
                  <div className="form_group mb-3">
                    <Button className="btn_transparent add_btn">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                    <InputText
                      placeholder="HH : MM : SS"
                      className="input_wrap"
                    />
                  </div>
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="d-flex gap-2">
                <li>
                  <div className="form_group mb-3">
                    <label>Raw Time 3</label>
                    <InputText
                      placeholder="Write name"
                      className="input_wrap"
                    />
                  </div>
                </li>
                <li>
                  <div className="form_group mb-3">
                    <Button className="btn_transparent add_btn">
                      <img src={TrashIcon} alt="TrashIcon" />
                    </Button>
                    <InputText
                      placeholder="HH : MM : SS"
                      className="input_wrap"
                    />
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <Row className="align-items-end">
          <Col md={6}>
            <ul className="d-flex gap-3">
              <li>
                <div className="form_group">
                  <label>Total Raw Hours</label>
                  <InputText
                    placeholder="HH : MM : SS "
                    className="input_wrap"
                  />
                </div>
              </li>
              <li>
                <div className="form_group">
                  <label>Final Output Hours</label>
                  <InputText
                    placeholder="HH : MM : SS"
                    className="input_wrap"
                  />
                </div>
              </li>
            </ul>
          </Col>
          <Col lg={6}>
            <div className="delete_btn_wrap mt-md-0 mt-3">
              <button
                className="btn_border_dark"
                onClick={() => setVisible(false)}
              >
                Cancel
              </button>
              <button className="btn_primary" onClick={() => setVisible(false)}>
                Save Flow
              </button>
            </div>
          </Col>
        </Row>
      </Dialog>
    </div>
  );
}
