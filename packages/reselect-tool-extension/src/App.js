import React, { Component } from 'react'

import {
  Column,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  TreeList
} from 'devextreme-react/tree-list'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectors: props.selectors || [],
      focusedRowKey: 1,
      selectedRowInput: [],
      selectedRowOutput: '',
      selectedRowName: '',
      selectedRowSelector: ''
    };
    this.onFocusRowChange = this.onFocusRowChange.bind(this);
    this.refreshAll = this.refreshAll.bind(this);
    this.refreshLatestSelectedSelector = this.refreshLatestSelectedSelector.bind(this);

  }

  componentDidMount() {
    chrome.runtime.onMessageExternal.addListener(
      (request, sender, sendResponse) => {
        this.setState({
          selectedRowOutput: request.data.output
        })
      });
  }

  onFocusRowChange(e) {
    const {name = '', selector: { dependencies = []}} = e.row && e.row.data && e.row.data;

    const selectorName = name;
    const input = dependencies.map(dep => dep.selectorName);

    if(selectorName) {
      const stringToEvaluate = `__RESELECT_TOOLS__.evaluateSelector('${selectorName}', '${chrome.runtime.id}')`;

      // TODO: Print Selector Code
      this.setState({
        focusedRowKey: e.component.option('focusedRowKey'),
        selectedRowName: selectorName,
        selectedRowInput: input,
        selectedRowSelector: ''
      }, () => {

        if(chrome) {
          const { devtools: { inspectedWindow } } = chrome;
          inspectedWindow.eval(stringToEvaluate, (resultStr, err) => {
            console.log(`RESELECT_TOOLS_EXTENSION - requested output value for': ${selectorName} `);
          });
        }
      })
    }
    else {
      this.setState({
        focusedRowKey: e.component.option('focusedRowKey'),
      })
    }
  }
  
  refreshAll() {
    const stringToEvaluate = `__RESELECT_TOOLS__.getAllGoodSelectorsTableData()`;

    if(chrome) {
      const { devtools: { inspectedWindow } } = chrome;
      inspectedWindow.eval(stringToEvaluate, (resultStr, err) => {
        this.setState({
          selectors: resultStr,
        })
      });
    }
  }

  refreshLatestSelectedSelector() {
    if(this.state.selectedSelector.length > 0){
      const stringToEvaluate = `__RESELECT_TOOLS__.evaluateSelector('${this.state.selectedRowName}', '${chrome.runtime.id}')`;
      if(chrome) {
        const { devtools: { inspectedWindow } } = chrome;
        inspectedWindow.eval(stringToEvaluate);
      }
    }
  }

  getTotalRecomputation(selectors) {
    if(selectors.length > 0) {
      return selectors.reduce((acc, selector) => {
        return acc + selector.recomputations + this.getTotalRecomputation(selector.dependencies)
      }, 0);
    } else {
      return 0
    }
  }

  render() {
    const { selectors } = this.state;

    const { focusedRowKey, selectedRowOutput, selectedRowInput, selectedRowSelector } = this.state;

    if(selectors.length > 0) {
      return (
        <div className="App" style={{backgroundColor: 'white', width: '100%'}}>
          <div className={'app-controls app-controls-fixed'}>
            <button className={'app-control-button'} onClick={this.refreshAll}> 🆕 Refresh All</button>
          </div>
          <div className={'app-container'}>
            <div className={'dx-viewport'}>
              <TreeList
                  id="selectors"
                  dataSource={selectors}
                  focusedRowKey={focusedRowKey}
                  focusedRowEnabled={true}
                  showRowLines={true}
                  showBorders={true}
                  columnAutoWidth={false}
                  autoExpandAll={false}
                  itemsExpr="dependencies"
                  dataStructure="tree"
                  onFocusedRowChanged={this.onFocusRowChange}
              >
                <Scrolling
                    mode="standard" />
                <Paging
                    enabled={true}
                    defaultPageSize={10} />
                <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[10, 20, 50, 100]}
                    showInfo={true} />
                <SearchPanel visible={true} />
                <Column
                    dataField="name"
                    caption="Name" />
                <Column
                    dataField="recomputations"
                    dataType="Recomputations"
                    hidingPriority={2}
                />
              </TreeList>
            </div>
            <div className={'details'}>
              <div className="info">
                <h3>Input: </h3>
                <pre>{JSON.stringify(selectedRowInput, null, 2)}</pre>
                <h3>Output: </h3>
                <pre>{JSON.stringify(selectedRowOutput, null, 2)}</pre>
              </div>
              <div className="info">
                <h3>Total Recomputations:</h3>
                <p>{this.getTotalRecomputation(selectors)}</p>
              </div>
              <div className={'app-controls'}>
                <button className={'app-control-button'} onClick={this.refreshLatestSelectedSelector}> 👉 Refresh Selector</button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return 'Loading...'
    }

  }
}
