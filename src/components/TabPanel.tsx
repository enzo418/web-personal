import React, { CSSProperties } from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    style?: CSSProperties | undefined;
}

export default function TabPanel(props: TabPanelProps) {
    const { children, value, index, style, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={style}
            {...other}>
            {children}
        </div>
    );
}
