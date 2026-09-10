let expenses = [];
let budget = 0;

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user && pass) {
    alert("Login successful!");
    showPage('dashboardPage');
  } else {
    alert("Please enter username and password.");
  }
}

function setBudget() {
  budget = parseFloat(document.getElementById('monthlyBudget').value) || 0;
  updateDashboard();
  updateBudgetPage();
}

function saveExpense() {
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;

  if (!amount || !date) {
    alert("Please enter amount and date.");
    return;
  }

  const expense = { amount, category, date, description };
  expenses.push(expense);

  updateDashboard();
  updateHistory();
  updateBudgetPage();

  alert("Expense saved!");
  showPage('dashboardPage');
}

function updateDashboard() {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  document.getElementById('budgetAmount').textContent = budget.toFixed(2);
  document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
  document.getElementById('remainingBudget').textContent = (budget - totalExpenses).toFixed(2);

  const recentList = document.getElementById('recentExpenses');
  recentList.innerHTML = "";
  expenses.slice(-5).forEach(e => {
    const li = document.createElement('li');
    li.textContent = `${e.category} - $${e.amount} (${e.date})`;
    recentList.appendChild(li);
  });
}

function updateHistory() {
  const table = document.getElementById('historyTable');
  table.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Category</th>
      <th>Description</th>
      <th>Amount</th>
      <th>Actions</th>
    </tr>
  `;
  expenses.forEach((e, index) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = e.date;
    row.insertCell(1).textContent = e.category;
    row.insertCell(2).textContent = e.description;
    row.insertCell(3).textContent = `$${e.amount}`;
    const actions = row.insertCell(4);
    actions.innerHTML = `<button onclick="editExpense(${index})">Edit</button> 
                         <button onclick="deleteExpense(${index})">Delete</button>`;
  });
}

function updateBudgetPage() {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  document.getElementById('spentAmount').textContent = totalExpenses.toFixed(2);
  document.getElementById('balanceAmount').textContent = (budget - totalExpenses).toFixed(2);

  const warning = document.getElementById('budgetWarning');
  if (totalExpenses > budget) {
    warning.textContent = "You have exceeded your budget!";
  } else if (budget - totalExpenses < budget * 0.1) {
    warning.textContent = "Warning: You are close to exceeding your budget!";
  } else {
    warning.textContent = "";
  }
}

function editExpense(index) {
  const e = expenses[index];
  document.getElementById('amount').value = e.amount;
  document.getElementById('category').value = e.category;
  document.getElementById('date').value = e.date;
  document.getElementById('description').value = e.description;
  deleteExpense(index);
  showPage('addExpensePage');
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateDashboard();
  updateHistory();
  updateBudgetPage();
}
