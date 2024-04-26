import React, { useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Tag } from 'primereact/tag';
import { Button, Col, Row } from 'react-bootstrap';
import FilterIcon from '../../../Assets/Images/filter.svg';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { COLUMN_NAMES } from './constants';
import { tasks } from './tasks';
import TopRightArrow from '../../../Assets/Images/top-right-arrow.svg';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

const Column = ({ children, className, title }) => {
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
        {title} <span>7</span>
      </h5>
      <div className="items_wrapper">{children}</div>
    </div>
  );
};

export default function ProjectStatus() {
  const op = useRef(null);
  const [checked, setChecked] = useState(false);
  const [workSubmission, setWorkSubmission] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [workDesc, setWorkDesc] = useState('');
  const statusBodyTemplate = product => {
    return <Tag value={product.status} severity={getSeverity(product)}></Tag>;
  };
  const getSeverity = product => {
    switch (product.status) {
      case 'Partial':
        return 'info';

      case 'In Progress':
        return 'primary';

      case 'Pending':
        return 'warning';

      case 'Due':
        return 'danger';

      case 'Completed':
        return 'success';

      default:
        return null;
    }
  };

  const [items, setItems] = useState(tasks);

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];

    if (dragItem) {
      setItems(prevState => {
        const coppiedStateArray = [...prevState];

        // remove item by "hoverIndex" and put "dragItem" instead
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);

        // remove item by "dragIndex" and put "prevItem" instead
        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);

        return coppiedStateArray;
      });
    }
  };

  const returnItemsForColumn = columnName => {
    return items
      .filter(item => item.column === columnName)
      .map((item, index) => (
        <MovableItem
          key={item.id}
          name={item.name}
          currentColumnName={item.column}
          setItems={setItems}
          index={index}
          moveCardHandler={moveCardHandler}
        />
      ));
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

  const onIngredientsChange = e => {
    let _ingredients = [...ingredients];

    if (e.checked) _ingredients.push(e.value);
    else _ingredients.splice(_ingredients.indexOf(e.value), 1);

    setIngredients(_ingredients);
  };

  const MovableItem = ({
    name,
    index,
    currentColumnName,
    moveCardHandler,
    setItems,
  }) => {
    const changeItemColumn = (currentItem, columnName) => {
      setItems(prevState => {
        return prevState.map(e => {
          return {
            ...e,
            column: e.name === currentItem.name ? columnName : e.column,
          };
        });
      });
    };

    const ref = useRef(null);

    const [, drop] = useDrop({
      accept: 'Our first type',
      hover(item, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        // Time to actually perform the action
        moveCardHandler(dragIndex, hoverIndex);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: 'BOX',
      item: { index, name, currentColumnName, type: 'Our first type' },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();

        if (dropResult) {
          const { name } = dropResult;
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
          switch (name) {
            case PendingQuotes:
              changeItemColumn(item, PendingQuotes);
              break;
            case UnassignedToEditor:
              changeItemColumn(item, UnassignedToEditor);
              break;
            case RunningProjects:
              changeItemColumn(item, RunningProjects);
              break;
            case INcheckingProjects:
              changeItemColumn(item, INcheckingProjects);
              break;
            case ExportProjects:
              changeItemColumn(item, ExportProjects);
              break;
            case CompleteProjects:
              changeItemColumn(item, CompleteProjects);
              break;
            case ReworkProjects:
              changeItemColumn(item, ReworkProjects);
              break;
            case PendingDataCollection:
              changeItemColumn(item, PendingDataCollection);
              break;
            default:
              break;
          }
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const opacity = isDragging ? 0.4 : 1;

    drag(drop(ref));
    return (
      <div
        ref={ref}
        className="movable-item"
        onClick={() =>
          currentColumnName === CompleteProjects && setWorkSubmission(true)
        }
      >
        <div className="company_header">
          <div className="company_logo">{name[0] + name[1]}</div>
          <div className="company_name">
            <h5>{name}</h5>
          </div>
        </div>
        <p>Items: Wedding, Teaser, Pre-wedding</p>
        <div className="d-flex align-items-center justify-content-between companny_footer">
          <h4>#56897</h4>
          <p>
            29 min ago <img src={TopRightArrow} alt="" />
          </p>
        </div>
      </div>
    );
  };

  const footerContent = (
    <div className="footer_wrap d-flex justify-content-end align-items-center">
      <div className="footer_button">
        <Button
          className="btn_border_dark"
          onClick={() => setWorkSubmission(false)}
        >
          Cancel
        </Button>
        <Button
          className="btn_primary"
          onClick={() => setWorkSubmission(false)}
        >
          Submit
        </Button>
      </div>
    </div>
  );

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
                    <div className="form_group">
                      <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                      />
                    </div>
                  </li>
                  <li>
                    <Button
                      className="btn_border filter_btn"
                      onClick={e => op.current.toggle(e)}
                    >
                      <img src={FilterIcon} alt="" /> Filter by Status
                    </Button>
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
              >
                {returnItemsForColumn(PendingDataCollection)}
              </Column>
              <Column
                title={PendingQuotes}
                className={`column ${PendingQuotes.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
              >
                {returnItemsForColumn(PendingQuotes)}
              </Column>
              <Column
                title={UnassignedToEditor}
                className={`column ${UnassignedToEditor.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
              >
                {returnItemsForColumn(UnassignedToEditor)}
              </Column>
              <Column
                title={RunningProjects}
                className={`column ${RunningProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
              >
                {returnItemsForColumn(RunningProjects)}
              </Column>
              <Column
                title={INcheckingProjects}
                className={`column ${INcheckingProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
              >
                {returnItemsForColumn(INcheckingProjects)}
              </Column>
              <Column
                title={ExportProjects}
                className={`column ${ExportProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
              >
                {returnItemsForColumn(ExportProjects)}
              </Column>
              <Column
                title={CompleteProjects}
                className={`column ${CompleteProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
              >
                {returnItemsForColumn(CompleteProjects)}
              </Column>
              <Column
                title={ReworkProjects}
                className={`column ${ReworkProjects.toLowerCase().replace(
                  / /g,
                  '_',
                )}`}
              >
                {returnItemsForColumn(ReworkProjects)}
              </Column>
            </DndProvider>
          </div>
        </div>
      </div>
      <Dialog
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
      </Dialog>
    </div>
  );
}
