import * as monaco from 'monaco-editor';

/* BN notation:
    <Programa> 	    :== “var” <Variables> “{“ <Cuerpo> “}”
    <Variables>     :== “id” <IdVar>
    <IdVar> 	    :== “,” “id” <IdVar> | epsilon
    <Cuerpo>	    :== <Sent> <Cuerpo> | epsilon
    <Sent>	        :== “id”  “=” <OpAritmeticas>
                    | “leer” “(“ “cadena” “,” “id” “)” | “escribir” “(“ “cadena” “,” <OpAritmeticas> “)”
                    | “mientras” “(“ <Condiciones> “)” “{“ <Cuerpo> “}” | “si” “(“ <Condiciones> “)” “{“ <Cuerpo> “}” <Sino>
    <Condiciones>   :== <Cond2> “or” <Condiciones> | <Cond2>
    <Cond2>  	    :== <Cond3> “and” <Cond2> | <Cond3>
    <Cond3> 	    :== “not” <Cond3> | “[“ <Condiciones> “]”  | <OpAritmeticas> “opRel” <OpAritmeticas>
    <Sino>	        :== “sino” “{“ <Cuerpo> “}” | epsilon	
    <OpAritmeticas> :== <OpAritmeticas> “+” <T> | <OpAritmeticas>  “-” <T> | <T>
    <T> 		    :== <T>  “*” <F> | <T>  “/” <F> |<F>
    <F> 		    :== <F>  “^” <R> | “rcd” “(“ <OpAritmeticas> “)” | <R> | <F> “%” <R>
    <R> 		    :== “id” | “constante” | “(“ <OpAritmeticas> “)” | “-” <R>
*/

// guides: https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages

monaco.languages.register({ id: 'factorial' });

let keywords = 'var,si,sino,or,leer,escribir,mientras,and,not'.split(',');

monaco.languages.setMonarchTokensProvider('factorial', {
    keywords,
    tokenizer: {
        root: [
            [/>=?|<=?|==|\<\>/, 'relational-operator'], // https://github.com/enzo418/InterpreteLenguaje/blob/50f2a8a2eab0e0162b9412b4c0a20b9281a8cbfc/src/AnalizadorLexico/automatas.cpp#L257
            [/and|or|not/, 'logic-operator'],
            [/\+|\-|\%|\*|\/|\^|rcd/, 'operator'],
            [
                /@?[a-zA-Z][\w$]*/,
                {
                    cases: {
                        '@keywords': 'keyword',
                        '@default': 'variable',
                    },
                },
            ],
            [/\d+/, 'number'],
            [/".*?"/, 'string'],
            [/=/, 'asign-operator'],
            // [/\/\//, 'comment'],
        ],
    },
});

monaco.languages.registerCompletionItemProvider('factorial', {
    provideCompletionItems: (model, position, context, token) => {
        const word = model.getWordUntilPosition(position);
        const range: monaco.IRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        };

        let suggestions: monaco.languages.CompletionItem[] = [
            {
                label: 'leer',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'leer(${1:cadena}, ${2:id})',
                insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                        .InsertAsSnippet,
                range,
                documentation: 'funcion leer',
            },
            {
                label: 'escribir',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText:
                    'escribir(${1:cadena}, ${2:valor a escribir (id u operacion)})',
                insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                        .InsertAsSnippet,
                range,
                documentation: 'funcion escribir',
            },
            {
                label: 'mientras',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: ['mientras(${1:condicion}) {', '\t$0', '}'].join(
                    '\n',
                ),
                insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                        .InsertAsSnippet,
                range,
                documentation: 'bucle mientras',
            },
            {
                label: 'si-sino',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    'si (${1:condicion}) {',
                    '\t$0',
                    '} sino {',
                    '\t',
                    '}',
                ].join('\n'),
                insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                        .InsertAsSnippet,
                range,
                documentation: 'sentencia si-sino',
            },
        ];

        suggestions = suggestions.concat(
            ...keywords.map(k => {
                return {
                    label: k,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: k,
                    range,
                };
            }),
        );
        return { suggestions: suggestions };
    },
});

monaco.editor.defineTheme('factorial-theme', {
    base: 'vs-dark',
    inherit: false,
    rules: [
        { token: 'keyword', foreground: '8BE9FD' },
        { token: 'variable', foreground: '50FA7B' },
        { token: 'relational-operator', foreground: 'FFB86C' },
        { token: 'logic-operator', foreground: 'FF79C6' },
        { token: 'operator', foreground: 'BD93F9' },
        { token: 'string', foreground: 'FF5555' },
        { token: 'number', foreground: 'F1FA8C' },
        { token: 'asign-operator', foreground: 'FF79C6' },
    ],
    colors: {
        'editor.foreground': '#F8F8F2',
    },
});
