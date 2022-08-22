export interface Example {
    name: string;
    type: 'program' | 'error';
    code: string;
    description: any;
}

const examples: Example[] = [
    {
        name: 'Languague showcase',
        type: 'program',
        description:
            'Shows all the operations, method and statements of the language',
        code: `var basic, sqrt, module, power, n {\n  basic = 1 + 2 * 4 / 5\n  escribir("basic: ", basic)\n\n  sqrt = rcd(2)\n  escribir("sqrt of 2: ", sqrt)\n\n  module = 3 % 15\n  escribir("module 15 % 3: ", module)\n\n  power = 2 ^ 4\n  escribir("power 2 to 4: ", power)\n\n  si (power * 2 > sqrt ^ 0.5\n      and [\n          module <> 0 or basic > 2 \n          and [not sqrt < 0]]\n      ) {\n    escribir("Path ", 1)\n  } sino {\n    escribir("Path ", 2)\n  }\n\n  mientras(n <> 418) {\n    leer("Please, enter 418 ", n)\n  }\n\n  escribir("Thanks. ", 2)\n}`,
    },
    {
        name: 'Calculate the n-th number of the fibonnacci sequence',
        type: 'program',
        description: 'Calculates the n-th number of the fibonnacci sequence',
        code: `var n, actual, ant1, ant2, i\n{\n  n = 1200\n  ant1 = 1\n  ant2 = 1\t\t\n  \n  si (n == 0 or n == 1) {\n    actual = 1\n  } sino {\n    i = 2\n    mientras(i <= n){\n      actual = ant1 + ant2\n      ant2 = ant1\n      ant1 = actual\n\n      i = i + 1\n    }\n  }\n\n  escribir("Resultado: ", actual)\n}`,
    },
    {
        name: 'Calculate the least common multiple between two numbers',
        type: 'program',
        description: 'Calculates the least common multiple between two numbers',
        code: `var n1, n2, ultimoDividendo, aux, resto, mcd, mcm\n{\n    leer("Ingrese el primer numero: ", n1)\n    leer("Ingrese el segundo numero: ", n2)\n\n    resto = n1 % n2\n\n    ultimoDividendo = n2\n\n    mientras(resto <> 0){\t\n        aux = resto\t\n\n        resto = ultimoDividendo % resto\n\n        ultimoDividendo = aux\n    }\n\n    mcd = ultimoDividendo\n\n    mcm = (n1 * n2) / mcd\n\n    escribir("MCM: ", mcm)\n}`,
    },
    {
        name: 'Fizz-buzz',
        type: 'program',
        description: 'An implementation of the fizz-buzz quiz',
        code: `var n, i\n{\n  leer("Hasta que n?: ", n)\n\n  i = 1\n  \n  mientras(i < n) {\n    si (i % 15 == 0) {\n      escribir("Fizz Buzz -> ", i)\n    } sino {\n      si (i % 3 == 0) {\n        escribir("Fizz      -> ", i)\n      } sino {\n        si (i % 5 == 0) {\n          escribir("Buzz      -> ", i)\n        } sino {\n          escribir("             ", i)\n        }\n      }\n    }\n    i = i+1\n  }\n}`,
    },
    {
        name: 'Undefined variable',
        type: 'error',
        description:
            'Example of how the compiler-IDE handles an undefined variable.\nAfter running it you can see in the syntax tree, everything seems to be fine but at runtime when it reaches the "mientras" ("while") statement it stops and sends an error',
        code: `var i\n{\n  i = 1\n  \n  mientras(i < n) {\n      escribir("...", i)\n  }\n}`,
    },
    {
        name: 'Unexpected token',
        type: 'error',
        description:
            'This example stops the syntactic parser due to the "#" not beign the assignment symbol',
        code: `var i\n{\n    i # 1\n}`,
    },
];

export default examples;
