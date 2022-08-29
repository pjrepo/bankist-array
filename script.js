'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = date => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  else if (daysPassed === 1) return 'Yesterday';
  else if (daysPassed <= 2) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

const displayMovements = (account, sort = false) => {
  containerMovements.innerHTML = '';
  const sortMovements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  sortMovements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${movement.toFixed(2)}₤</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = account => {
  account.balance = account.movements.reduce(
    (account, movement) => account + movement
  );
  labelBalance.textContent = `${account.balance.toFixed(2)}₤`;
};

const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((accumulator, movement) => accumulator + movement);
  labelSumIn.textContent = `${incomes.toFixed(2)}₤`;

  const outcomes = account.movements
    .filter(movement => movement < 0)
    .reduce((accumulator, movement) => accumulator + movement);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}₤`;

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((accumulator, interest) => accumulator + interest);
  labelSumInterest.textContent = `${Math.round(interest).toFixed(2)}₤`;
};

const createUserName = accounts => {
  accounts.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};

createUserName(accounts);

const updateUI = account => {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};

const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}: ${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

btnLogin.addEventListener('click', event => {
  event.preventDefault();
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`;
    console.log(labelDate.textContent);
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', event => {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    receiverAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', event => {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(movement => movement >= amount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', event => {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    accounts.splice(index, 1);
    console.log(accounts);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', event => {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUsd = 1.1;

// const movementsUsd = movements.map(movement =>
//   Math.round(movement * euroToUsd)
// );

// console.log(movements);
// console.log(movementsUsd);

// const movementsDescription = movements.map(
//   (movement, index) =>
//     `Movement ${index + 1}:You ${
//       movement > 0 ? 'deposited' : 'withdrew'
//     } ${movement}`
// );

// console.log(movementsDescription);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(movement => movement > 0);
// const withdrawals = movements.filter(movement => movement < 0);
// console.log(deposits);
// console.log(withdrawals);

// const depositsFor = [];
// for (const movement of movements) {
//   if (movement > 0) depositsFor.push(movement);
// }
// console.log(depositsFor);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const balance = movements.reduce(
//   (accumulator, current) => accumulator + current
// );
// console.log(balance);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const max = movements.reduce((accumulator, current) =>
//   Math.max(accumulator, current)
// );
// console.log(max);

// const min = movements.reduce((accumulator, current) =>
//   Math.min(accumulator, current)
// );
// console.log(min);

// const calcAverageHumanAge = ages => {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);
//   const adultDogs = humanAges.filter(age => age >= 18);
//   console.log(adultDogs);
//   const averageAge =
//     adultDogs.reduce((accumulator, age) => accumulator + age) /
//     adultDogs.length;
//   return averageAge;
// };
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;
// const answer = movements
//   .filter(movement => movement > 0)
//   .map(movement => Math.round(movement * euroToUsd))
//   .reduce((accumulator, movement) => accumulator + movement, 0);
// console.log(answer);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawal = movements.find(movement => movement < 0);
// console.log(firstWithdrawal);
// console.log(accounts);

// const account = accounts.find(acc => acc.interestRate===1.5);
// console.log(account);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements.includes(-130));

// const anyDeposits = movements.some(movement => movement > 0);
// console.log(anyDeposits);

// const allDeposits = movements.every(movement => movement > -2000);
// console.log(allDeposits);

// const arr = [
//   [[1, 2], 3],
//   [4, [5, 6]],
//   [7, 8],
// ];
// console.log(arr.flat());

// const accountMovements = accounts.map(account => account.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce(
//   (accumulator, movement) => accumulator + movement
// );

// console.log(overallBalance);

// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // movements.sort((a, b) => {
// //   if (a >= b) return 1;
// //   else return -1;
// // });
// movements.sort((a,b)=>a-b);
// console.log(movements);

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const movementsUi = Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementsUi);
// console.log(Number.parseInt('30px'));
// console.log(Number.parseInt('p30x'));
// console.log(Number.parseFloat('2.5rem'));

// console.log(Number.isNaN(23 / 0));
// console.log(Number.isFinite('20'));

// console.log(Math.sqrt(25));
// console.log(Math.round(729 ** (1 / 3)));
// console.log(Math.PI);
// console.log(Math.trunc(Math.random() * 100) + 1);
// const randomInt = (min,max) => Math.floor(Math.random()*(max-min)+1)+min;
// console.log(randomInt(10,15))

// console.log(Math.trunc(23.3))
// console.log(Math.trunc(23.9));

// console.log(Math.trunc(-23.3));
// console.log(Math.trunc(-23.9));

// console.log(Math.round(23.3))
// console.log(Math.round(23.9));

// console.log(Math.round(-23.3));
// console.log(Math.round(-23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.ceil(-23.3));
// console.log(Math.ceil(-23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// console.log(Math.floor(-23.3));
// console.log(Math.floor(-23.9));

// console.log((2.796385).toFixed(3))

// console.log(5 % 2);
// console.log(5 / 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(13546987469874));

// labelBalance.addEventListener('click', () => {
//   [...document.querySelectorAll('.movements__row')].forEach((row, index) => {
//     if (index % 2 === 0) row.style.backgroundColor = 'orangered';
//     if (index % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// console.log(transferFee1, transferFee2);

// const PI = 3.14_15;
// console.log(PI);

// console.log(Number(23000_000));

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(15414684685468748693684347698374694365n);
// console.log(BigInt(15414684685468748693684347698374694365));
// console.log(BigInt(2 ** 199));

// const now = new Date();
// console.log(now);

// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10,19,15,23,5));
// console.log(new Date(2037,10,30));

// console.log(new Date(0));
// console.log(new Date(3*24*60*60*1000));

// const future = new Date(2037,10,19,15,23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.toISOString());
// console.log(account1.movementsDates)
// console.log(future.getTime())
// console.log(new Date(2142237180000));
// console.log(Date.now());

// future.setFullYear(2045);
// console.log(future);

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(Number(future));

// const calcDaysPassed = (date1, date2) =>
//   Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
// const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
// console.log(days1);

// const ingredients = ['Oilves', 'Beer'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) =>
//     console.log(
//       `Pizza was delayed by 5000 ms.....it consist of ${ing1} and ${ing2}`
//     ),
//   1000,
//   ...ingredients
// );
// console.log("I'm waiting.....");
// if (ingredients.includes('Spinach')) clearTimeout(pizzaTimer);
