import React, { Component } from 'react'
import {
  Column,
  ColumnChooser,
  HeaderFilter,
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
      focusedRowKey: 1,
      selectedRowOutput: ''
    }
    this.onFocusRowChange = this.onFocusRowChange.bind(this);
  }

  async onFocusRowChange(e) {
    const selectorName = e.row.data && e.row.data.name;

    const stringToEvaluate = `__RESELECT_TOOLS__.evaluateSelector('${selectorName}')`;


    if(chrome) {
      const { devtools: { inspectedWindow } } = chrome;
      inspectedWindow.eval(stringToEvaluate, async (resultStr, err) => {
        const result = await resultStr;

        if (err && err.isException) {
          console.error(err.value);
          this.setState({
            focusedRowKey: e.component.option('focusedRowKey'),
          })
        } else {
          console.log(result);
          this.setState({
            focusedRowKey: e.component.option('focusedRowKey'),
          })
        }
      });
    }
  }

  render() {
    const { selectors } = this.props;

    const { focusedRowKey, selectedRowOutput } = this.state;
    return (
      <div className="App" style={{backgroundColor: 'white', width: '100%'}}>
        <TreeList
          id="selectors"
          dataSource={selectors}
          focusedRowKey={focusedRowKey}
          focusedRowEnabled={true}
          showRowLines={true}
          showBorders={true}
          columnAutoWidth={true}
          autoExpandAll={false}
          itemsExpr="dependencies"
          dataStructure="tree"
          onFocusedRowChanged={this.onFocusRowChange}
        >
          <HeaderFilter visible={true} />
          <Scrolling
            mode="standard" />
          <Paging
            enabled={true}
            defaultPageSize={50} />
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
          <ColumnChooser enabled={true} mode="select" />
        </TreeList>
        {
          <div className="task-info">
            <div className="info">
              <span>Output: </span>
              <span>{selectedRowOutput}</span>
            </div>
          </div>
        }
      </div>
    );
  }
}
