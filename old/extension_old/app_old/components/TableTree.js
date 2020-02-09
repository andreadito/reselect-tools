import React, { Component, PropTypes } from 'react';
import { SortableTreeWithoutDndContext } from 'react-sortable-tree';

export default class TableTree extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired
    };

    render() {
        return (
            <SortableTreeWithoutDndContext
                treeData={[]}
                onChange={console.log}
            />
        )
    }
}