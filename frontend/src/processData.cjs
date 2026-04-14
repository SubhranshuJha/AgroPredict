const fs = require("fs");
const path = require("path");
const data = require("./data.json");

function processData(data) {
    const commoditiesSet = new Set();
    const lastDates = {};

    data.historical.forEach(item => {
        const commodity = item.commodity.trim();
        const date = new Date(item.date);

        commoditiesSet.add(commodity);

        if (!lastDates[commodity] || date > new Date(lastDates[commodity])) {
            lastDates[commodity] = item.date;
        }
    });

    const uniqueCommodities = Array.from(commoditiesSet).sort();

    // ✅ Use __dirname to save in same folder as this file
    fs.writeFileSync(
        path.join(__dirname, "unique_commodities.json"),
        JSON.stringify(uniqueCommodities, null, 4)
    );

    fs.writeFileSync(
        path.join(__dirname, "last_dates.json"),
        JSON.stringify(lastDates, null, 4)
    );

    console.log("✅ Files created in same folder as script");
}

processData(data);