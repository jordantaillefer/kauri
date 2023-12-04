const RandomBgColor = [
  "#4DCCBD",
  "#FF8484",
  "#231651",
  "#F0544F",
  "#34D172",
  "#3A3335",
  "#D81E5B",
  "#44633F",
  "#3F4B3B",
  "#5CAB7D",
  "#504136",
  "#A49E8D",
  "#689689",
  "#087E8B",
  "#C1839F",
  "#3C3C3C",
  "#B0D7FF",
  "#44A3FF",
  "#76E489",
  "#4B1D3F",
  "#D62246",
]

export const randomBgColor = (nomSeance: string) => {
  const randomNumber = nomSeance.split("").reduce((acc, value) => {
    return acc + value.charCodeAt(0)
  }, 0)
  return `${RandomBgColor[randomNumber % RandomBgColor.length]}`
}

