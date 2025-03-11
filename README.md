# Performance Testing with JMeter and k6

## Overview
This repository contains performance testing scripts using **Apache JMeter** and **k6** to evaluate the scalability and reliability of web applications. The tests simulate user interactions to measure response times, throughput, and system stability under load.

## Repository Link
[GitHub Repository](https://github.com/mhdash6/my_first_performance_project)

## Technologies Used
- **Apache JMeter** – For load and performance testing.
- **k6 (JavaScript-based tool)** – For scripting and executing performance tests.

## Setup Instructions
### Prerequisites
- Install **Apache JMeter**: [Download JMeter](https://jmeter.apache.org/download_jmeter.cgi)
- Install **k6**: [Download k6](https://k6.io/docs/getting-started/installation/)

### Clone the Repository
```sh
 git clone https://github.com/mhdash6/my_first_performance_project.git
 cd my_first_performance_project
```

## Running the Tests
### JMeter Test Execution
1. Open **JMeter**.
2. Load the `JMeter_Assignment.jmx` file.
3. Configure the thread group settings as needed.
4. Click **Run** to start the test.

Alternatively, run JMeter in non-GUI mode:
```sh
jmeter -n -t JMeter_Assignment.jmx -l results.jtl
```

### k6 Test Execution
1. Ensure **k6** is installed.
2. Navigate to the directory containing `test.js`.
3. Run the test with:
```sh
k6 run test.js
```

## Test Scenarios
### JMeter Tests
- Simulates multiple users accessing a web service.
- Measures response times and throughput.
- Includes HTTP requests, assertions, and timers.

### k6 Tests
- Automates web interactions with a pet store application.
- Validates page loads, user registration, and checkout process.
- Uses **VU (Virtual Users)** and **duration-based** execution.

## Results and Reporting
- JMeter test results are saved in `results.jtl`.
- k6 generates console output with performance metrics.
- For detailed analysis, use JMeter’s **Listeners** or k6’s **Cloud Reports**.

## Contribution
Feel free to submit issues or pull requests to improve the tests


