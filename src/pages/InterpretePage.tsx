import { Box, Button, Stack, styled } from '@mui/material';
import React from 'react';
import * as monaco from 'monaco-editor';
import '../styles/InterpretePage.css';

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

class Interprete {
    lastPrintBeforeWrite = '';
    shell: Shell;

    constructor(shell: Shell) {
        this.shell = shell;
    }

    async writeMessageReadValue(message: string) {
        this.shell.write(message, '');
        return new Promise(async (resolve, rej) => {
            var value = await this.shell.readValue();
            resolve(value);
        });
    }

    writeMessage(message: string) {
        this.shell.write(message);
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
    codeEditor: monaco.editor.IStandaloneCodeEditor;
}

let editorInitiated = false;

export default class InterpretePage extends React.Component<IProps, IState> {
    state = {
        codeEditor: null as monaco.editor.IStandaloneCodeEditor, // ¿problem?
    };

    inputSourceElement: any;
    outputElement: any;

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
            flexDirection: 'column',
        },
        [theme.breakpoints.up('lg')]: {
            flexDirection: 'row',
        },
    }));

    componentDidMount() {
        var interprete = new Interprete(
            new ShellElement(this.outputElement.current),
        );

        globalThis.interprete = interprete;

        if (!editorInitiated) {
            editorInitiated = true; // don't use state here
            var editor = monaco.editor.create(this.inputSourceElement.current, {
                value: 'var n1, n2, ultimoDividendo, aux, resto, mcd, mc\n{\n\tleer("Ingrese el primer numero: ", n1)\n\tleer("Ingrese el segundo numero: ", n2)\n\n\tresto = n1 % n2\n\n\tultimoDividendo = n2\n\n\tmientras(resto <> 0){\t\n\t\taux = resto\t\n\n\t\tresto = ultimoDividendo % resto\n\n\t\tultimoDividendo = aux\n\t}\n\n\tmcd = ultimoDividendo\n\n\tmcm = (n1 * n2) / mcd\n\n\tescribir("MCM: ", mcm)\n}',
                language: 'factorial',
                minimap: {
                    enabled: false,
                },
                theme: 'factorial-theme',
            });

            this.setState({ codeEditor: editor });
        }
    }

    run() {
        this.outputElement.current.value = '';
        globalThis.Module.Interprete.Interpretar(
            this.state.codeEditor.getValue(),
        );
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
                <div className="editor-container">
                    <div
                        ref={this.inputSourceElement}
                        style={{
                            width: '100vw',
                            height: '70vh',
                            border: '1px solid grey',
                        }}></div>
                </div>
                <div>
                    <Button onClick={() => this.run()}>Run</Button>
                    <textarea
                        className="black-background"
                        style={{ width: '100%' }}
                        rows={8}
                        ref={this.outputElement}></textarea>
                </div>
            </this.Root>
        );
    }
}
