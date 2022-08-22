import React from 'react';
import { Typography } from '@mui/material';

interface IProps {}

import grammarRules from '../data/InterpreteGrammar';
import { Box } from '@mui/system';

import '../styles/InterpreteGrammar.css';

export default function InterpreteGrammar(props: IProps) {
    return (
        <>
            <Typography
                className="underline"
                variant="h4"
                sx={{ margin: '16px 0 8px 0;' }}>
                LL(1):
            </Typography>
            <Box className="rules">
                {grammarRules.map(rule => {
                    return (
                        <Box className="rule">
                            <Typography className="rule-symbol">
                                {rule.symbol}
                            </Typography>
                            <Box className="rule-productions">
                                {rule.productions.map(prod => {
                                    return (
                                        <Typography className="rule-production">
                                            {prod}
                                        </Typography>
                                    );
                                })}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </>
    );
}
