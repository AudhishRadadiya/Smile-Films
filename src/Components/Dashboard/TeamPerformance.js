import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import UserIcon from '../../Assets/Images/add-user.svg';

function TeamPerformance() {
  const { dashboardTeamPerformanceData } = useSelector(
    ({ adminDashboard }) => adminDashboard,
  );

  const ConfectionTemplet = rowData => {
    return (
      <div className="employee_name">
        <img src={rowData?.image ? rowData?.image : UserIcon} alt="" />
        <h5>{rowData?.name}</h5>
      </div>
    );
  };
  return (
    <>
      <div className="table_main_Wrapper h-auto overflow-hidden">
        <div className="top_filter_wrap">
          <Row className="justify-content-between g-2 align-items-center">
            <Col sm={6}>
              <div className="page_title">
                <h3 className="m-0">Team Performance</h3>
              </div>
            </Col>
            {/* <Col sm={6}>
              <div className="table_top_wrap">
                <div className="form_group">
                  <InputText
                    id="search"
                    placeholder="Search Employee here"
                    type="search"
                    className="input_wrap small search_wrap"
                  />
                </div>
                <div className="date_select text-end ms-3">
                  <Calendar
                    id=" ConsumptionDate"
                    value={date}
                    placeholder="Date Range"
                    showIcon
                    selectionMode="range"
                    dateFormat="dd-mm-yy"
                    readOnlyInput
                    onChange={e => setDate(e.value)}
                  />
                </div>
              </div>
            </Col> */}
          </Row>
        </div>
        <div className="data_table_wrapper max_height Exposing_table">
          <DataTable
            value={dashboardTeamPerformanceData}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column
              field="employee_name"
              header="Employee name"
              sortable
              body={ConfectionTemplet}
            ></Column>
            <Column field="emp_no" header="ID" sortable></Column>
            <Column
              field="total_project"
              header="Project Assignees"
              sortable
            ></Column>
            <Column
              field="pending_project"
              header="Project Pending"
              sortable
            ></Column>
            <Column
              field="completed_project"
              header="Project  Completed"
              sortable
            ></Column>
            <Column field="due_date" header="Next Due Date" sortable></Column>
          </DataTable>
        </div>
      </div>
    </>
  );
}

export default TeamPerformance;
