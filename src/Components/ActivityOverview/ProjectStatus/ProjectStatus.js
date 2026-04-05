import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
// import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
// import { Tag } from 'primereact/tag';
import {
  // Button,
  Col,
  Row,
} from 'react-bootstrap';
// import FilterIcon from '../../../Assets/Images/filter.svg';
import {
  DndProvider,
  // useDrag,
  useDrop,
} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { COLUMN_NAMES } from './constants';
// import { tasks } from './tasks';
// import TopRightArrow from '../../../Assets/Images/top-right-arrow.svg';
// import { Dialog } from 'primereact/dialog';
// import { InputTextarea } from 'primereact/inputtextarea';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectStatusList } from 'Store/Reducers/ActivityOverview/ProjectStatus/ProjectStatusSlice';
import { useNavigate } from 'react-router-dom';

const Column = ({ children, className, title, length }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'Our first type',
    drop: () => ({ name: title }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    // Override monitor.canDrop() function
    canDrop: item => {
      const {
        PendingDataCollection,
        PendingQuotes,
        UnassignedToEditor,
        RunningProjects,
        INcheckingProjects,
        ExportProjects,
        CompleteProjects,
        ReworkProjects,
      } = COLUMN_NAMES;

      const { currentColumnName } = item;
      return (
        currentColumnName === title ||
        (currentColumnName === PendingDataCollection &&
          title === PendingQuotes) ||
        (currentColumnName === PendingQuotes &&
          (title === PendingDataCollection || title === UnassignedToEditor)) ||
        (currentColumnName === UnassignedToEditor &&
          (title === PendingQuotes || title === RunningProjects)) ||
        (currentColumnName === RunningProjects &&
          (title === UnassignedToEditor || title === INcheckingProjects)) ||
        (currentColumnName === INcheckingProjects &&
          (title === RunningProjects || title === ExportProjects)) ||
        (currentColumnName === ExportProjects &&
          (title === INcheckingProjects || title === CompleteProjects)) ||
        (currentColumnName === CompleteProjects &&
          (title === ExportProjects || title === ReworkProjects)) ||
        (currentColumnName === ReworkProjects && title === CompleteProjects) ||
        currentColumnName === title
      );
    },
  });

  const getBackgroundColor = () => {
    if (isOver) {
      if (canDrop) {
        return 'rgba(0,0,0,0.1)';
      } else if (!canDrop) {
        return 'rgba(255,188,188,0.4)';
      }
    } else {
      return '';
    }
  };

  return (
    <div
      ref={drop}
      className={className}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <h5>
        {title} <span>{length}</span>
      </h5>
      <div className="items_wrapper">{children}</div>
    </div>
  );
};

export default function ProjectStatus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projectStatusList } = useSelector(
    ({ projectStatus }) => projectStatus,
  );
  const op = useRef(null);
  //   const [items, setItems] = useState(tasks);
  //   const [workDesc, setWorkDesc] = useState('');
  const [checked, setChecked] = useState(false);
  //   const [workSubmission, setWorkSubmission] = useState(false);

  useEffect(() => {
    dispatch(
      getProjectStatusList({
        search: '',
        isActive: '',
        order_status: '',
      }),
    );
  }, [dispatch]);

  const projectStatusListData = useMemo(() => {
    if (projectStatusList?.list?.length > 0) {
      return projectStatusList.list.map(item => {
        const { step, order_status, is_rework } = item;

        const columnName =
          order_status === 6
            ? 'Complete Projects'
            : is_rework
            ? 'Rework Projects'
            : order_status === 4
            ? 'IN checking Projects'
            : order_status === 5
            ? 'Export Projects'
            : !step || step === 0
            ? 'Pending Data Collection'
            : step === 1 || step === 2
            ? 'Pending Quotes'
            : step === 3
            ? 'Unassigned To Editor'
            : step === 4 || step === 5 || step === 6
            ? 'Running Projects'
            : 'Pending Data Collection';

        return {
          ...item,
          column: columnName,
          item_name:
            item?.item_name?.length === 1
              ? item?.item_name[0]
              : item?.item_name?.join(', '),
        };
      });
    }
    return [];
  }, [projectStatusList]);

  const returnItemsForColumn = columnName => {
    return projectStatusListData
      .filter(item => item.column === columnName)
      .map(item => <MovableItem key={item._id} item={item} />);
  };

  const {
    PendingDataCollection,
    PendingQuotes,
    UnassignedToEditor,
    RunningProjects,
    INcheckingProjects,
    ExportProjects,
    CompleteProjects,
    ReworkProjects,
  } = COLUMN_NAMES;

  const MovableItem = ({ item }) => {
    const { _id, company_name, inquiry_no, item_name, couple_name } = item;

    return (
      <div
        // ref={ref}
        className="movable-item background_animation_color cursor_pointer"
        // onClick={() =>
        //   currentColumnName === CompleteProjects && setWorkSubmission(true)
        // }
        onClick={() => navigate(`/editing-flow/${_id}`)}
      >
        <div className="company_header">
          <div className="company_logo">
            {company_name && company_name[0] + company_name[1]}
          </div>
          <div className="company_name">
            <h5>{company_name}</h5>
          </div>
        </div>
        <p>{item_name}</p>
        <h5>Couple Name: {couple_name}</h5>
        <div className="d-flex align-items-center justify-content-between companny_footer">
          <h5>Order No: {inquiry_no}</h5>
          {/* <p>
            29 min ago <img src={TopRightArrow} alt="" />
          </p> */}
        </div>
      </div>
    );
  };

  //   const footerContent = (
  //     <div className="footer_wrap d-flex justify-content-end align-items-center">
  //       <div className="footer_button">
  //         <Button
  //           className="btn_border_dark"
  //           onClick={() => setWorkSubmission(false)}
  //         >
  //           Cancel
  //         </Button>
  //         <Button
  //           className="btn_primary"
  //           onClick={() => setWorkSubmission(false)}
  //         >
  //           Submit
  //         </Button>
  //       </div>
  //     </div>
  //   );

  const getColumnLength = columnName => {
    return projectStatusListData.filter(item => item.column === columnName)
      .length;
  };

  return (
    <div className="main_Wrapper">
      <div className="project_status_wrap bg-white radius15 border">
        <div className="top_filter_wrap border-0">
          <Row className="align-items-center gy-3">
            <Col sm={3}>
              <div className="page_title">
                <h3 className="m-0">Project Status</h3>
              </div>
            </Col>
            <Col sm={9}>
              <div className="right_filter_wrapper">
                <ul>
                  <li className="flex-sm-grow-0 flex-grow-1">
                    {/* <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                      />
                    </div> */}
                  </li>
                  <li>
                    {/* <Button
                      className="btn_border filter_btn"
                      onClick={e => op.current.toggle(e)}
                    >
                      <img src={FilterIcon} alt="" /> Filter by Status
                    </Button> */}
                    <OverlayPanel
                      className="payment-status-overlay"
                      ref={op}
                      hideCloseIcon
                    >
                      <div className="overlay_body payment-status">
                        <div className="overlay_select_filter_row">
                          <div className="filter_row w-100">
                            <Row>
                              <Col sm={12}>
                                <div className="payment_status_wrap mb-2">
                                  <div className="payment_status_checkbox">
                                    <div className="form_group checkbox_wrap">
                                      <Checkbox
                                        onChange={e => setChecked(e.checked)}
                                        checked={checked}
                                      ></Checkbox>
                                    </div>
                                  </div>
                                  <div className="payment_status_type">
                                    <span className="s-tag tag_info">
                                      Partial
                                    </span>
                                  </div>
                                </div>
                              </Col>
                              <Col sm={12}>
                                <div className="payment_status_wrap">
                                  <div className="payment_status_checkbox">
                                    <div className="form_group checkbox_wrap">
                                      <Checkbox
                                        onChange={e => setChecked(e.checked)}
                                        checked={checked}
                                      ></Checkbox>
                                    </div>
                                  </div>
                                  <div className="payment_status_type">
                                    <span className="s-tag tab_danger">
                                      Due
                                    </span>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </OverlayPanel>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="project_status_overFlow_wrap">
          <div className="project_status_inner_wrapper">
            <DndProvider backend={HTML5Backend}>
              <Column
                title={PendingDataCollection}
                className={`column ${PendingDataCollection.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
                length={getColumnLength(PendingDataCollection)}
              >
                {returnItemsForColumn(PendingDataCollection)}
              </Column>
              <Column
                title={PendingQuotes}
                className={`column ${PendingQuotes.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
                length={getColumnLength(PendingQuotes)}
              >
                {returnItemsForColumn(PendingQuotes)}
              </Column>
              <Column
                title={UnassignedToEditor}
                className={`column ${UnassignedToEditor.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
                length={getColumnLength(UnassignedToEditor)}
              >
                {returnItemsForColumn(UnassignedToEditor)}
              </Column>
              <Column
                title={RunningProjects}
                className={`column ${RunningProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
                length={getColumnLength(RunningProjects)}
              >
                {returnItemsForColumn(RunningProjects)}
              </Column>
              <Column
                title={INcheckingProjects}
                className={`column ${INcheckingProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
                length={getColumnLength(INcheckingProjects)}
              >
                {returnItemsForColumn(INcheckingProjects)}
              </Column>
              <Column
                title={ExportProjects}
                className={`column ${ExportProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
                length={getColumnLength(ExportProjects)}
              >
                {returnItemsForColumn(ExportProjects)}
              </Column>
              <Column
                title={CompleteProjects}
                className={`column ${CompleteProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
                length={getColumnLength(CompleteProjects)}
              >
                {returnItemsForColumn(CompleteProjects)}
              </Column>
              <Column
                title={ReworkProjects}
                className={`column ${ReworkProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
                length={getColumnLength(ReworkProjects)}
              >
                {returnItemsForColumn(ReworkProjects)}
              </Column>
            </DndProvider>
          </div>
        </div>
      </div>
      {/* <Dialog
        header="Work Submission"
        visible={workSubmission}
        draggable={false}
        className="modal_Wrapper modal_small"
        onHide={() => setWorkSubmission(false)}
        footer={footerContent}
      >
        <div className="create_client_company_wrap">
          <Row>
            <Col xs={12}>
              <div className="form_group mb-3">
                <label htmlFor="ClientFullName">Paste here</label>
                <InputTextarea
                  value={workDesc}
                  onChange={e => setWorkDesc(e.target.value)}
                  rows={7}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Dialog> */}
    </div>
  );
}
