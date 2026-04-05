import React, { useMemo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasPermissionForHomePath } from 'Helper/CommonHelper';
import DashboardLogo from '../../Assets/Images/dashboard-logo.svg';
import DashbordIcon from '../../Assets/Images/dashboard-icon.svg';
import InquairyIcon from '../../Assets/Images/inquiry-icon.svg';
import DataCollectionIcon from '../../Assets/Images/data-collection-icon.svg';
import EditingIcon from '../../Assets/Images/editing-icon.svg';
import ExposingIcon from '../../Assets/Images/exposing-icon.svg';
import ProjectStatesIcon from '../../Assets/Images/project-states-icon.svg';
import BillingIcon from '../../Assets/Images/billing-icon.svg';
import ReceiptPaymentIcon from '../../Assets/Images/receipt-payment-icon.svg';
import CalanderIcon from '../../Assets/Images/calander-icon.svg';

const HOME_TILES_CONFIG = [
  { path: '/inquiry', icon: InquairyIcon, label: 'Inquiry' },
  {
    path: '/data-collection',
    icon: DataCollectionIcon,
    label: 'Data Collection',
  },
  { path: '/editing', icon: EditingIcon, label: 'Editing' },
  { path: '/exposing', icon: ExposingIcon, label: 'Exposing' },
  { path: '/project-status', icon: ProjectStatesIcon, label: 'Project Status' },
  { path: '/billing', icon: BillingIcon, label: 'Billing' },
  {
    path: '/receipt-payment',
    icon: ReceiptPaymentIcon,
    label: 'Receipt / Payment',
  },
  { path: '/calender-view', icon: CalanderIcon, label: 'Calendar View' },
];

export default function Homepage() {
  const { userPermissions } = useSelector(({ auth }) => auth);

  let UserPreferences = localStorage.getItem('UserPreferences');

  if (UserPreferences) {
    UserPreferences = JSON.parse(window?.atob(UserPreferences));
  }

  const dashboardPath =
    UserPreferences?.role === 1 || UserPreferences?.role === 2
      ? '/dashboard'
      : UserPreferences?.role === 3
      ? '/user-dashboard'
      : '/client-dashboard';

  const visibleTiles = useMemo(() => {
    const tiles = [];

    // Add Dashboard tile if user has permission
    if (hasPermissionForHomePath(userPermissions, dashboardPath)) {
      tiles.push({
        path: dashboardPath,
        icon: DashbordIcon,
        label: 'Dashboard',
      });
    }

    // Add other tiles if user has permission
    HOME_TILES_CONFIG.forEach(tile => {
      if (hasPermissionForHomePath(userPermissions, tile.path)) {
        tiles.push(tile);
      }
    });

    return tiles;
  }, [userPermissions, dashboardPath]);

  return (
    <div>
      <div className="home_main_wrapper">
        <Row className="justify-content-between">
          <Col xl={5} lg={7} className="order-lg-0 order-1">
            <div className="home-right-wrappre">
              <Row>
                {visibleTiles.map((tile, index) => (
                  <Col
                    key={tile.path || `tile-${index}`}
                    sm={4}
                    className="col-6"
                  >
                    <div className="home-icon-wrap text-center mb30">
                      <Link to={tile.path}>
                        <img src={tile.icon} alt="" />
                        <h4 className="mt-2">{tile.label}</h4>
                      </Link>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          <Col lg={5}>
            <div className="homr_logo ">
              <img src={DashboardLogo} alt="" />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
