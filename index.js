const fs = require("fs");

const salesData = fs.readFileSync("sales_data.txt", "utf-8");
const lines = salesData.trim().split("\n");

let totalSales = 0;
const monthlySales = {};
const mostPopularItem = {};
const revenueGeneratingItems = {};

for (let i = 0; i < lines.length; i++) {
  const fields = lines[i].split(",");
  let saleAmount = parseFloat(fields[3]);
  if (isNaN(saleAmount)) {
    continue;
  }
  totalSales += saleAmount;
  const date = new Date(fields[0]);
  const month = date.getMonth() + 1;
  const itemName = fields[1];

  if (!monthlySales[month]) {
    monthlySales[month] = 0;
  }
  monthlySales[month] += saleAmount;

  if (!mostPopularItem[month]) {
    mostPopularItem[month] = { name: "", quantity: 0 };
  }

  if (parseInt(fields[2]) > mostPopularItem[month].quantity) {
    mostPopularItem[month].name = itemName;
    mostPopularItem[month].quantity = parseInt(fields[2]);
  }

  if (!revenueGeneratingItems[month]) {
    revenueGeneratingItems[month] = {};
  }

  if (!revenueGeneratingItems[month][itemName]) {
    revenueGeneratingItems[month][itemName] = 0;
  }

  revenueGeneratingItems[month][itemName] += saleAmount;
}

// Output for total sales of the store and month wise sales totals
console.log(`Total sales of the store: $${totalSales.toFixed(2)}`);
console.log("Month wise sales totals:");
for (const month in monthlySales) {
  console.log(`  ${month}: $${monthlySales[month].toFixed(2)}`);
}

// Output for Most popular item (most quantity sold) in each month.
console.log("Most popular item (most quantity sold) in each month:");
for (const month in mostPopularItem) {
  console.log(
    `  ${month}: ${mostPopularItem[month].name} (${mostPopularItem[month].quantity} sold)`
  );
}

// Output for Items generating most revenue in each month
console.log("Items generating most revenue in each month:");
for (const month in revenueGeneratingItems) {
  console.log(`  ${month}:`);
  const items = revenueGeneratingItems[month];
  const sortedItems = Object.keys(items).sort((a, b) => items[b] - items[a]);
  for (const itemName of sortedItems) {
    console.log(`    ${itemName}: $${items[itemName].toFixed(2)}`);
  }
}

//Finding the most popular item for each month
for (const line of lines) {
  const fields = line.split(",");
  const date = new Date(fields[0]);
  const saleMonth = date.getMonth() + 1;
  const itemName = fields[1];
  const itemQty = parseInt(fields[2]);

  if (
    !mostPopularItem[saleMonth] ||
    mostPopularItem[saleMonth].quantity < itemQty
  ) {
    mostPopularItem[saleMonth] = {
      name: itemName,
      quantity: itemQty,
    };
  }
}

// Output for the most popular item, find the min, max and average number of orders each month
console.log(
  "min, max and average number of orders for most popular item each month:"
);
for (const month in mostPopularItem) {
  const itemName = mostPopularItem[month].name;
  const itemSales = lines
    .filter((line) => {
      const fields = line.split(",");
      const date = new Date(fields[0]);
      const saleMonth = date.getMonth() + 1;
      return saleMonth == month && fields[1] == itemName;
    })
    .map((line) => parseInt(line.split(",")[2]));

  const minOrders = Math.min(...itemSales);
  const maxOrders = Math.max(...itemSales);
  const avgOrders =
    itemSales.reduce((acc, val) => acc + val, 0) / itemSales.length;

  console.log(
    `Month ${month}: ${itemName} - Min: ${minOrders}, Max: ${maxOrders}, Avg: ${avgOrders}`
  );
}
