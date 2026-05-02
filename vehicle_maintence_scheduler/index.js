// vehicle_maintence_scheduler/index.js

const { solveMaintenanceOptimization } = require("./scheduler");

// Mock vehicle maintenance tasks
const maintenanceTasks = [
  { name: "Oil Change", cost: 2, value: 50 },
  { name: "Brake Inspection", cost: 3, value: 80 },
  { name: "Tire Rotation", cost: 1, value: 30 },
  { name: "Engine Tuning", cost: 5, value: 100 },
  { name: "Air Filter Replacement", cost: 1, value: 20 },
];

const MAX_DAILY_CAPACITY = 7;

console.log("--- Vehicle Maintenance Scheduler ---");
console.log(`Daily Capacity: ${MAX_DAILY_CAPACITY} hours`);
console.log("Tasks Available:", maintenanceTasks.length);

const result = solveMaintenanceOptimization(maintenanceTasks, MAX_DAILY_CAPACITY);

console.log("\nOptimized Schedule:");
result.selectedTasks.forEach(task => {
  console.log(`- ${task.name} (Cost: ${task.cost}, Priority: ${task.value})`);
});

console.log(`\nTotal Priority Score: ${result.totalValue}`);
console.log(`Total Hours Used: ${result.totalCost}/${MAX_DAILY_CAPACITY}`);
