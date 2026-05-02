/**
 * 0/1 Knapsack Algorithm for Vehicle Maintenance Scheduling
 * 
 * Each task has a cost (time/effort) and a value (priority/importance).
 * We want to maximize the total value without exceeding the maximum capacity.
 * 
 * @param {Array} tasks - Array of { name, cost, value }
 * @param {number} maxCapacity - Maximum capacity allowed
 * @returns {Object} - { selectedTasks: [], totalValue: number, totalCost: number }
 */
function solveMaintenanceOptimization(tasks, maxCapacity) {
  const taskCount = tasks.length;
  const dpTable = Array.from({ length: taskCount + 1 }, () => Array(maxCapacity + 1).fill(0));

  // Build the DP table
  for (let i = 1; i <= taskCount; i++) {
    const { cost, value } = tasks[i - 1];
    for (let w = 0; w <= maxCapacity; w++) {
      if (cost <= w) {
        dpTable[i][w] = Math.max(dpTable[i - 1][w], dpTable[i - 1][w - cost] + value);
      } else {
        dpTable[i][w] = dpTable[i - 1][w];
      }
    }
  }

  // Backtrack to find selected tasks
  const selectedTasks = [];
  let remainingWeight = maxCapacity;
  for (let i = taskCount; i > 0; i--) {
    if (dpTable[i][remainingWeight] !== dpTable[i - 1][remainingWeight]) {
      selectedTasks.push(tasks[i - 1]);
      remainingWeight -= tasks[i - 1].cost;
    }
  }

  return {
    selectedTasks: selectedTasks.reverse(),
    totalValue: dpTable[taskCount][maxCapacity],
    totalCost: maxCapacity - remainingWeight,
  };
}

module.exports = { solveMaintenanceOptimization };
