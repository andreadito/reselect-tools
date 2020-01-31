import React, { Component } from 'react';
import { TreeList, Column, SearchPanel, ColumnChooser, Scrolling, Paging, Pager, HeaderFilter } from 'devextreme-react/tree-list';
export default class App extends Component {

  flatSelectors(selectors) {
    return []
  }

  renderSelector({ name, dependencies, value, recomputations }) {
    return (<li>
      <span>Name: {name}</span>
      <div>
        <span>Deps:</span>
        <ul>{dependencies.map(dep => this.renderSelector(dep))}</ul>
      </div>
      <span>Value: {value}</span>
      <span>Recomputations: {recomputations}</span>
    </li>)
  }

  render() {
    const { selectors } = this.props;
    return (
      <div className="App" style={{backgroundColor: 'white', width: '100%'}}>
        <TreeList
          id="selectors"
          dataSource={selectors}
          defaultExpandedRowKeys={[1]}
          showRowLines={true}
          showBorders={true}
          columnAutoWidth={true}
          autoExpandAll={false}
          itemsExpr="dependencies"
          dataStructure="tree"
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
            dataField="output"
            dataType="Output"
            hidingPriority={1}
          />
          <Column
            dataField="recomputations"
            dataType="Recomputations"
            hidingPriority={2}
          />
          <ColumnChooser enabled={true} mode="select" />
        </TreeList>
      </div>
    );
  }
}
