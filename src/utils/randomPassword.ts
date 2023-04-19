export const randomPassword = (longitud: number): string => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$&#$-@'
  let password = ''
  for (let i = 0; i < longitud; i++) {
    const posicion = Math.floor(Math.random() * caracteres.length)
    password += caracteres.charAt(posicion)
  }
  return password
}
