# Chapter 2 알아두어야 할 자바스크립트

## 2.1 호출 스택, 이벤트 루프

```javascript
function first() {
    second();
    console.log('첫번째');
}

function second() {
    third();
    console.log('두번째');
}

function third() {
    console.log('세번째');
}

first();
```

어떻게 동작할까?

- 함수들이 **호출 스택**에 쌓인다
- 마지막에 호출된 함수가 먼저 쳐나간다(Stack의 후입선출)
- 크롬에서 anonymous라는 **전역** 컨텍스트가 생긴다. 파일이 실행될 때 생기고 끝날 때 사라진다
- 이는 **동기적으로** 코드가 실행될 때

### 만약 비동기 코드가 있음?

- 호출스택 + **이벤트 루프**까지 모두 고려해줘야 됨
- 비동기 코드가 백그라운드에서 태스크 큐에 보내지고 호출 스택이 비워져 있을 때(anonymous도), 이벤트 큐가 태스크 큐에서 호출스택으로 함수 가져오기
- 네트워크, setTimeOut, setInterval 같은 함수들만 백그라운드에 보낼 수 있음(비동기로 돌아가는 것에 제한을 둠)

### 만약 이런 함수면? (일반함수 + Promise)

```javascript
function oneMore() {
    console.log('one more');
}

function run() {
    console.log('run run');
    setTimeout(() => {
        console.log('wow');
    }, 0);
    new Promise((resolve) => {
        resolve('hi');
    }).then(console.log);
    oneMore();
}

setTimeout(run, 5000);
```

1. setTimeout 실행 -> run 백그라운드 go + 코드 끝, anonymous 콜 스택에서 삭제
2. run 백그라운드에서 5초 후 태스크 큐로 보내지고 콜 스택에서 호출
3. run 실행, console.log('run run') 실행
4. 익명함수, Promise(**주의** Promise는 then을 만나야 비동기로 처리됨, 즉 then 없으면 얘도 동기 코드) 전부 백그라운드로
5. 위와 같이 태스크 큐로 보냄
6. Promise가 새치기 함(일반함수보다 Promise 비동기 처리가 우선)

- **실행 결과**

```javascript
run
run
one
More
hi
wow
```

- Promise(then, catch)/process.nextTick가 일반 함수보다 우선순위가 높음

- 백그라운드는 C++로 만들어짐, 노드가 아니라 운영체제(다른 언어)에서 동시성을 가질 수 있음

## 2.2 ES2015+ 문법

### 2.2.1 const, let

```javascript
if (true) {
    var x = 3;
}
console.log(x); // 3

if (true) {
    const y = 3;
}
console.log(y) // y is not defined
```

- **var**은 블록 스코프틑 무시함(함수 전체(function)의 스코프)
- **const, let**은 블록 스코프
    - const: 한 번 초기화하면 객체 상수화(코틀린에서 val)
    - let: 변수(코틀린에서 var)

### 2.2.2 템플릿 문자열

```javascript
// 기존
var result = '이 과자는' + won + '원입니다.';

// ES2015
const result = `이 과자는 ${won}원입니다`;

// ES5에서는 백틱으로 함수 호출 가능(Tagged Template Literal)
function a() {
}

a();
a``; //Tagged Template Literal
```

### 2.2.3 객체 리터럴

```javascript
var sayNode = function () {
    console.log('Node');
};
const es = 'ES';
const newObject = {
    // 객체의 메서드 정의
    sayJS() {
        console.log('JS');
    }
    sayNode,
    // 동적 속성
    [es + 6]: 'Fatastic'
}
newObject.sayNode(); // Node
newObject.sayJS(); // JS
console.log(newObject.ES6); // Fantastic
```

### 2.2.4 화살표 함수(Lambda)

```javascript
function add(x, y) {
    return x + y;
}

const add = (x, y) => {
    return x + y;
}
const add = (x, y) => (x + y);
const not = x => !x;
```

#### this 객체

```javascript
const relationship = {
    name: 'zero',
    friends: ['zero', 'hero'],
    logFriends: function () {
        var that = this;
        this.friends.forEach(function (friend) {
            console.log(that.name, friend);
        });
    },
};

relationship.logFriends();
```

- this를 쓸거면 function을 쓰는게 좀 더 편할걸?
- 안 쓰면 화살표 함수로 쓰는게 좋음(this binding 때문에)

### 2.2.5 구조분해 할당

```javascript
const example = {a: 123, b: {c: 125, d: 146}}
const {a, b: {d}} = example;
console.log(a); // 123
console.log(d); // 146

const arr = [1, 2, 3, 4, 5];
const [x, y, , , z] = arr; // x = 1, y = 2, z = 5
```

- 배열은 자리가 같아야, 객체는 key가 같아야 구조분해가 됨
- this가 있는 경우 구조분해 할당하는 것이 그다지 안좋음

### 2.2.6 Class

- 프로토타입 문법을 깔끔하게 작성할 수 있음

```javascript
// Prototype Based Inheritance Implementation
var Human = function (type) {
    this.type = type || 'human';
}

Human.isHuman = function (hunman) {
    return human instanceof Human;
}

Human.prototype.breathe = function () {
    alert('h-a-a-a-m');
};

var Zero = function (type, firstName, lastName) {
    Human.apply(this, arguments);
    this.firstName = firstName;
    this.lastName = lastName;
}

Zero.prototype = Object.create(Human.prototype);
Zero.prototype.constructor = Zero;
Zero.prototype.sayName = function () {
    alert(this.firstName + ' ' + this.lastName);
};
var oldZero = new Zero('hunam', 'Zero', 'Cho');
Human.isHuman(oldZero);
```

```javascript
// class Based
class Human {
    constructor(type = 'human') {
        this.type = type;
    }

    static isHuman(human) {
        return human instanceof Human;
    }

    breathe() {
        alert('h-a-a-a-m');
    }
}

class Zero extends Human {
    function

    constructor(type = 'human', firstName, lastName) {
        super.constructor(type);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    sayName() {
        super.breathe();
        alert(`${this.firstName} ${this.lastName}`)
    }
}

const newZero = new Zero('human', 'Zero', 'Cho');
Human.isHuman(newZero);
```

### 2.2.7 Promise

- 프로미스: 내용은 실행은 되었지만 결과를 아직 반환하지 않은 객체
- Then을 붙이면 결과를 반환함
- 실행이 완료되지 않았으면 완료된 **후에** Then 내부 함수가 실행됨

- Resolve(Successful Return) -> then
- Reject(Failure) -> catch
- Finally는 언제나 실행

```javascript
const condition = true;
const promise = new Promise((resolve, reject) => {
    if (condition) {
        resolve('성공');
    } else {
        reject('실패');
    }
});

promise
    .then((message) => {
        console.log(message);
    })
    .catch((error) => {
        console.error(error)
    })
    .finally(() => {
        console.log('무조건 이 부분은 실행됩니당')
    })
```

- Promise.resolve(): resolve(성공)하는 프로미스를 만드는 방법
- Promise.reject(): reject(실패)하는 프로미스를 만드는 방법
- Promise.all(array): 모두 resolve할 때까지 기다렸다가 then, 하나라도 실패하면 catch
- Promise.allSettled(array): allSettled로 실패한 것만 추려내어 각 Promise의 상태/에러를 받아낼 수 있음

### 2.2.8 async/await

- Promise의 then을 대신해준다고 보면 됨
- 옛날: await은 async function 안에만 있으면 됨
- 지금: await은 promise도 대기 가능

```javascript
async function findAndSaveUser(Users) {
    // findOne 결과값 나올 때까지 대기
    let user = await Users.findOne({});
    user.name = 'zero';
    user = await user.save();
    user = await Users.findOne({gender: 'm'});
}
```

- async 함수에서 return 한 것들은 then으로 받아야 됨

```javascript
async function main() {
    const result = await promise;
    return 'zerocho'
}

main().then((name) =>
...)

// OR
const name = await main();
```

- 실패하는 경우를 대비해서 try-catch 문으로 감싸야됨

```javascript
async function main() {
    try {
        const result = await promise;
        return 'zerocho'
    } catch (e) {
        console.error(e);
    }
}
```

- for await: Promise 배열을 순회해서 promise에 then을 붙여 나온 리턴값을 활용

```javascript
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async () => {
    for await (promise of [promise1, promise2]) {
        console.log(promise);
    }
})();
```

## 2.3 FrontEnd Javascript

### 2.3.1 AJAX(Asynchronous Javascript And XML)

- axios 라이브러리를 사용해서 데이터 fetch

```javascript
// Axios 서버 통신할 때 get은 axios.get, post는 axios.post
axios.get("sampleUrl")
    .then((result) => {
        console.log(result.data);
    })
    .catch((error) => {
        console.error(error);
    });
```

### 2.3.2 FormData

- Image, Media 파일은 FormData 객체를 이용하여 전송

```javascript
(async () => {
    try {
        const formData = new FormData();
        formData.append('name', 'zerocho');
        formData.append('birth', 1994);
        const result = await axios.post('sampleUrl', formData);
    } catch (e) {
        console.error(e);
    }
})();
```

### 2.3.3 encodeURIComponent, decodeURIComponent
- URI에 한글이 있을 때?
  - encodeURIComponent, decodeURIComponent를 이용하여 문자열을 암호화/복호화 함
  
### 2.3.4 data attribute & dataset
- 서버의 데이터를 프론트로 내려줄 때
- dataset.monthSalary = 10000 -> data-month-salary = "10000"
  - HTML에서 JS로 데이터가 들어갈 때 data- 접두사가 사라지고 속성은 camelCase로 루트 변수는 dataset으로 지정
  - Vice Versa
