// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import format from 'date-fns/format';
import FileSaver from 'file-saver';

import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';

import { importJSONData, alert, migrateStoreData } from '../../actions/app';

import { parseImportData, stateToExport, validData } from '../../core/importExport';

type ImportExportProps = {
  time: any;
  projects: any;
  reports: any;
  importData: (data: any) => void;
  alert: (message: string) => void;
}

type ImportExportState = {
  confirmImport: boolean;
};

class ImportExport extends Component<ImportExportProps, ImportExportState> {
  constructor() {
    super();

    // create file upload element
    const input = document.createElement('input');
    input.setAttribute('name', 'upload');
    input.setAttribute('type', 'file');

    input.addEventListener('change', this.handleFileChange.bind(this));

    this.uploadInput = input;
  }

  state = {
    confirmImport: false,
  };

  onCancelConfirm = () => this.setState({ confirmImport: false });
  importData = () => this.setState({ confirmImport: true });

  openImportInput = () => {
    // close confirm modal
    this.setState({ confirmImport: false });

    // open file dialog
    this.uploadInput.click();
  };

  exportData = () => {
    const { time, projects, reports } = this.props;

    const stateToSave = stateToExport({ time, projects, reports });

    const blob = new Blob(
      [JSON.stringify(stateToSave)],
      { type: 'application/json;charset=utf-8' },
    );

    FileSaver.saveAs(blob, `thyme-export_${format(new Date(), 'YYYY-MM-DD')}.json`);
  };

  handleImportData = (jsonString: string) => {
    try {
      const importData = parseImportData(JSON.parse(jsonString));

      if (!validData(importData)) {
        this.props.alert('The provided JSON is not a valid Thyme timesheet');
        return;
      }

      this.props.importData(importData);

      this.props.alert('Import successful');
    } catch (e) {
      this.props.alert(e.message);
    }
  };

  handleFileChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement && e.target.files instanceof FileList) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.handleImportData(ev.target.result);
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  uploadInput: HTMLInputElement;

  render() {
    const { confirmImport } = this.state;

    return (
      <Fragment>
        <Header as="h3">Export / Import</Header>
        <Button color="blue" onClick={this.exportData}>Export data</Button>
        <Button color="green" onClick={this.importData}>Import data</Button>
        <Confirm
          open={confirmImport}
          content="If you import data it will overwrite your current data. Wish to continue?"
          confirmButton="Import data"
          size="mini"
          onCancel={this.onCancelConfirm}
          onConfirm={this.openImportInput}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ time, projects, reports }) => ({ time, projects, reports });

function mapDispatchToProps(dispatch) {
  return {
    importData(data) {
      dispatch(importJSONData(data));
      dispatch(migrateStoreData());
    },

    alert(message: string) {
      dispatch(alert(message));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportExport);
