# Chapter 1 노드 시작하기

## 1.1 노드의 정의

### 노드(Node.js)란?

**크롬 V8 JS 엔진으로 빌드된 자바스크립트 런타임**

그럼 Node 전에는?

- <script></script> -> 스크립트가 HTML에 종속되어 있음

- 브라우저의 종속성에서 벗어남!
- 자바스크립트로 앱/웹/프로그램 제작 등 다양하게 활용할 수 있음
- 자바스크립트로 서버 코드를 작성해서 올리면 Node JS로 실행시켜 -> JS로 서버를 만드는거지

TypeScript에서는 **Deno**가 있음

서버의 역할**도 수행할 수 있는** 자바스크립트 런타임



### 런타임

특정 언어로 만든 프로그램을 실행할 수 있게 해주는 실행 환경(가상 머신?과 비슷)

- Node, 브라우저(크롬, 엣지) 등이 있음
- 브라우저에 자바스크립트 런타임이 내장되어 있어 자.스 코드 실행 가능

노드 이전에도 JS Runtime을 만드려는 시도는 있었으나 성능상 문제로 실패



### 내부 구조

![스크린샷 2021-01-24 오후 6.59.50](https://user-images.githubusercontent.com/54518925/105629331-c133f080-5e85-11eb-94da-6a89fe810bae.png)

- Node 내부에는 V8 엔진이 포함됨
- libuv: 이벤트 기반, Noblocking, I/O 모델의 구현체 라이브러리 -> JS에서도 중요, 싱글스레드이면서 비동기 처리가 가능
- 내부 구조는 C++로 제작됨



## 1.2 노드의 특징

### 이벤트 기반

- 이벤트가 발생할 때 미리 지정해둔 작업을 수행하는 방식(setOnClickListener)



**이벤트 기반 구조의 구성요소**

- 이벤트: 클릭, 타이머 등
- 이벤트 리스너: 이벤트를 등록하는 함수
- 콜백 함수: 이벤트가 발생했을 때 실행될 함수

![스크린샷 2021-01-24 오후 7.04.57](https://user-images.githubusercontent.com/54518925/105629336-c729d180-5e85-11eb-8a9b-dcc82310aba4.png)

- 발생한 이벤트가 없거나 다 처리 하면 노드는 다음 이벤트가 발생할 때까지 대기



### 이벤트 루프

- 여러 이벤트들이 동시에 발생했을 때 어떤 순서로 콜백 함수를 호출할 지 판단
- 함수를 호출스택에 넣어서 호출 관리를 했다는 게 일반적인 생각
- 그런데 setTimeout(function, 3000)과 같은 코드는 스택으로 어떻게 설명
    - 이벤트 루프, 태스크 큐, 백그라운드 개념을 이해
- **이벤트 루프**: 이벤트 발생 시 호출 할 콜백 함수 관리, 호출'된' 콜백 함수의 실행 순서 결정
    - 노드가 종료될 때까지 위의 작업을 반복하여 Loop라고 함
- **백그라운드**: 타이머와 이벤트 리스너들이 대기하는 곳(JS가 아닌 다른 언어로 작성된 프로그램)
    - 여러 작업들이 동시에 실행될 수 있음
- **태스크 큐**: 이벤트 발생 후, 백그라운드에서 태스크 큐로 콜백함수를 보낸다. 정해진 순서대로 콜백들이 줄을 서 있어서 콜백 Queue라 부른다
    - 완료되는 순서대로 줄을 서있지만 특별한 경우 순서가 바뀌기도 한다



위의 개념으로 setTimeout(function, 3000)은

1. 호출 스택에 setTimeout이 들어감
2. 콜백함수인 function이 백그라운드로 보내짐
3. 3초 뒤에 function은 태스크 큐로 보내진다
4. 호출 스택이 비워져있으면 이벤트 루프가 태스크 큐의 콜백함수(function)를 호출스택으로 올림
5. function 실행

이벤트 루프는 스택이 비어있을 때에만 function을 호출 스택에서 가져올 수 있기 때문에 setTimeout 함수의 실행시간은 부정확할 수 있음



### NonBlocking I/O

- 오래 걸리는 함수를 백그라운드로 보내서 다음 코드가 먼저 실행되게 하고 나중에 오래 걸리는 함수를 실행
- 일부 코드(파일 접근, 암호화, 압축 등)는 백그라운드에서 병렬로 실행됨
- I/O 작업이 많을 때 노드 활용성이 극대화
    - I/O 작업을 백그라운드로 보내서 동시에 처리할 수 있게하고
    - 일반 JS 코드는 동기적으로 처리한다
    - 그래서 I/O 작업을 한 곳에 묶어서 NonBlocking 방식으로 코드작성하는 것이 중요함

```javascript
function longRunningTask() {
  // Long Time to take this
  console.log('Task');
}

console.log('Start');
// 지연시간 4ms(Node에서는 1ms)
// setImmediate와 같은 방식으로 논 블로킹 처리한다고 함
setTimeout(longRunningTask, 0);
console.log('Next Job');
```

위와 같은 방식으로 작성하면 오래 걸리는 longRunningTask는 이벤트 루프로 보내져서 나머지 함수들이 호출스택에서 처리되어야 실행됨을 알 수 있다..



노드에서는

- Blocking, 동기: 코드가 순서대로
- NonBlocking, 비동기: 코드가 순서대로 실행되지 않을 수도 있다(실행 컨텍스트, 이벤트 루프에 의해 결정)
    - 동시에 돌아간다? 그런 개념이 아님
    - 내가 다룰 수 없는 다른 스레드를 통해 동시에 돌아갈 수 있게 해줌
    - 노드에서는 동시에 돌아가는게 지~인짜 힘듦

두 개념만 존재한다고 생각하면 편하다



**중요**

논블로킹과 동시는 **다르다!!**

- 동시성은 동시 처리가 가능한 작업을 논 블로킹 처리해야 함
- 즉 논블로킹을 해도 동시처리가 가능하지 않으면 동시적으로 돌아가지 않는다



### 프로세스 vs 스레드

**프로세스**: 운영체제에서 항당하는 작업의 단위, 프로세스 간 자원 공유 X

**스레드**: 프로세스 내에서 실행되는 작업의 단위, 부모 프로세스 자원 공유



노드 프로세스는 **멀티 스레드**, 직접 다룰 수 있는 스레드는 **하나**이기 때문에 싱글 스레드(노드는 멀티 스레드 대신 멀티 **프로세스**)

(CAUTION) 노드는 14버전부터 멀티 스레드 사용 가능

**[싱글 스레드, 블로킹 모델]**

![스크린샷 2021-01-24 오후 7.22.50](https://user-images.githubusercontent.com/54518925/105629338-cdb84900-5e85-11eb-8aaa-c2a1d4c267a5.png)

**[멀티 스레드, 블로킹 모델]**

![스크린샷 2021-01-24 오후 7.23.39](https://user-images.githubusercontent.com/54518925/105629342-d27cfd00-5e85-11eb-8ed1-fc99acf6c7e1.png)



**[싱글 스레드, 논블로킹 모델(Node JS)]**

![스크린샷 2021-01-24 오후 7.22.08](https://user-images.githubusercontent.com/54518925/105629349-d90b7480-5e85-11eb-87fe-4c37dc57ef42.png)

- 한 번에 주문이 많이 올 때 뻗어버릴 수 있음
- 주문량 관리를 적절히 잘 해야됨
- 멀티 프로세싱(체인점)으로 이를 해결



## 1.3 노드의 역할

### 서버로서의 노드

서버: 네트워크를 통해 클라이언트에 정보나 서비스를 제공하는 컴퓨터/프로그램

클라이언트: 서버에 요청을 보내는 주체(브라우저, 데스크탑 프로그램, 모바일 앱)

- 서버는 클라이언트의 요청에 대해 응답을 한다

노드는 서버를 구성할 수 있게 해주는 Module을 제공



### 노드 서버의 장단점

![스크린샷 2021-01-24 오후 7.30.30](https://user-images.githubusercontent.com/54518925/105629353-ddd02880-5e85-11eb-87e9-60b37219cc62.png)

- 단순 CRUD 정도 하는거면 Node 좋음
- 암호화, 압축 등은 노드에서 하기가 힘듦(계산이 많은 작업들)
    - AWS Lambda, Google Cloud Functions 같은 별도 서비스를 사용

