const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    // get form values
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    transactions.push({
        id: Date.now(),
        description,
        amount,
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updatedTransactionList();
    updateSummary();

    transactionFormEl.reset();
}

function updatedTransactionList() {
    transactionListEl.innerHTML = "";

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) => {
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);
    });
}

function createTransactionElement(transaction) {
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");

    // todo: update the amount formatting
    li.innerHTML = `
                <span>${transaction.description}</span>
                <span>${formatCurrency(transaction.amount)}
                    <button class="delete-btn" onclick="removeTransaction(${
                        transaction.id
                    })">x</button>    
                </span>
            `;

    return li;
}

function updateSummary() {
    const balance = transactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
    );

    const income = transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expenses = transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    // update ui => todo: fix the formatting
    balanceEl.textContent = formatCurrency(balance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    }).format(number);
}

function removeTransaction(id) {
    //filter the one to remove
    transactions = transactions.filter((transaction) => transaction.id !== id);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updatedTransactionList();
    updateSummary();
}

// initial render
updatedTransactionList();
updateSummary();
