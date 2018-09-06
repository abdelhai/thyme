// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Container from 'semantic-ui-react/dist/commonjs/elements/Container';
import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Sidebar from 'semantic-ui-react/dist/commonjs/modules/Sidebar';
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive';

import { clearAlert } from '../../actions/app';

import { getAlert } from '../../selectors/app';

import Account from '../Account';
import Notifier from '../Notifier';

import thyme from './Thyme.svg';
import './App.css';
import './print.css';

function AppLink(name, path, currentPath, exact = false) {
  return (
    <Link
      className={classnames('item', {
        active: exact
          ? currentPath === path
          : currentPath.indexOf(path) === 0,
      })}
      to={path}
    >
      {name}
    </Link>
  );
}

type AppType = {
  location: RouterLocation;
  children: any;
  alertMessage: string;
  onCloseAlert: () => void;
}

type AppState = {
  menuOpened: boolean;
}

class App extends Component<AppType, AppState> {
  state = {
    menuOpened: false,
  };

  handleToggle = () => {
    const { menuOpened } = this.state;

    this.setState({ menuOpened: !menuOpened });
  };

  handleClose = () => {
    this.setState({ menuOpened: false });
  };

  render() {
    const {
      location,
      children,
      alertMessage,
      onCloseAlert,
    } = this.props;
    const { menuOpened } = this.state;

    const MenuItems = (
      <Fragment>
        {AppLink('Timesheet', '/', location.pathname, true)}
        {AppLink('Reports', '/reports', location.pathname)}
        {AppLink('Projects', '/projects', location.pathname)}
        {AppLink('Settings', '/settings', location.pathname)}
        <Menu.Menu position="right">
          <Menu.Item>
            <Account />
          </Menu.Item>
        </Menu.Menu>
      </Fragment>
    );

    return (
      <div className="App">
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            inverted
            vertical
            visible={menuOpened}
            onHide={this.handleClose}
            width="thin"
            direction="right"
          >
            {MenuItems}
          </Sidebar>

          <Sidebar.Pusher dimmed={menuOpened}>
            <Menu fixed="top" inverted>
              <Container>
                <Menu.Item header>
                  <Image
                    size="mini"
                    src={thyme}
                    alt="Thyme"
                    style={{ width: 24, marginRight: '1.5em' }}
                  />
                  Thyme
                </Menu.Item>
                <Responsive as={Fragment} maxWidth={Responsive.onlyTablet.minWidth}>
                  <Menu.Item position="right" onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                </Responsive>
                <Responsive as={Fragment} minWidth={Responsive.onlyTablet.minWidth}>
                  {MenuItems}
                </Responsive>
              </Container>
            </Menu>
            <Container fluid style={{ marginTop: '5em', marginBottom: '2em' }}>
              <Modal
                open={alertMessage !== ''}
                onClose={onCloseAlert}
                content={alertMessage}
                size="mini"
                actions={[
                  { key: 'OK', content: 'OK', positive: true },
                ]}
              />
              <Notifier />

              {children}
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    alertMessage: getAlert(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCloseAlert() {
      dispatch(clearAlert());
    },
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(App);
