import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import EmailIcon from '../../../Assets/Images/email-icon.svg';
import ShowIcon from '../../../Assets/Images/show-icon.svg';
import PlusIcon from '../../../Assets/Images/plus.svg';
import ProfileImg from '../../../Assets/Images/profile-img.svg';
import CloseImg from '../../../Assets/Images/close.svg';
import EditImg from '../../../Assets/Images/edit.svg';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';

export const inquiryData = [
  {
    sr_no: '1',
    qty: '30',
    rate: '₹ 1,000',
    tax: '₹ 150',
    amount: '₹ 33,000',
  },
  {
    sr_no: '2',
    qty: '30',
    rate: '₹ 1,000',
    tax: '₹ 150',
    amount: '₹ 33,000',
  },
  {
    sr_no: '3',
    qty: '30',
    rate: '₹ 1,000',
    tax: '₹ 150',
    amount: '₹ 33,000',
  },
];

export const DistributesData = [
  {
    item_name: 'Wedding',
    percentage: '30%',
    amount: '₹ 33,000',
  },
  {
    item_name: 'Pre-Wedding',
    percentage: '30%',
    amount: '₹ 33,000',
  },
  {
    item_name: 'Teaser',
    percentage: '30%',
    amount: '₹ 33,000',
  },
  {
    item_name: 'Highlights Video',
    percentage: '30%',
    amount: '₹ 33,000',
  },
  {
    item_name: 'Tradition Video',
    percentage: '30%',
    amount: '₹ 33,000',
  },
];

export default function ViewBilling() {
  const [visible, setVisible] = useState(false);
  const [subTotal, setSubTotal] = useState(false);
  const [extraTotal, setExtraTotal] = useState(false);
  const [editTotal, setEditTotal] = useState(false);
  const [additionaleditTotal, setAdditionalEditTotal] = useState(false);
  const navigate = useNavigate('');

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Totals" colSpan={6} />
        <Column footer="₹ 33,000" />
      </Row>
    </ColumnGroup>
  );

  const DistributesfooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Amount" colSpan={3} />
        <Column footer="₹ 33,000" />
      </Row>
    </ColumnGroup>
  );

  const AssignedTemplate = () => {
    return (
      <>
        <div className="assign-profile-wrapper">
          <div className="assign_profile">
            <img src={ProfileImg} alt="profileimg" />
          </div>
          <div className="profile_user_name">
            <h5 className="m-0">Chirag</h5>
          </div>
          <div className="assign-user-cancel item_name_wrapper">
            <Button className="btn_transparent">
              <img src={CloseImg} alt="closeimg" />
            </Button>
          </div>
        </div>
      </>
    );
  };

  const ItemsBodyTemplate = () => {
    return (
      <>
        <ul className="order-items-name">
          <li>Wedding Package</li>
          <li>- Highlights Video</li>
          <li>- Teaser</li>
          <li>- Tradition Video</li>
        </ul>
      </>
    );
  };

  const DescriptionTemplate = () => {
    return (
      <>
        <div className="description_text">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="main_Wrapper">
      <div className="bg-white radius15 border">
        <div className="billing_heading">
          <Row>
            <Col lg={6}>
              <ul className="billing-btn">
                <li>
                  <Button className="btn_border_dark filter_btn">
                    <img src={PdfIcon} alt="" /> Save As PDF
                  </Button>
                </li>
                <li>
                  <Button className="btn_border_dark filter_btn">
                    <img src={EmailIcon} alt="" /> Send Email
                  </Button>
                </li>
              </ul>
            </Col>
            <Col lg={6}>
              <ul className="billing-btn justify-content-end mt-2 mt-lg-0">
                <li>
                  <Button className="btn_border_dark filter_btn">
                    <img src={ShowIcon} alt="" /> Preview
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn_border_dark filter_btn"
                    onClick={() => navigate('/billing')}
                  >
                    Exit Page
                  </Button>
                </li>
                <li>
                  <Button
                    className="btn_primary filter_btn"
                    onClick={() => navigate('/billing')}
                  >
                    Save
                  </Button>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="billing_details">
          <Row className="g-3 g-sm-4">
            <Col lg={4}>
              <div className="weeding_package_wrapper">
                <h2>Quotation Weeding package 1</h2>
                <div class="payment_status_type">
                  <span class="p-tag p-component p-tag-success">Paid</span>
                </div>
                <div className="date_number">
                  <ul>
                    <li>
                      <h6>Invoice No.</h6>
                      <h4>#8966</h4>
                    </li>
                    <li>
                      <h6>Invoice Date</h6>
                      <h4>27/06/2023</h4>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col xxl={8}>
              <Row className="g-3 g-sm-4">
                <Col lg={6}>
                  <div className="order-details-wrapper p10 border radius15">
                    <div className="pb10 border-bottom">
                      <h6 className="m-0">Job</h6>
                    </div>
                    <div className="details_box pt10">
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Items :</span>
                          <h5>Wedding Package, Reel, Teaser</h5>
                        </div>
                        <div class="order-date">
                          <span>Couple Name :</span>
                          <h5>Kapil & Krupa</h5>
                        </div>
                      </div>
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Data Size :</span>
                          <h5>280 GB</h5>
                        </div>
                        <div class="order-date">
                          <span>Project Type :</span>
                          <h5>A</h5>
                        </div>
                        <div class="order-date">
                          <span>Due Date :</span>
                          <h5>16/07/2023</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="order-details-wrapper p10 border radius15">
                    <div className="pb10 border-bottom">
                      <h6 className="m-0">Company</h6>
                    </div>
                    <div className="details_box pt10">
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Company Name :</span>
                          <h5>ABC Enterprise</h5>
                        </div>
                        <div class="order-date">
                          <span>Client Name :</span>
                          <h5>Rajesh Singhania</h5>
                        </div>
                      </div>
                      <div class="details_box_inner">
                        <div class="order-date">
                          <span>Phone No :</span>
                          <h5>+91 9876541230</h5>
                        </div>
                        <div class="order-date">
                          <span>Email :</span>
                          <h5>rajeshsinghania@gmail.com</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="commision_btn text-end mt20 mb20">
            <Button className="btn_primary" onClick={() => setVisible(true)}>
              <img src={PlusIcon} alt="" /> Give Commission
            </Button>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={inquiryData}
              sortField="price"
              sortOrder={1}
              footerColumnGroup={footerGroup}
              rows={10}
            >
              <Column field="sr_no" header="Sr No." sortable></Column>
              <Column
                field="item_name"
                header="Item Name"
                sortable
                body={ItemsBodyTemplate}
              ></Column>
              <Column
                field="description"
                header="Description"
                sortable
                body={DescriptionTemplate}
              ></Column>
              <Column field="qty" header="Qty" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column field="tax" header="Tax" sortable></Column>
              <Column field="amount" header="Amount" sortable></Column>
            </DataTable>
          </div>
          <div className="amount_condition mt20">
            <Row className="justify-content-between g-3 g-md-4">
              <Col xxl={4} lg={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="p20 border-bottom">
                    <h5 className="m-0">Term & Condition</h5>
                  </div>
                  <div className="condition-content p20">
                    <ul>
                      <li>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                      <li>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                      <li>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col xxl={4} lg={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="condition-content p20">
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5 className="fw_600">Commission Distributes</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5>₹ 33,000</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Commission Percentage</h5>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="00.00 %" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Commission Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Profit Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700 text_green">₹ 18,000</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xxl={4} lg={6}>
                <div className="amount-condition-wrapper border radius15">
                  <div className="condition-content p20">
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Sub Total</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5>₹ 33,000</h5>
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Before Tax</h5>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title">
                        <h5>Discount ( - )</h5>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title item_name_wrapper d-flex justify-content-between">
                        <Button
                          className="btn_as_text"
                          onClick={() => setSubTotal(true)}
                        >
                          <h5 className="fw_700">
                            <img src={PlusIcon} alt="" /> Additional Charges
                          </h5>
                        </Button>
                        <Button
                          className="btn_as_text"
                          onClick={() => setAdditionalEditTotal(true)}
                        >
                          <h5>
                            <img src={EditImg} alt="" />
                          </h5>
                        </Button>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper">
                      <div className="subtotal-title item_name_wrapper d-flex justify-content-between">
                        <Button
                          className="btn_as_text"
                          onClick={() => setExtraTotal(true)}
                        >
                          <h5 className="fw_700">
                            <img src={PlusIcon} alt="" /> Extra Charges
                          </h5>
                        </Button>
                        <Button
                          className="btn_as_text ml20"
                          onClick={() => setEditTotal(true)}
                        >
                          <h5>
                            <img src={EditImg} alt="" />
                          </h5>
                        </Button>
                      </div>
                      <div className="subtotal-input">
                        <input placeholder="₹ 00.00" />
                      </div>
                    </div>
                    <div className="sub-total-wrapper total-amount">
                      <div className="subtotal-title">
                        <h5 className="fw_700">Total Amount</h5>
                      </div>
                      <div className="subtotal-input">
                        <h5 className="fw_700">₹ 33,000</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {/* Additional Changes edit popup */}
      <Dialog
        className="modal_small modal_Wrapper"
        visible={additionaleditTotal}
        onHide={() => setAdditionalEditTotal(false)}
        draggable={false}
        header="Additional Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button
            className="btn_border"
            onClick={() => setAdditionalEditTotal(false)}
          >
            Cancel
          </button>
          <button
            className="btn_primary"
            onClick={() => setAdditionalEditTotal(false)}
          >
            Save
          </button>
        </div>
      </Dialog>

      {/* Additional Changes popup */}
      <Dialog
        className="modal_small modal_Wrapper"
        visible={subTotal}
        onHide={() => setSubTotal(false)}
        draggable={false}
        header="Additional Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button className="btn_border" onClick={() => setSubTotal(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setSubTotal(false)}>
            Save
          </button>
        </div>
      </Dialog>

      {/* Extra Charges edit popup */}
      <Dialog
        className="modal_small modal_Wrapper"
        visible={editTotal}
        onHide={() => setEditTotal(false)}
        draggable={false}
        header="Extra Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button className="btn_border" onClick={() => setEditTotal(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setEditTotal(false)}>
            Save
          </button>
        </div>
      </Dialog>

      {/* Extra Charges popup */}
      <Dialog
        className="modal_small modal_Wrapper"
        visible={extraTotal}
        onHide={() => setExtraTotal(false)}
        draggable={false}
        header="Extra Charges"
      >
        <div className="form_group mb-3">
          <label>Name</label>
          <InputText placeholder="Extra Changes" className="input_wrap" />
        </div>
        <div className="form_group mb-3">
          <label>Amount</label>
          <InputText placeholder="₹ 500.00" className="input_wrap" />
        </div>
        <div className="delete_btn_wrap">
          <button className="btn_border" onClick={() => setExtraTotal(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setExtraTotal(false)}>
            Save
          </button>
        </div>
      </Dialog>

      {/* give commition popup */}
      <Dialog
        className="modal_Wrapper commission_dialog"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
        header="Commission Distributes"
      >
        <div className="data_table_wrapper max_height border">
          <DataTable
            value={DistributesData}
            sortField="price"
            sortOrder={1}
            footerColumnGroup={DistributesfooterGroup}
            rows={10}
          >
            <Column field="item_name" header="Item Name" sortable></Column>
            <Column
              field="assigned_employee"
              header="Assigned Employee"
              sortable
              body={AssignedTemplate}
            ></Column>
            <Column field="percentage" header="Percentage" sortable></Column>
            <Column field="amount" header="Amount" sortable></Column>
          </DataTable>
        </div>
        <div className="delete_btn_wrap pr20">
          <button className="btn_border" onClick={() => setVisible(false)}>
            Cancel
          </button>
          <button className="btn_primary" onClick={() => setVisible(false)}>
            Save
          </button>
        </div>
      </Dialog>
    </div>
  );
}
