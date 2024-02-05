function getYesterdayISO() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

const yesterdayISO = getYesterdayISO();
// console.log(yesterdayISO)

const table = base.getTable("Accounts");

let queryResult = await table.selectRecordsAsync({fields: ["Username"]});

let records = [];
for (let i = 0; i < queryResult.records.length; i++) {
    const accountTable = queryResult.records[i]["name"]
    // console.log(accountTable)
    let accountQueryResult = await base.getTable(accountTable).selectRecordsAsync({
        fields: ["Date"],
        sorts: [
        {field: "Date", direction: "desc"},
        ]
    });

    let count = 0
    for (let record of accountQueryResult.records) {
        const date = record.getCellValueAsString("Date").substring(0, record.getCellValueAsString("Date").indexOf(" "))
        console.log(date);
        if (date !== yesterdayISO) {
            break;
        }
        count++;
    }

    records.push({
        id: queryResult.records[i].id,
        fields: {
            "TT Posts Yesterday" : count
        }
    })
}

console.log(records)
await table.updateRecordsAsync(records);