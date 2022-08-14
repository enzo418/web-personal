import React, { useEffect, useRef, useState } from 'react';
import getEdgesNodesFromSyntaxTree from '../utils/parseSyntaxTree';

import { DataSet } from 'vis-data/peer';
import { Network } from 'vis-network/peer';
import 'vis-network/styles/vis-network.css';
import { DataSetInitialOptions } from 'vis-data/declarations/data-set';

interface IProps {
    tree: string;
}

let hasData = false;
let data: { edges: any; nodes: any } = {
    edges: [],
    nodes: [],
};

export default function SyntaxTree(props: IProps) {
    const container = useRef(null);

    var options = {
        physics: {
            enabled: false,
        },
        layout: {
            hierarchical: {
                enabled: true,
                direction: 'UD',
                sortMethod: 'directed',
            },
        },
    };

    console.log(props);

    useEffect(() => {
        var [pEdges, pNodes] = getEdgesNodesFromSyntaxTree(props.tree);

        console.log({ pEdges, pNodes });

        if (!hasData) {
            hasData = true;

            const nodes = new DataSet(pNodes as DataSetInitialOptions<'id'>);
            const edges = new DataSet(pEdges as DataSetInitialOptions<'id'>);

            data = {
                nodes,
                edges,
            };

            const network =
                container.current &&
                new Network(container.current, data, options);
        } else {
            data.edges.clear();
            data.nodes.clear();

            data.edges.add(pEdges);
            data.nodes.add(pNodes);
        }
    }, [props.tree]);

    return <div ref={container} style={{ height: '100%', width: '100%' }} />;
}
