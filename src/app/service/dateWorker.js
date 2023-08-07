let currenthour = new Date();

export const getCurrenthour = () => {
  return currenthour.toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric" })
}