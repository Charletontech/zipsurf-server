// Simulating a database
const DB = {
  users: [
    { id: 'usr_1', name: 'John Doe', email: 'john@example.com', password: 'password', balance: 5000, joined: '2023-10-01' },
    { id: 'usr_2', name: 'Jane Smith', email: 'jane@example.com', password: 'password', balance: 1200, joined: '2023-10-05' },
    { id: 'usr_3', name: 'Mike Ross', email: 'mike@example.com', password: 'password', balance: 0, joined: '2023-10-12' },
    { id: 'usr_4', name: 'Rachel Zane', email: 'rachel@example.com', password: 'password', balance: 15500, joined: '2023-10-15' },
  ],
  locations: [
    { id: 'loc_1', name: 'Lekki Phase 1 Hub', routerPass: 'WIFI-LEK-24X99', stationCode: 'ST-LEK-4821', status: 'Active', codePrefix: 'LEK' },
    { id: 'loc_2', name: 'Ikeja City Mall Point', routerPass: 'WIFI-IKJ-24X12', stationCode: 'ST-IKJ-9923', status: 'Active', codePrefix: 'IKJ' },
    { id: 'loc_3', name: 'Victoria Island Central', routerPass: 'WIFI-VIC-24X45', stationCode: 'ST-VIC-1102', status: 'Active', codePrefix: 'VIC' },
    { id: 'loc_4', name: 'Yaba Tech Zone', routerPass: 'WIFI-YAB-24X00', stationCode: 'ST-YAB-5541', status: 'Maintenance', codePrefix: 'YAB' },
  ],
  officers: [
    { id: 'off_1', name: 'Officer Barbrady', phone: '+234 800 111 2222', locationId: 'loc_1', stationCode: 'ST-LEK-4821' },
    { id: 'off_2', name: 'Joe Swanson', phone: '+234 800 333 4444', locationId: 'loc_2', stationCode: 'ST-IKJ-9923' },
  ],
  transactions: [
     { id: 'tx_1', userId: 'usr_1', type: 'fund', amount: 5000, date: '2023-10-25 09:30', status: 'Success', desc: 'Wallet Funding' },
     { id: 'tx_2', userId: 'usr_1', type: 'debit', amount: 1200, date: '2023-10-24 14:15', status: 'Success', desc: 'Internet Access - Lekki' },
  ]
};

module.exports = DB;
