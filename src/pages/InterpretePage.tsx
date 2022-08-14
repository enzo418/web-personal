import {
    Box,
    Button,
    createTheme,
    Stack,
    styled,
    Tab,
    Tabs,
    ThemeProvider,
} from '@mui/material';
import React from 'react';
import * as monaco from 'monaco-editor';
import '../styles/InterpretePage.css';
import SendIcon from '@mui/icons-material/Send';
import SyntaxTree from '../components/SyntaxTree';
import TabPanel from '../components/TabPanel';

interface Shell {
    // eslint-disable-next-line no-unused-vars
    write: (message: string, termination?: string) => void;
    readValue: () => Promise<string>;
    writeProgramFinished: (code: number) => void;
    clear: () => void;
}

class ShellElement implements Shell {
    element: HTMLDivElement;
    promiseEnter: { resolve: any } = {
        resolve: undefined,
    };
    outputElement: HTMLDivElement;
    inputContainerElement: HTMLDivElement;
    inputElement: HTMLDivElement;

    constructor(element: HTMLDivElement) {
        this.element = element;
        this.outputElement = element.querySelector('.output');
        this.inputContainerElement = element.querySelector(
            '.shell-input-container',
        );
        this.inputElement =
            this.inputContainerElement.querySelector('.shell-input');

        this.element.addEventListener('keydown', event => {
            if (event.key === 'Enter' && this.promiseEnter.resolve) {
                this.promiseEnter.resolve();
            }
        });

        this.element.addEventListener('click', () => {
            if (!this.inputContainerElement.classList.contains('hidden')) {
                this.inputElement.focus();
            }
        });
    }

    write(message = '', termination = '') {
        this.outputElement.innerHTML += (
            message.replaceAll(' ', '&nbsp;') + termination
        ).replaceAll('\n', '<br>');
        this.outputElement.scrollTop = this.element.scrollHeight; // focus on bottom
    }

    // returns the readed value
    async readValue() {
        this.inputElement.innerText = '';
        this.inputContainerElement.classList.remove('hidden');
        this.inputElement.style.minWidth =
            this.element.getBoundingClientRect().width + 'px';

        this.inputElement.focus();

        await this.__OnEnterPressed();

        var value = this.inputElement.innerText;

        this.inputContainerElement.classList.add('hidden');

        this.outputElement.innerText =
            this.outputElement.innerText.substring(
                0,
                this.outputElement.innerText.length - 1,
            ) +
            value +
            '\n';

        this.write();

        return value;
    }

    writeProgramFinished(code: number) {
        this.outputElement.innerText += '\n\n';
        this.outputElement.innerHTML += `<span class="program-finished ${
            code > 0 ? 'exec-error' : ''
        }">Executed with code ${code}</span>`;
    }

    clear() {
        this.outputElement.innerHTML = '';
    }

    getFlatOutput() {
        return this.outputElement.innerText.replaceAll(/\n|\t|\s/g, '');
    }

    // # -> itsn't supported
    __OnEnterPressed() {
        return new Promise(resolve => (this.promiseEnter = { resolve }));
    }
}

interface IInterpreteError {
    line: number;
    column: number;
    length: number;
    message: string;
}

type onInterpreteErrorCabllack = (error: IInterpreteError) => any;
type onInterpreteUpdateSyntaxTreeCabllack = (tree: string) => any;

class Interprete {
    lastPrintBeforeWrite = '';
    shell: Shell;
    errorCallbacks: onInterpreteErrorCabllack[];
    updateSyntaxTreeCallbacks: onInterpreteUpdateSyntaxTreeCabllack[];

    constructor(shell: Shell) {
        this.shell = shell;
        this.errorCallbacks = [];
        this.updateSyntaxTreeCallbacks = [];
    }

    async writeMessageReadValue(message: string) {
        this.shell.write(message, '\n');
        return new Promise(async (resolve, rej) => {
            var value = await this.shell.readValue();
            setTimeout(async () => {
                resolve(parseFloat(value));
            }, 100);
        });
    }

    writeMessage(message: string) {
        this.shell.write(message);
    }

    subscribeToErrors(callback: onInterpreteErrorCabllack) {
        this.errorCallbacks.push(callback);
    }

    addErrorMarker(
        line: number,
        column: number,
        length: number,
        message: string,
    ) {
        const error: IInterpreteError = {
            line,
            column,
            length,
            message,
        };

        console.log({ error });

        this.errorCallbacks.forEach(cb => {
            cb(error);
        });
    }

    subscribeToSyntaxTreeUpdate(cb: onInterpreteUpdateSyntaxTreeCabllack) {
        this.updateSyntaxTreeCallbacks.push(cb);
    }

    setSyntaxTree(tree: string) {
        var cpTree = tree.trim();
        this.updateSyntaxTreeCallbacks.forEach(cb => {
            cb(cpTree);
        });
    }
}

declare module globalThis {
    // eslint-disable-next-line no-unused-vars
    var interprete: Interprete;
    // eslint-disable-next-line no-unused-vars
    var Module: any;
}

interface IProps {}

interface IState {
    syntaxTree: string;
    tabSelected: number;
    running: boolean;
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default class InterpretePage extends React.Component<IProps, IState> {
    state = {
        syntaxTree: '',
        tabSelected: 0,
        running: false,
    };

    inputSourceElement: any;
    outputElement: any;
    codeEditor: monaco.editor.IStandaloneCodeEditor;

    constructor(props: IProps) {
        super(props);
        this.inputSourceElement = React.createRef();
        this.outputElement = React.createRef();

        this.handleTabChange = this.handleTabChange.bind(this);
    }

    Root = styled('div')(({ theme }) => ({
        padding: theme.spacing(1),
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
        },
    }));

    EditorContainer = styled('div')(({ theme }) => ({
        padding: theme.spacing(1),
        [theme.breakpoints.down('md')]: {
            width: '95vw',
            height: '70vh',
        },
        [theme.breakpoints.up('md')]: {
            width: '50vw',
            height: '95vh',
        },
    }));

    RightPanelContainer = styled('div')(({ theme }) => ({
        padding: theme.spacing(1),
        [theme.breakpoints.down('md')]: {
            width: '95vw',
            height: '70vh',
        },
        [theme.breakpoints.up('md')]: {
            width: '50vw',
            height: '95vh',
        },
    }));

    componentDidMount() {
        var interprete = new Interprete(
            new ShellElement(this.outputElement.current),
        );

        globalThis.interprete = interprete;
        globalThis.interprete.subscribeToErrors(this.setError.bind(this));
        globalThis.interprete.subscribeToSyntaxTreeUpdate(
            this.setTree.bind(this),
        );

        if (!this.codeEditor) {
            var editor = monaco.editor.create(this.inputSourceElement.current, {
                value: 'var n, i {\n  n = 418 / 2\n  i = 3\n  mientras(i > 0) {\n    escribir("Hola!: ", n * 2)\n    i = i - 1\n  }\n  leer("H: ", n)\n}',
                language: 'factorial',
                minimap: {
                    enabled: false,
                },
                theme: 'factorial-theme',
            });

            this.codeEditor = editor;
        }
    }

    setError(error: IInterpreteError) {
        monaco.editor.setModelMarkers(this.codeEditor.getModel(), 'owner', [
            {
                startLineNumber: error.line,
                endLineNumber: error.line,
                startColumn: error.column,
                endColumn: error.column + error.length,
                message: error.message,
                severity: monaco.MarkerSeverity.Error,
            },
        ]);
    }

    setTree(tree: string) {
        this.setState({ syntaxTree: tree });
    }

    onExit(code: number) {
        globalThis.interprete.shell.writeProgramFinished(code);
        this.setState({ running: false });
    }

    run() {
        this.setState({ running: true });

        monaco.editor.removeAllMarkers('owner');
        globalThis.interprete.shell.clear();

        globalThis.Module.onExit = this.onExit.bind(this);

        var exec;
        var error;

        try {
            exec = globalThis.Module.Interprete.Interpretar(
                this.codeEditor.getValue(),
            );
        } catch (e) {
            error = e;
        }

        console.log({ exec });
        if (
            typeof exec === 'object' &&
            typeof exec.then === 'function' && // is promise?
            !error
        ) {
            exec.then(() => this.onExit(0)).catch(
                (exit: { message: string; name: string; status: number }) =>
                    this.onExit(exit.status || 1),
            );
        } else if (error) {
            this.onExit(1);
        } else {
            // if exec == undefined it stoped, executed it and returned wathever we returned from c++
            this.onExit(0);
        }
    }

    handleTabChange(event: React.SyntheticEvent, newValue: number) {
        this.setState({ tabSelected: newValue });
    }

    a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    render() {
        return (
            <ThemeProvider theme={darkTheme}>
                <this.Root
                    className="black-background"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        backgroundColor: '#090909eb',
                        color: '#fff',
                        overflow: 'hidden',
                    }}>
                    <this.EditorContainer className="editor-container">
                        <div
                            ref={this.inputSourceElement}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: '1px solid grey',
                            }}></div>
                    </this.EditorContainer>
                    <this.RightPanelContainer
                        style={{
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={this.state.tabSelected}
                                onChange={this.handleTabChange}
                                aria-label="tabs: show output or syntax three">
                                <Tab label="Output" {...this.a11yProps(0)} />
                                <Tab
                                    label="Syntax Tree"
                                    {...this.a11yProps(1)}
                                />
                            </Tabs>
                        </Box>
                        <TabPanel
                            value={this.state.tabSelected}
                            index={0}
                            style={{
                                padding: '8px 0',
                                width: '100%',
                                height: '80vh',
                                fontSize: '14px',
                                lineHeight: '22px',
                            }}>
                            <div
                                className="black-background output-container"
                                style={{
                                    width: '98%',
                                    height: '98%',
                                    padding: '8px',
                                }}
                                contentEditable={false}
                                ref={this.outputElement}>
                                <div className="output"></div>
                                <div className="shell-input-container hidden">
                                    <span className="shell-input-prefix">
                                        &gt;&nbsp;
                                    </span>
                                    <div
                                        className="shell-input"
                                        contentEditable={true}></div>
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel
                            value={this.state.tabSelected}
                            index={1}
                            style={{
                                padding: '8px 0',
                                width: '100%',
                                height: '80vh',
                            }}>
                            <SyntaxTree tree={this.state.syntaxTree} />
                        </TabPanel>
                        <Button
                            disabled={this.state.running}
                            onClick={() => this.run()}
                            endIcon={<SendIcon />}>
                            Run
                        </Button>
                    </this.RightPanelContainer>
                </this.Root>
            </ThemeProvider>
        );
    }
}
