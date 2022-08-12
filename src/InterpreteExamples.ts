export const examples = [
    {
        name: 'calculate the n-th number of the fibonnacci sequence',
        code: `var n, actual, ant1, ant2, i
        {
            n = 1200
            ant1 = 1
            ant2 = 1		
            
            si (n == 0 or n == 1) {
                actual = 1
            } sino {
                i = 2
                mientras(i <= n){
                    actual = ant1 + ant2
                    ant2 = ant1
                    ant1 = actual
        
                    i = i + 1
                }
            }
        
            escribir("Resultado: ", actual)
        }`,
    },
    {
        name: 'Calculate the least common multiple between two numbers',
        code: `var n1, n2, ultimoDividendo, aux, resto, mcd, mcm
        {
            leer("Ingrese el primer numero: ", n1)
            leer("Ingrese el segundo numero: ", n2)
        
            resto = n1 % n2
        
            ultimoDividendo = n2
        
            mientras(resto <> 0){	
                aux = resto	
        
                resto = ultimoDividendo % resto
        
                ultimoDividendo = aux
            }
        
            mcd = ultimoDividendo
        
            mcm = (n1 * n2) / mcd
        
            escribir("MCM: ", mcm)
        }`,
    },
    {
        name: 'fizz-buzz',
        code: `var n, i
        {
            leer("Hasta que n?: ", n)
        
            i = 1
            
            mientras(i < n) {
                si (i % 15 == 0) {
                    escribir("Fizz Buzz -> ", i)
                } sino {
                    si (i % 3 == 0) {
                        escribir("Fizz -> ", i)
                    } sino {
                        si (i % 5 == 0) {
                            escribir("Buzz -> ", i)
                        } sino {
                            escribir("", i)
                        }
                    }
                }
                i = i+1
            }
        }`,
    },
];
