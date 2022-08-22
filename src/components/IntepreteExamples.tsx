import React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, ListSubheader, MenuItem, Typography } from '@mui/material';
import examples, { Example } from '../data/InterpreteExamples';
import '../styles/InterpreteExamples.css';

interface IProps {
    exampleSelected?: Example;
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
                value={props.exampleSelected?.name || ''}
                label="Examples"
                onChange={handleChange}
                style={{ width: '100%' }}>
                <MenuItem value="">None</MenuItem>
                {...elements}
            </Select>
            {props.exampleSelected && (
                <>
                    <Typography
                        className="underline"
                        variant="h4"
                        sx={{ margin: '16px 0 8px 0;' }}>
                        Description:
                    </Typography>
                    <Typography>{props.exampleSelected.description}</Typography>
                </>
            )}
        </Box>
    );
}
