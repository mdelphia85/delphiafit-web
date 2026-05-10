export function generateSupplements() {
  const morning = ["Multivitamin", "Fish Oil", "Vitamin D"];
  const afternoon = ["Creatine", "BCAA", "Electrolytes"];
  const night = ["Magnesium", "Zinc", "Greens Powder"];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  return {
    morning: pick(morning),
    afternoon: pick(afternoon),
    night: pick(night)
  };
}

export function saveSupplements(data) {
  localStorage.setItem("supplements", JSON.stringify(data));
}

export function loadSupplements() {
  const d = localStorage.getItem("supplements");
  return d ? JSON.parse(d) : null;
}
