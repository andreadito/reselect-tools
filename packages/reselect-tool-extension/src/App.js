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
      selectedRowOutput: '',
      selectedSelector: '',
    }
    this.onFocusRowChange = this.onFocusRowChange.bind(this);
    this.refresh = this.refresh.bind(this);
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
    const selectorName = e.row && e.row.data && e.row.data.name;

    if(selectorName) {
      const stringToEvaluate = `__RESELECT_TOOLS__.evaluateSelector('${selectorName}')`;

      this.setState({
        focusedRowKey: e.component.option('focusedRowKey'),
        selectedSelector: selectorName,
      }, () => {

        if(chrome) {
          const { devtools: { inspectedWindow } } = chrome;
          inspectedWindow.eval(stringToEvaluate, (resultStr, err) => {
            console.log(`waiting for the result of: ${selectorName} `);
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
  
  refresh() {
    const stringToEvaluate = `__RESELECT_TOOLS__.getAllGoodSelectorsTableData()`;

    if(chrome) {
      const { devtools: { inspectedWindow } } = chrome;
      inspectedWindow.eval(stringToEvaluate, (resultStr, err) => {
        console.log(resultStr);
        this.setState({
          selectors: resultStr,
        })
      });
    }
  }

  refreshLatestSelectedSelector() {
    if(this.state.selectedSelector){
      const stringToEvaluate = `__RESELECT_TOOLS__.evaluateSelector('${this.state.selectedSelector}')`;
      if(chrome) {
        const { devtools: { inspectedWindow } } = chrome;
        inspectedWindow.eval(stringToEvaluate, (resultStr, err) => {
          console.log(`waiting for the result of: ${this.state.selectedSelector} `);
        });
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

    const { focusedRowKey, selectedRowOutput } = this.state;

    if(selectors.length > 0) {
      return (
        <div className="App" style={{backgroundColor: 'white', width: '100%'}}>
          <div className={'app-controls'}>
            <button className={'app-control-button'} onClick={this.refresh}>Refresh</button>
          </div>
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
                defaultPageSize={20} />
              <Pager
                showPageSizeSelector={true}
                allowedPageSizes={[5, 10, 20, 50, 100]}
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
            {
              <div className="row-info">
                <div className={'app-controls'}>
                  <button className={'app-control-button'} onClick={this.refreshLatestSelectedSelector}>Refresh</button>
                </div>
                <div className="info">
                  <h3>Total Recomputations:</h3>
                  <p>{this.getTotalRecomputation(selectors)}</p>
                </div>
                <div className="info">
                  <h2>Output: </h2>
                  <pre>{JSON.stringify(selectedRowOutput, null, 4)}</pre>
                </div>
              </div>
            }
          </div>
        </div>
      );
    } else {
      return 'Loading...'
    }

  }
}
