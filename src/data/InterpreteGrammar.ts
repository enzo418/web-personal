const grammar = `Programa 	→ var Variables { Cuerpo }
Variables 	→ id IdVar
IdVar 		→ ,id IdVar | epsilon
Cuerpo	→ Sent Cuerpo | epsilon
Sent		→ id = OpAritmeticas | leer(cadena, id) | escribir(cadena, OpAritmeticas) | mientras(Condiciones ){Cuerpo} |  si(Condiciones ){Cuerpo}Sino
Condiciones 	→  Cond3 B A
A		→ or Condicones | epsilon
B		→ and Cond3 B | epsilon			
Cond3 -> not Cond3 | [Condiciones] | OpAritmeticas opRel OpAritmeticas
Sino		→ sino{Cuerpo} | epsilon	
OpAritmeticas →  T W
W		→ +TW |-T W | epsilon
T		 →   F Z
Z		→ *F Z |/F Z | epsilon
F		 →  rcd(OpAritmeticas) X | R X
X		→ ^ R X | epsilon | % R X
R → id | constante | (OpAritmeticas) | -R`;

export interface IGrammarRule {
    symbol: string;
    productions: string[];
}

const grammarRules: IGrammarRule[] = [];

const lines = grammar.split('\n');

for (const line of lines) {
    let [symbol, _, prod] = line.split(/→|(\-\>)/);
    symbol = symbol.trim();
    let productions = prod.split('|').map(p => p.trim());

    grammarRules.push({ symbol, productions });
}

export default grammarRules;
