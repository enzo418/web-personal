import { Box, Button, Stack, styled } from '@mui/material';
import React from 'react';
import * as monaco from 'monaco-editor';
import '../styles/InterpretePage.css';
import SendIcon from '@mui/icons-material/Send';

interface Shell {
    // eslint-disable-next-line no-unused-vars
    write: (message: string, termination?: string) => void;
    readValue: () => Promise<string>;
}

class ShellElement implements Shell {
    element: HTMLTextAreaElement;
    promiseEnter: { resolve: any } = {
        resolve: undefined,
    };

    constructor(element: HTMLTextAreaElement) {
        this.element = element;

        this.element.addEventListener('keydown', event => {
            if (event.key === 'Enter' && this.promiseEnter.resolve) {
                this.promiseEnter.resolve();
            }
        });
    }

    write(message = '', termination = '\n') {
        this.element.value += message + termination;
        this.element.scrollTop = this.element.scrollHeight; // focus on bottom
    }

    // returns the readed value
    async readValue() {
        var length_before = this.getFlatOutput().length;

        this.element.removeAttribute('readonly');
        this.element.focus();

        await this.__OnEnterPressed();

        this.element.setAttribute('readonly', 'true');

        var flat_output = this.getFlatOutput();
        var length_after = flat_output.length;
        var value = flat_output.substring(length_before, length_after);

        this.write();

        return value;
    }

    getFlatOutput() {
        return this.element.value.replaceAll(/\n|\t|\s/g, '');
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

class Interprete {
    lastPrintBeforeWrite = '';
    shell: Shell;
    errorCallbacks: onInterpreteErrorCabllack[];

    constructor(shell: Shell) {
        this.shell = shell;
        this.errorCallbacks = [];
    }

    async writeMessageReadValue(message: string) {
        this.shell.write(message, '');
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
}

declare module globalThis {
    // eslint-disable-next-line no-unused-vars
    var interprete: Interprete;
    // eslint-disable-next-line no-unused-vars
    var Module: any;
}

interface IProps {}

interface IState {}

export default class InterpretePage extends React.Component<IProps, IState> {
    state = {};

    inputSourceElement: any;
    outputElement: any;
    codeEditor: monaco.editor.IStandaloneCodeEditor;

    constructor(props: IProps) {
        super(props);
        this.inputSourceElement = React.createRef();
        this.outputElement = React.createRef();
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
            width: '70vw',
            height: '95vh',
        },
    }));

    componentDidMount() {
        var interprete = new Interprete(
            new ShellElement(this.outputElement.current),
        );

        globalThis.interprete = interprete;
        globalThis.interprete.subscribeToErrors(this.setError.bind(this));

        if (!this.codeEditor) {
            var editor = monaco.editor.create(this.inputSourceElement.current, {
                value: 'var n1, n2, ultimoDividendo, aux, resto, mcd, mc\n{\n\tleer("Ingrese el primer numero: ", n1)\n\tleer("Ingrese el segundo numero: ", n2)\n\n\tresto = n1 % n2\n\n\tultimoDividendo = n2\n\n\tmientras(resto <> 0){\t\n\t\taux = resto\t\n\n\t\tresto = ultimoDividendo % resto\n\n\t\tultimoDividendo = aux\n\t}\n\n\tmcd = ultimoDividendo\n\n\tmcm = (n1 * n2) / mcd\n\n\tescribir("MCM: ", mcm)\n}',
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

    run() {
        this.outputElement.current.value = '';
        globalThis.Module.Interprete.Interpretar(this.codeEditor.getValue());
        monaco.editor.removeAllMarkers('owner');
    }

    render() {
        return (
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
                <div style={{ padding: '8px', width: '95vw', height: '100vh' }}>
                    <textarea
                        className="black-background"
                        style={{ width: '100%', height: '85vh' }}
                        readOnly={true}
                        rows={8}
                        ref={this.outputElement}></textarea>
                    <Button onClick={() => this.run()} endIcon={<SendIcon />}>
                        Run
                    </Button>
                </div>
            </this.Root>
        );
    }
}
