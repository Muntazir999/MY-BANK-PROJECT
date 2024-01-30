import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";

//Customer class
class Customer {
    firstName: string
    lastName: string
    age: number
    gender: string
    mobileNo: number
    accountNo: number

    constructor(
        fn: string,
        ln: string,
        a: number,
        g: string,
        mn: number,
        an: number
    ) {
        this.firstName = fn;
        this.lastName = ln;
        this.age = a;
        this.gender = g;
        this.mobileNo = mn;
        this.accountNo = an;
    }
}

// interface BankAccount
interface BankAccount {
    accountNo: number;
    balance: number;
}

//Bank class
class Bank {
    customer: Customer[] = [];
    account: BankAccount[] = [];

    addCustomer(obj: Customer) {
        this.customer.push(obj);
    }

    addAccountNumber(obj: BankAccount) {
        this.account.push(obj);
    }
    trans(accobj: BankAccount) {
        let upDate = this.account.filter(acc => acc.accountNo !== accobj.accountNo);
        this.account = [...upDate, accobj];
    }
}

let myBank = new Bank();

//Creating customers
for (let i: number = 1; i <= 10; i++) {
    let fn = faker.person.firstName('male');
    let ln = faker.person.lastName();
    let mn = parseInt(faker.phone.number());
    const cus = new Customer(fn, ln, 18 * i, "male", mn, 1000 + i);
    // console.log(cus);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accountNo: cus.accountNo, balance: 1000 * i })
}
// console.log(myBank);

//Bank Functionality
async function bankService(bank: Bank) {
do{
    let service = await inquirer.prompt({
        type: "list",
        name: "select",
        message: "Please select the service...",
        choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
    });

    //Options
    //View Balance
    if (service.select == "View Balance") {
        let res = await inquirer.prompt({
            type: "input",
            name: "num",
            message: "Enter Your Account Number:"
        });
        let account = myBank.account.find((an) => an.accountNo == res.num);
        if (!account) {
            console.log(chalk.red.bold.italic("Invalid Account Number!!!"))
        }
        if (account) {
            let name = myBank.customer.find((item) => item.accountNo == account?.accountNo);
            console.log(`Dear  ${chalk.green.bold.italic(name?.firstName)} ${chalk.green.bold.italic(name?.lastName)} Your Account is Verified. Your Balance is ${chalk.bold.blueBright(`$${account.balance}`)}`);
        }
    }
    //Cash Withdraw
    if (service.select == "Cash Withdraw") {
        let res = await inquirer.prompt({
            type: "input",
            name: "num",
            message: "Enter Your Account Number:"
        });
        let account = myBank.account.find((an) => an.accountNo == res.num);
        if (!account) {
            console.log(chalk.red.bold.italic("Invalid Account Number!!!"))
        }
        if (account) {
            let ans = await inquirer.prompt({
                type: "number",
                name: "amount",
                message: "Enter Your Account Number:"
            });
            if (ans.amount > account.balance) {
                console.log(chalk.red.bold("Amount Exceeds Your Balance!!"))
            }
            let newBalance = account.balance - ans.amount;
            bank.trans({ accountNo: account.accountNo, balance: newBalance });
        }
    }
    //Cash Deposit
    if (service.select == "Cash Deposit") {
        let res = await inquirer.prompt({
            type: "input",
            name: "num",
            message: "Enter Your Account Number:"
        });
        let account = myBank.account.find((an) => an.accountNo == res.num);
        if (!account) {
            console.log(chalk.red.bold.italic("Invalid Account Number!!!"))
        }
        if (account) {
            let ans = await inquirer.prompt({
                type: "number",
                name: "amount",
                message: "Enter Your Account Number:"
            });
            let newBalance = account.balance + ans.amount;
            bank.trans({ accountNo: account.accountNo, balance: newBalance });
        }
    }
    if(service.select == "Exit"){
        return;
    }
}
while(true)
}

bankService(myBank);