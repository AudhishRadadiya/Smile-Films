import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import ArrowIcon from '../../Assets/Images/left_arrow.svg';
import ReactSelectSingle from '../Common/ReactSelectSingle';
import PlusIcon from '../../Assets/Images/plus.svg';

export const JornalEntryData = [
  {
    item: 'Tradition-Photo',
    quantity: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
    function_name: 'Engagement',
  },
  {
    item: 'Tradition-Photo',
    quantity: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
    function_name: 'Engagement',
  },
  {
    item: 'Tradition-Photo',
    quantity: '1',
    rate: '₹ 20,000',
    amount: '₹ 20,000',
    function_name: 'Engagement',
  },
];

export default function OrderForm() {
  const [visible, setVisible] = useState(false);
  const [companySelect, setCompanySelect] = useState([]);
  const [popupCompanySelect, setPopupCompanySelect] = useState([]);
  const [countrySelect, setCountrySelect] = useState([]);
  const [stateSelect, setStateSelect] = useState([]);
  const [citySelect, setCitySelect] = useState([]);
  const [referenceSelect, setReferenceSelect] = useState([]);
  const [typeSelect, setTypeSelect] = useState([]);
  const [currencySelect, setCurrencySelect] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [date, setDate] = useState();
  const [checked, setChecked] = useState(false);
  const [edit, setEdit] = useState(false);
  const [noEdit, setNoEdit] = useState(false);
  const [time, setTime] = useState(null);
  const [exposingItems, setExposingItems] = useState(null);

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Quantity" colSpan={5} />
        <Column footer="₹ 60,000" colSpan={2} />
      </Row>
    </ColumnGroup>
  );

  const stateCompanyChange = e => {
    setCompanySelect(e.value);
  };
  const statePopupCompanyChange = e => {
    setPopupCompanySelect(e.value);
  };
  const stateCountryChange = e => {
    setCountrySelect(e.value);
  };
  const stateStateChange = e => {
    setStateSelect(e.value);
  };
  const stateCityChange = e => {
    setCitySelect(e.value);
  };
  const stateReferenceChange = e => {
    setReferenceSelect(e.value);
  };
  const stateTypeChange = e => {
    setTypeSelect(e.value);
  };
  const stateCurrencyChange = e => {
    setCurrencySelect(e.value);
  };

  const Company = [
    { label: 'ABC Company', value: 'abc company' },
    { label: 'BCD Company', value: 'bcd company' },
    { label: 'EFG Company', value: 'efg company' },
  ];

  const PopupCompany = [
    { label: 'ABC Company', value: 'abc company' },
    { label: 'BCD Company', value: 'bcd company' },
    { label: 'EFG Company', value: 'efg company' },
  ];

  const Country = [
    { label: 'India', value: 'india' },
    { label: 'USA', value: 'usa' },
    { label: 'Canada', value: 'canada' },
    { label: 'Korea', value: 'korea' },
  ];

  const State = [
    { label: 'Gujrat', value: 'gujrat' },
    { label: 'Maharastra', value: 'maharastra' },
    { label: 'Panjab', value: 'panjab' },
    { label: 'Hydranad', value: 'hydrabad' },
  ];

  const City = [
    { label: 'Surat', value: 'surat' },
    { label: 'Ahemdabad', value: 'ahemdabad' },
    { label: 'Gandhinagar', value: 'gandhinagr' },
    { label: 'Baroda', value: 'baroda' },
  ];

  const Reference = [
    { label: 'Social Media', value: 'social media' },
    { label: 'Website', value: 'website' },
    { label: 'Other Client', value: 'other client' },
    { label: 'Employee', value: 'employee' },
  ];

  const Type = [
    { label: 'Client Company', value: 'client company' },
    { label: 'Supplier', value: 'supplier' },
  ];

  const Currency = [
    { label: 'INR India', value: 'inr india' },
    { label: 'USD United States Dollar', value: 'usd united states dollar' },
    { label: 'Euro European', value: 'euro european' },
    { label: 'AUD Australian dollar', value: 'aud australian dollar' },
  ];

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

  const EventBodyTemplet = () => {
    return (
      <div className="event_date_select">
        <div className="form_group mb-3">
          <div className="date_select">
            <Calendar
              value={date}
              placeholder="27/08/2023"
              onChange={e => setDate(e.value)}
              showIcon
            />
          </div>
        </div>
      </div>
    );
  };

  const ExposingItems = [
    {
      label: 'Packages',
      code: 'DE',
      items: [
        {
          label: 'Video & Highlight Package',
          value: 'Video & Highlight Package',
        },
        { label: 'Bronze Wedding Packege', value: 'Bronze Wedding Packege' },
        { label: 'Wedding & Reel Packeg', value: 'Wedding & Reel Packeg' },
      ],
    },
    {
      label: 'Products',
      code: 'US',
      items: [
        { label: 'Reels', value: 'Reels' },
        { label: 'Instagram Post', value: 'Instagram Post' },
        { label: 'Highlights', value: 'Highlights' },
        { label: 'Teaser', value: 'Teaser' },
      ],
    },
  ];

  const exposingItemsTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  return (
    <div className="main_Wrapper">
      <div className="processing_main bg-white radius15 border">
        <div className="billing_heading">
          <div className="processing_bar_wrapper">
            <div className="verifide_wrap current">
              <h4 className="m-0 active">Order Form</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap next">
              <h4 className="m-0">Quotation</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0">Quotes Approve</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0">Assign to Exposer</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0">Overview</h4>
              <span className="line"></span>
            </div>
            <div className="verifide_wrap">
              <h4 className="m-0">Completed</h4>
              <span className="line"></span>
            </div>
          </div>
        </div>
        <div className="process_order_wrap">
          <Row className="align-items-center">
            <Col sm={5}>
              <div className="back_page">
                <div className="btn_as_text d-flex align-items-center">
                  <Link to="/exposing">
                    <img src={ArrowIcon} alt="ArrowIcon" />
                  </Link>
                  <h2 className="m-0 ms-2 fw_500">Order Form</h2>
                </div>
              </div>
            </Col>
            <Col sm={7}>
              <div className="date_number">
                <ul className="justify-content-end">
                  <li>
                    <h6>Order No.</h6>
                    <h4>#564892</h4>
                  </li>
                  <li>
                    <h6>Creat Date</h6>
                    <h4>27/06/2023</h4>
                  </li>
                  <li>
                    <h6>Confirm By </h6>
                    <h4>Kishan</h4>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="billing_details">
          <Row>
            <Col lg={6}>
              <Row className="align-items-end">
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>Company</label>
                    <ReactSelectSingle
                      filter
                      value={companySelect}
                      options={Company}
                      onChange={e => {
                        stateCompanyChange(e);
                      }}
                      placeholder="Select Company"
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="addclient_popup">
                    <Button
                      className="btn_primary filter_btn mb-3"
                      onClick={() => setVisible(true)}
                    >
                      <img src={PlusIcon} alt="PlusIcon" />
                      New Client
                    </Button>
                  </div>
                </Col>
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>Client Name</label>
                    <input
                      placeholder="Client Name"
                      class="p-inputtext p-component input_wrap"
                    />
                  </div>
                </Col>
              </Row>
              <Row className="align-items-end">
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>Email Address</label>
                    <input
                      placeholder="Write email address"
                      class="p-inputtext p-component input_wrap"
                    />
                  </div>
                </Col>
                <Col sm={6}>
                  <div class="form_group mb-3">
                    <label>Phone Number</label>
                    <input
                      placeholder="Write number"
                      type="number"
                      class="p-inputtext p-component input_wrap"
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <div className="delivery_timing">
                <ul>
                  <li>
                    <div className="form_group mb-3">
                      <label>Delivery Date</label>
                      <div className="date_select">
                        <Calendar
                          value={date}
                          placeholder="27/08/2023"
                          onChange={e => setDate(e.value)}
                          showIcon
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="form_group mb-3">
                      <label className="d-block">Timing</label>
                      <Calendar
                        id="calendar-timeonly"
                        value={time}
                        placeholder="00:00"
                        onChange={e => setTime(e.value)}
                        timeOnly
                      />
                    </div>
                  </li>
                  <li>
                    <div className="checkbox_wrap_main d-flex align-items-center gap-2 mb-2 mb-sm-3">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          onChange={e => setEdit(e.checked)}
                          checked={edit}
                        ></Checkbox>
                      </div>
                      <span>Yes Editing</span>
                    </div>
                  </li>
                  <li>
                    <div className="checkbox_wrap_main d-flex align-items-center gap-2 mb-2 mb-sm-3">
                      <div className="form_group checkbox_wrap">
                        <Checkbox
                          onChange={e => setNoEdit(e.checked)}
                          checked={noEdit}
                        ></Checkbox>
                      </div>
                      <span>No Editing</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="form_group mb-3">
                <label>Venue</label>
                <input
                  placeholder="Write Venue"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
              <div class="form_group mb-3">
                <label>Remark</label>
                <input
                  placeholder="Write here"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
          </Row>
          <div className="order_items">
            <h3>Order Item</h3>
            <Row>
              <Col xl={2} lg={4} sm={6}>
                <div class="form_group">
                  <MultiSelect
                    filter
                    value={exposingItems}
                    options={ExposingItems}
                    onChange={e => setExposingItems(e.value)}
                    optionLabel="label"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    optionGroupTemplate={exposingItemsTemplate}
                    placeholder="Select Exposing Items"
                    display="chip"
                    className="w-100"
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height border radius15 overflow-hidden">
            <DataTable
              value={JornalEntryData}
              sortField="price"
              sortOrder={1}
              rows={10}
              footerColumnGroup={footerGroup}
            >
              <Column
                field="item"
                header="Item"
                sortable
                // body={CrDbTemplet}
              ></Column>
              <Column
                field="description"
                header="Description"
                body={DescriptionTemplate}
                sortable
              ></Column>
              <Column
                field="event_date"
                header="Event Date"
                sortable
                body={EventBodyTemplet}
              ></Column>
              <Column field="quantity" header="Quantity" sortable></Column>
              <Column field="rate" header="Rate" sortable></Column>
              <Column field="amount" header="Amount" sortable></Column>
              <Column
                field="function_name"
                header="Function Name"
                sortable
              ></Column>
            </DataTable>
          </div>
          <div class="delete_btn_wrap mt-4 p-0 text-end">
            <Link to="/exposing" class="btn_border_dark">
              Exit Page
            </Link>
            <Link to="/quotation" class="btn_primary">
              Save
            </Link>
          </div>
        </div>
      </div>

      {/* new client Dialog */}

      <Dialog
        header="Create Client Company"
        className="modal_medium modal_Wrapper"
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
      >
        <div className="delete_popup_wrapper">
          <Row>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Client Company name</label>
                <input
                  placeholder="Write Company"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Client Full Name</label>
                <input
                  placeholder="Write Name"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Email Address</label>
                <input
                  placeholder="Write email address"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Phone Number</label>
                <input
                  placeholder="Write number"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Address</label>
                <input
                  placeholder="Write address"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Company</label>
                <ReactSelectSingle
                  filter
                  value={popupCompanySelect}
                  options={PopupCompany}
                  onChange={e => {
                    statePopupCompanyChange(e);
                  }}
                  placeholder="Select Company"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Country</label>
                <ReactSelectSingle
                  filter
                  value={countrySelect}
                  options={Country}
                  onChange={e => {
                    stateCountryChange(e);
                  }}
                  placeholder="Select Country"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>State</label>
                <ReactSelectSingle
                  filter
                  value={stateSelect}
                  options={State}
                  onChange={e => {
                    stateStateChange(e);
                  }}
                  placeholder="Select State"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>City</label>
                <ReactSelectSingle
                  filter
                  value={citySelect}
                  options={City}
                  onChange={e => {
                    stateCityChange(e);
                  }}
                  placeholder="Select City"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Pin code</label>
                <input
                  placeholder="Pin code"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Reference</label>
                <ReactSelectSingle
                  filter
                  value={referenceSelect}
                  options={Reference}
                  onChange={e => {
                    stateReferenceChange(e);
                  }}
                  placeholder="Select Reference"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Type</label>
                <ReactSelectSingle
                  filter
                  value={typeSelect}
                  options={Type}
                  onChange={e => {
                    stateTypeChange(e);
                  }}
                  placeholder="Select Type"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Currency</label>
                <ReactSelectSingle
                  filter
                  value={currencySelect}
                  options={Currency}
                  onChange={e => {
                    stateCurrencyChange(e);
                  }}
                  placeholder="Select Currency"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <div className="balance_radio">
                  <label>Opening Balance</label>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center">
                      <RadioButton
                        inputId="ingredient1"
                        name="pizza"
                        value="Cheese"
                        onChange={e => setIngredient(e.value)}
                        checked={ingredient === 'Cheese'}
                      />
                      <label htmlFor="ingredient1" className="ml-2">
                        Cheese
                      </label>
                    </div>
                    <div className="d-flex align-items-center">
                      <RadioButton
                        inputId="ingredient1"
                        name="pizza"
                        value="Cheese"
                        onChange={e => setIngredient(e.value)}
                        checked={ingredient === 'Cheese'}
                      />
                      <label htmlFor="ingredient1" className="ml-2">
                        Cheese
                      </label>
                    </div>
                  </div>
                </div>
                <input
                  placeholder="Write opening Balance"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div class="form_group mb-3">
                <label>Credits Limits</label>
                <input
                  placeholder="Write Credits Limits"
                  class="p-inputtext p-component input_wrap"
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="form_group mb-3">
                <label>Pay Due Date</label>
                <div className="date_select">
                  <Calendar
                    value={date}
                    placeholder="Write Credits Limits"
                    onChange={e => setDate(e.value)}
                    showIcon
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="checkbox_wrap_main d-flex align-items-center gap-2">
                <div className="form_group checkbox_wrap">
                  <Checkbox
                    onChange={e => setChecked(e.checked)}
                    checked={checked}
                  ></Checkbox>
                </div>
                <span>Active</span>
              </div>
            </Col>
            <Col>
              <div className="delete_btn_wrap m-0 p-0">
                <button
                  className="btn_border_dark"
                  onClick={() => setVisible(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn_primary"
                  onClick={() => setVisible(false)}
                >
                  Save
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    </div>
  );
}
