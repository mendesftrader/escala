//função para pegar os últimos 4 dígitos da identidade, será utilizado no login
export function quatroDigitos(identify: string){
    return identify.replace(/\D/g,"").slice(-4)
}