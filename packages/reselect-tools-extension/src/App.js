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
      selectedRowSelector: '',
      selectedRowStateSlices: [],
      selectedRowStateAction: '',
    };
    this.onFocusRowChange = this.onFocusRowChange.bind(this);
    this.refreshAll = this.refreshAll.bind(this);
    this.refreshLatestSelectedSelector = this.refreshLatestSelectedSelector.bind(this);

  }

  componentDidMount() {
    if(chrome) {
      const { devtools: { inspectedWindow }, runtime } = chrome;

      runtime.onMessageExternal.addListener(
      (request, sender, sendResponse) => {
        console.log(request, sender, sendResponse);
        if (request.data.output){
          this.setState({
            selectedRowOutput: request.data.output
          })
        } else if(request.data.slices && request.data.action) {
          this.setState({
            selectedRowStateSlices: request.data.slices,
            selectedRowStateAction: request.data.action,
          })
        }
      });

      const stringToEvaluate = `__RESELECT_TOOLS__.setChromeRuntimeId('${chrome.runtime.id}')`;

      inspectedWindow.eval(stringToEvaluate, (resultStr, err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`RESELECT_TOOLS_EXTENSION - setup chrome extension with id': ${chrome.runtime.id}`);
        }
      });
    }
  }

  onFocusRowChange(e) {
    if (e.row && e.row.data) {

      const {name, selector: { dependencies = []}} = e.row.data;

      const selectorName = name || '';

      const input = dependencies.map(dep => dep.selectorName || 'anonymous');

      if(selectorName) {
        const stringToEvaluate = `__RESELECT_TOOLS__.evaluateSelector('${selectorName}')`;

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
              if (err) {
                console.log(err);
              } else {
                console.log(`RESELECT_TOOLS_EXTENSION - requested output value for': ${selectorName} `);
              }
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
    if(this.state.selectedRowName.length > 0){
      const stringToEvaluate = `__RESELECT_TOOLS__.evaluateSelector('${this.state.selectedRowName}', '${chrome.runtime.id}')`;
      if(chrome) {
        const { devtools: { inspectedWindow } } = chrome;
        inspectedWindow.eval(stringToEvaluate);
      }
    }
  }

  getTotalRecomputations(selectors) {
    if(selectors.length > 0) {
      return selectors.reduce((acc, selector) => {
        return acc + selector.recomputations + this.getTotalRecomputations(selector.dependencies)
      }, 0);
    } else {
      return 0
    }
  }

  render() {
    const { selectors, focusedRowKey, selectedRowOutput, selectedRowInput, selectedRowStateSlices, selectedRowStateAction } = this.state;

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
                <h3>Redux - Slices: </h3>
                {selectedRowStateSlices.map((slice) => `${slice} -->` )}
                <h3>State Action: </h3>
                <pre>{JSON.stringify(selectedRowStateAction, null, 2)}</pre>
              </div>
              <div className="info">
                <h3>Total Recomputations:</h3>
                <p>{this.getTotalRecomputations(selectors)}</p>
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
