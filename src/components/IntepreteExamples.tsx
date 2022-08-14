import React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, ListSubheader, MenuItem } from '@mui/material';
import examples, { Example } from '../data/InterpreteExamples';

interface IProps {
    exampleSelected?: string;
    onChangeSelected: (ex: Example) => any;
}

export default function InterpreteExamples(props: IProps) {
    const handleChange = (event: SelectChangeEvent) => {
        const name = event.target.value as string;
        const exp = examples.find(e => e.name === name);
        props.onChangeSelected(exp);
    };

    const grouped = examples.reduce((prev, act) => {
        if (act.type in prev) {
            (prev as any)[act.type].push(act);
        } else {
            (prev as any)[act.type] = [act];
        }
        return prev;
    }, {});

    const elements: any = [];
    Object.entries(grouped).forEach((g: any) => {
        elements.push(<ListSubheader key={g[0]}>{g[0]}</ListSubheader>);

        g[1].forEach((ex: any) =>
            elements.push(
                <MenuItem key={ex.name} value={ex.name}>
                    {ex.name}
                </MenuItem>,
            ),
        );
    });

    return (
        <Box>
            <Select
                value={props.exampleSelected || ''}
                label="Example"
                onChange={handleChange}>
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {...elements}
            </Select>
        </Box>
    );
}
