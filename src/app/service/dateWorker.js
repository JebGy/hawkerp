let currenthour = new Date();

/**
 * 
 * @returns Retorna la fecha actual
 */
export const getCurrenthour = () => {
  return currenthour.toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric" })
}