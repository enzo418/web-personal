interface INode {
    id: number | string;
    label: any;
    level: number;
    title?: string;
} // https://visjs.github.io/vis-network/docs/network/nodes.html#

interface IEdge {
    from: number | string;
    to: number | string;
}

export default function getEdgesNodesFromSyntaxTree(
    arbol: string,
): (INode[] | IEdge[])[] {
    var edges: IEdge[] = [];
    var nodes: INode[] = [];

    if (arbol.length == 0) return [[], []];

    var number = 0;
    var parsedArbol = arbol.trim();
    // para el id 0, los hijos son nivel 1
    var levels: Record<number, number> = { 0: 1 };

    const getMyLevel = (parentId: number) => levels[parentId];

    var lines = arbol.split('\n');

    // convert hex id to int id
    for (const line of lines) {
        let variableID = line.split('_', 1)[0];

        parsedArbol = parsedArbol.replaceAll(variableID.trim(), '' + number);

        number++;
    }

    // console.log(parsedArbol);

    var esSimboloInicial = true;

    lines = parsedArbol.split('\n');
    for (const line of lines) {
        let [variable, produccionesString] = line.split(/:(.*)/s);
        let [variableID, variableSimbolo] = variable.split('_');

        if (esSimboloInicial) {
            nodes.push({
                id: variable[0],
                label: variable[1],
                level: 0,
            });

            esSimboloInicial = false;
        }

        let producciones: string[] = [];
        if (produccionesString.length > 1) {
            producciones = produccionesString
                .split('|')
                .filter(s => s.length > 0);
        }

        for (const prod of producciones) {
            // if (prod.length > 1) {
            // quitamos el ¿ y el ? de la cadena y luego la dividimos por _
            var { id, simbolo, lexema } = prod.match(
                /(?<id>\d+)\s(?<simbolo>[^\s]+)\s(?<lexema>.*)/,
            ).groups;

            // imprimimos el id y el simbolo/lexema
            // console.log('\t\t\t ' + cadena[0] + ' ' + cadena[1]);

            // agregamos un nodo con id = cadena[0] y etiqueta el simbolo/lexema
            let level = getMyLevel(parseInt(variableID));
            nodes.push({
                id,
                label: simbolo,
                level: level,
                title: lexema,
            });

            levels[parseInt(id)] = level + 1;

            // agregamos la relacion var -> simbolo
            edges.push({ from: variableID, to: id });
            // }
        }
    }

    return [edges, nodes];
}
