interface INode {
    id: number | string;
    label: any;
    level: number;
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
    var number = 0;
    var parsedArbol = arbol.trim();
    // para el id 0, los hijos son nivel 1
    var levels: Record<number, number> = { 0: 1 };

    const getMyLevel = (parentId: number) => levels[parentId];

    var lines = arbol.split('\n');

    // convert hex id to int id
    for (const line of lines) {
        var varProd = line.split('=');
        var variable = varProd[0].split('_');

        parsedArbol = parsedArbol.replaceAll(variable[0].trim(), '' + number);

        number++;
    }

    // console.log(parsedArbol);

    var esSimboloInicial = true;

    lines = parsedArbol.split('\n');
    for (const line of lines) {
        varProd = line.split(':');
        variable = varProd[0].split('_').map(s => s.trim());
        var producciones: string[] = [];

        if (esSimboloInicial) {
            nodes.push({
                id: variable[0],
                label: variable[1],
                level: 0,
            });

            esSimboloInicial = false;
        }

        if (varProd.length > 1) {
            producciones = varProd[1].split('$');
        }

        for (const prod of producciones) {
            if (prod.length > 1) {
                // quitamos el ¿ y el ? de la cadena y luego la dividimos por _
                var cadena = prod.replaceAll(/¿|\?/g, '').split('_');

                // imprimimos el id y el simbolo/lexema
                // console.log('\t\t\t ' + cadena[0] + ' ' + cadena[1]);

                // agregamos un nodo con id = cadena[0] y etiqueta el simbolo/lexema
                nodes.push({
                    id: cadena[0],
                    label: cadena[1],
                    level: getMyLevel(parseInt(variable[0])),
                });

                levels[parseInt(cadena[0])] =
                    getMyLevel(parseInt(variable[0])) + 1;

                // agregamos la relacion var -> simbolo
                edges.push({ from: variable[0], to: cadena[0] });
            }
        }
    }

    return [edges, nodes];
}
