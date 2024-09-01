# WRITE VALUABLE TESTS
Sometimes, you are not confidence in delivering the ticket so you involve QA for costly regression tests.

Or the maintenance efforts for the project's tests are usually excessive and usually result in false positive alerts as well.

In this blog, I will share some fundamental knowledge to tackle these issues.

(Most of this blog's images and ideas are retrieved from the book `Unit Testing: Principles, Practices, and Patterns MEAP V03` by the beloved author `Vladimir Khorikov`)

## Overview
Tests is the most crucial part of a software project to maintain sustainability through project development cycles.

![The importance of good tests](/blog/images/write_valuable_test/test_importance.png)

If the tests aren't written well, it could increase maintenance costs, demotivate the team, and sequentially decrease productivity.

I will go through the following sections to address techniques for writing good tests that bring the most value:

- **Foundational Attributes**: 4 metrics to measure the test quality.
- **Ideal tests**: Does it exist a sort of test that could have all 4 attributes?
- **Ideal architecture**: Project architecture to facilitate writing ideal tests.
- **Good practices**: Principles and practices to write good tests.
- **Conclusion**: Some shorten sentences to encourage writing valuable tests.
- **Appendix**: Popular stuffs in DEV testing worlds

## Foundational Attributes
In this section, I'll show you attributes to define a valuable test.

1. **Protection against regressions**

A regression, also known as a software bug, occurs when a feature stops working as intended after a code modification. 
Protection against regression is the most important element to ensure the system is working as expected and following observed behavior.
Let's say you introduce a Rest API to change the state of your database, you need to write a test to ensure the state was changed properly after calling the Rest API.
The behavior changing the state should be protected over adding/modifying other parts of that API. Protection against regression addresses this primary purpose of unit tests.

2. **Resistance to refactoring**

Refactoring in changing the code without changing the system/software behavior. The purpose of refactoring is mainly to enhance code quality to maintain good productivity for the team.
Following this definition, a good test shouldn't raise false positive (test fails but expected system behavior is unchanged) errors when refactoring. 

3. **Fast testing execution**

The testing execution time should be quick so that the test can be run whenever you change the code without affecting productivity.

4. **Easy maintenance**

The tests are easy to understand for code readers and effortless to run.

A good unit test must have at least 3/4 attributes.

## Ideal Tests

Creating an ideal test to satisfy all 4 attributes is extremely hard to achieve because of the inverse proportion of `fast testing execution` and `protection against regression`.

Here is the diagram describing that inverse proportion:

![Test pyramid](/blog/images/write_valuable_test/test_pyramid.png)

- Unit tests are tests that cover the smallest unit of the system. Unit tests target the domain model (main business)
- Integration tests verify how your system works in integration with out-of-process dependencies (database, file system, other services).
- End-to-end testing verifies that all components of a system can run under real-world scenarios

Tests in higher pyramid layers favor protection against regressions, while lower layers focus on execution speed.

Nowadays, in modern system architectures, we have conditions that allow maximizing `fast feedback`:
- The size of a micro-service is small.
- With the docker orchestration technique (K8S, docker-compose), self-hosting some out-of-process dependencies (databases, cache storage,...) is cheaper and faster.

Due to the speed up in test execution, we should prefer writing integration tests over unit tests and end-to-end to make our tests nearly as much as possible to the ideal test.

## Ideal Architectures
Depending on implementation details could create fragile tests and usually produce false positive alerts.
There are some typical ideal architectures in which they encapsulate the implementation details and clearly expose observable behaviors.
They facilitate writing end-behavior tests and avoid coupling to implementation details.

1. Hexagonal Architecture

There are two types of communications in a typical application: intra-system and inter-system.
- Intra-system communications are communications between classes inside your application (implementation details).
- Inter-system communications are when your application talks to other applications (observable behaviors).
![Intra vs Inter communications](/blog/images/write_valuable_test/inter_vs_intra.png)

Hexagonal architecture, (aka Ports and Adapters architecture) is a design pattern that structures applications as a collection of hexagons.
Each hexagon represents a distinct application composed of two primary layers: the domain layer and the application services layer.
This architecture emphasizes three key aspects:

- Separation of Concerns: The domain layer handles business logic, while the services layer manages interactions between the domain layer and external applications.

- Depend inward domain layer: Dependencies flow from the application services layer to the domain layer, ensuring that classes in the domain layer depend only on each other and not on classes from the application services layer.

- External Connections via Interface: External applications interact with the system through a common interface provided by the application services layer, preventing direct access to the domain layer.

With Hexagonal architecture, it is easy to write unit tests for the domain layer and assert inter-system communications (via decoupled adapters).

![Hexagonal](/blog/images/write_valuable_test/hexagonal.png)
(Source: Netflix)

2. Functional Architecture

The goal of functional Architecture is to separate business logic from side effects.
Functional Architecture introduces a separation between business logic and side effects.
There are 2 layers in Functional Architecture: Functional Core (Core layer) and Mutable Shell (Shell layer).

Core layer: All the business logic will be implemented as pure functions in the `Functional Core layer`.
Shell layer: Side effects or mutated data will be made base on Functional Core output.

![Functional Core Mutable Shell](/blog/images/write_valuable_test/functional_core_mutable_shell.png)

Functional Architecture is an extreme version of Hexagonal Architecture. In which it maximizes writing unit tests and unit tests with output-based style for the Core layer.

With this architecture, the number of unit tests is significantly more than integration tests.

## Good Practices
I made an example about `EvaluateAlertsAndSendReportService` in the previous [Django Project Architecture](https://lexuancuong.github.io/blog/posts/2024/05/django_project_architecture), in this section, I'll make examples based on that example:

```python
# charts/services/evaluate_alerts_and_send_report_service.py
from dataclasses import dataclass, field
from models import Alert
from repositories import AlertRepository, ChartRepository
from charts.services import get_chart_data
from project_name.clients.email_client import EmailClient

@dataclass
class EvaluateAlertsAndSendReportService:
    chart_id: int
    alert_repository: AlertRepository = field(default_factory=AlertRepository)
    chart_repository: ChartRepository = field(default_factory=ChartRepository)
    email_client: EmailClient = field(default_factory=EmailClient)

    def execute(self) -> bool:
        self.unmuted_alerts = self._get_unmuted_alerts()
        if not self.unmuted_alerts:
            return False
        self.data = self.chart_repository.get_data(self.chart_id)
        alert_message = self._build_alert_message()
        self.email_client.send_email(
            title="Schedule Alert",
            message=alert_message,
            sender='from@example.com',
            recipients=["to@example.com"],
        )
        return True

    def _get_unmuted_alerts(self) -> list[Alert]:
        alerts = self.alert_repository.filter_by_chart(chart_id)
        return [alert for alert in alerts if not alert.muted_by_customer]
    
    def _build_alert_message(self) -> str:
        messages = []
        for alert in self.unmuted_alerts:
            if alert.should_send_alert(self.data):
                messages = alert.generate_alert_message()
        if not messages:
            return "All good"
        return "\n".join(messages)
```

1. Follow the AAA pattern

The AAA pattern stands for Arrange, Act, and Assert, and it's a common pattern for writing clean and understandable unit tests.
AAA stands for these steps:
- Arrange: Set up any data needed for the test.
- Act: Execute the function or method being tested.
- Assert: Verify that the outcome is as expected.

Only 1 section for each action and assertion is recommended with the AAA pattern.

Let's make a common bad example of violating the AAA pattern.
```python
from django.test import TestCase

class TestEvaluateAlertsAndSendReportService(unittest.TestCase):
    def test_execute(self):
        mock_email_client = MagicMock()
        chart = ChartFactory.create(1)
        alerts = AlertFactory.create_batch(5, chart=chart)
        service = EvaluateAlertsAndSendReportService(chart_id=chart.id, email_client=mock_email_client)
        self.assertTrue(service.execute())
        for alert in alerts:
            alert.delete()
        service = EvaluateAlertsAndSendReportService(chart_id=chart.id, email_client=mock_email_client)
        self.assertFalse(service.execute())
```
Separating sections with empty lines could increase the readability of unit tests.

2. Avoid branching logic in tests

Avoid `if`-`else` statements in any stage (Arrange, Act, and Assert) of a test.

It indicates your test has multiple scenarios in a single test case. 

Bad example:
```python
class TestEvaluateAlertsAndSendReportService(unittest.TestCase):
    def test_execute(self):
        scenario = "no_unmuted_alerts"

        if scenario == "no_unmuted_alerts":
            self.alert_repository.filter_by_chart.return_value = [
                Alert(id=1, chart_id=self.chart_id, muted_by_customer=True),
                Alert(id=2, chart_id=self.chart_id, muted_by_customer=True)
            ]
        elif scenario == "has_unmuted_alerts":
            self.alert_repository.filter_by_chart.return_value = [
                Alert(id=1, chart_id=self.chart_id, muted_by_customer=False),
                Alert(id=2, chart_id=self.chart_id, muted_by_customer=True)
            ]

        result = self.service.execute()

        if scenario == "no_unmuted_alerts":
            self.assertFalse(result)
            self.email_client.send_email.assert_not_called()
        elif scenario == "has_unmuted_alerts":
            self.assertTrue(result)
            self.email_client.send_email.assert_called_once()

```
With if-else blocks, it increases the complexity of the test. It reduces the readability and is a burden for maintainability.

Good example:
```python
import unittest
from unittest.mock import MagicMock
from charts.services.evaluate_alerts_and_send_report_service import EvaluateAlertsAndSendReportService
from alerts.models import Alert
from alerts.repositories import AlertRepository
from project_name.clients.email_client import EmailClient

class TestEvaluateAlertsAndSendReportService(unittest.TestCase):
    def test_execute_with_no_unmuted_alerts(self):
        self.alert_repository.filter_by_chart.return_value = [
            Alert(id=1, chart_id=self.chart_id, muted_by_customer=True),
            Alert(id=2, chart_id=self.chart_id, muted_by_customer=True)
        ]

        result = self.service.execute()

        self.assertFalse(result)
        self.email_client.send_email.assert_not_called()

    def test_execute_with_unmuted_alerts(self):
        self.alert_repository.filter_by_chart.return_value = [
            Alert(id=1, chart_id=self.chart_id, muted_by_customer=False),
            Alert(id=2, chart_id=self.chart_id, muted_by_customer=True)
        ]

        result = self.service.execute()

        self.assertTrue(result)
        self.email_client.send_email.assert_called_once()
```

3. Always prefer black box testing instead of white box testing

Bad example:
```python
from django.test import TestCase
from django.db import connection
from .models import Customer

class TestEvaluateAlertsAndSendReportService(TestCase):
    def test_get_all_alert_correctly(self):
        with connection.cursor() as cursor:
            customers = Alert.objects.all()
            sql = str(customers.query)
            self.assertEqual(
                sql,
                """
                    SELECT "app_customer"."id", "app_customer"."first_name", 
                    "app_customer"."last_name", "app_customer"."email", "app_customer"."created_at" 
                    FROM "alert"
                """
            )
```
Following this good practice, you could gain the following benefits: 
- Reduce the number of false positives your tests could produce (resistance to refactoring).
- Target the observable behavior. It makes the test more readable (maintainability).

4. Aim at the end result instead of implementation details

Shouldn't assert intra-system communications, this kind of communication is implementation detailed. 
It is extremely fragile. It doesn't bring too many valuable things with the end-user who directly from observable behaviors. So that it increases the effort for writing tests and nightmares for maintenance in the long term.
![Aim at the end result](/blog/images/write_valuable_test/aim_at_end_result.png)

Mocking is legitimate only when it’s used for inter-system communications that cross the application boundary.


```python
from django.test import TestCase
from django.db import connection
from .models import Customer

class TestEvaluateAlertsAndSendReportService(TestCase):
    @patch.object(TestEvaluateAlertsAndSendReportService, '_get_unmuted_alerts')
    def test_execute(self, mock_get_unmuted_alerts):
        alerts = AlertFactory.create_batch(chart_id=self.chart_id, muted_by_customer=True),

        result = EvaluateAlertsAndSendReportService(chart_id=chart.id, email_client=mock_email_client).execute()

        self.assertFalse(result)
        self._get_unmuted_alerts.assert_called_once_with(self.chart_id)
```

5. Each test method handles a single scenario

When writing tests, each test should verify only one single scenario, it facilitates code reading and debugging. Also easier for other developers to extend with new test cases.

Bad example:
```python
from django.test import TestCase
from django.db import connection
from .models import Customer

class TestEvaluateAlertsAndSendReportService(TestCase):
    def test_evaluate_alerts_and_send_report(self):
        alert = AlertFactory.create(chart_id=self.chart_id, muted_by_customer=True)
        result = self.service.execute()
        self.assertFalse(result)
        self.email_client.send_email.assert_not_called()
        alert.status = 'active'
        result = self.service.execute()
        self.assertTrue(result)
        self.email_client.send_email.assert_called_once()
```
Good example:

```python
from django.test import TestCase
from django.db import connection
from .models import Customer

class TestEvaluateAlertsAndSendReportService(TestCase):
    def test_shouldnt_send_email_when_alerts_are_muted(self):
        alerts = AlertFactory.create_batch(chart_id=self.chart_id, muted_by_customer=True),
        result = self.service.execute()

        self.assertFalse(result)

        self.email_client.send_email.assert_not_called()

    def test_should_send_email_when_alerts_are_muted(self):
        alerts = AlertFactory.create(chart_id=self.chart_id),

        result = self.service.execute()

        self.assertTrue(result)
        self.email_client.send_email.assert_called_once()
```

In the above example, one tip was used: We should attach the scenario and the expected behavior in the test name.

6. Avoid in-memory databases

People usually use in-memory databases for testing the repository layer because it is faster.
Or even using in-memory databases for all integration tests.

However, we should avoid using in-memory databases because they do not have consistent functionality compared to regular databases.

If the web framework or tool you are using doesn't support seamlessly using different databases for unit tests, the effort of setup an in-memory database could be huge.
But in development time, your queries or schemas become more complex. The in-memory database could be broken.

For example: PostgreSQL offers the JSONB data type for efficient storage and querying of JSON data, including indexing capabilities. But, we don't have it in SQLite.


7. Avoid mixing test code with production code

The problem with code pollution is that it mixes up test and production code and thereby increases the maintenance costs of the latter.

```python
def _send_slack_message( name: str, text: str, channel: str):
    if settings.TESTING: # The more if-else we have, the more complexity we deal
        return
    ...
@dataclass
class EvaluateAlertsAndSendReportService:
    def execute(self) -> bool:
        ... # other lines of code
        _send_slack_message(
            name='alert_service',
            text='Got error when executing the job',
            channel='#alert'
        )
        return False
```
We should use a fake send_slack_message object to get rid of this mixing.

In the Python world, cleanly resolving this messy is challenging. It requires the team to design the code base facilitate using fake objects instead.

With DDD Architecture, the resolution could be:

```python
# clients/slack_client.py
class SlackClient(ISlackClient):
    def send_slack_message(name: str, text: str, channel: str):
        ...
@dataclass
class EvaluateAlertsAndSendReportService:
    slack_client: ISlackClient = SlackClient()
    def execute(self) -> bool:
        ... # other lines of code
        slack_client.send_slack_message(
            name='alert_service',
            text='Got error when executing the job',
            channel='#alert'
        )
        return False
```

With the above structure, we could pass `FakeSlackClient` as a subclass of `ISlackClient` or merely a `MagicMock` instance to verify the SUT:

```python
class TestEvaluateAlertsAndSendReportService(TestCase):
    def test_shouldnt_send_email_when_alerts_are_muted(self):
        mock_email_client = MagicMock()
        alerts = AlertFactory.create_batch(chart_id=self.chart_id, muted_by_customer=True),

        result = EvaluateAlertsAndSendReportService(email_client=mock_email_client).execute()

        self.assertFalse(result)
        self.mock_email_client.send_slack_message.assert_called_once()
```

8. Should rely on the number of covered behaviors instead of executed lines of code

As you can see, the coverage metrics don't guarantee that the underlying code is tested, only that it has been executed at some point.

For example, in Python, we have the shortcut with the `or` operator in the same line:
```
Line1: if a or b:
Line2:    do c
```
If we have the unit test to cover `if a` the coverage will be 100% but actually we need to cover `if b` to cover all branches. 

So we should rely on a number of covered behaviors instead of an executed line of code.

Alternatively, we should rely on branch coverage instead of code coverage. 

9. Always write tests for new features and bug fixes.

Bug-fixing deployments usually miss tests.

But writing tests for these kinds of deployments is extremely important to ensure we are fixing the correct point and protecting the fixed behavior.

10. Shouldn't verify the private methods and functions.
Writing tests for private methods or functions seriously damage the `resistance to refactoring`.
Because private methods and functions are implementation details, they aren't protected and persist things.

Writing tests for these ones could create false positive alerts when we doing refactoring tasks. 

Besides, writing test cases for private functions or methods confuse the test readers because it is quite different from product requirements. 

For example: Product requirement doesn't care about the way we build messages, it just addresses the way the email should be sent. This test case isn't stuck to the product requirement:

```python
class TestEvaluateAlertsAndSendReportService(TestCase):
    def test_build_alert_message_should_return_ok_message_when_all_alerts_are_good(self):
        service = EvaluateAlertsAndSendReportService(email_client=mock_email_client)
        service.unmuted_alerts = AlertFactory.craete_batch(5)
        service.data = []

        result = service.execute()

        self.assertEqual(result, 'All good')
```

Instead, the test should verify the expected behavior:

```python
class TestEvaluateAlertsAndSendReportService(TestCase):
    def test_should_send_okay_email_when_all_alerts_are_good(self):
        chart = ChartFactory.create()
        AlertFactory.craete_batch(5, chart_id=chart.id)

        result = EvaluateAlertsAndSendReportService(chart_id=chart.id, email_client=MagicMock()).execute()

        self.assertTrue(result)
        email_client.send_email.assert_called_once_with(message='All good')
```

There is a concern about reusing private methods or functions in many places, should we write test cases for all of those places?

The answer will be: Private methods or functions shouldn't be reused.

11. Avoid leaking domain knowledge
Let's say we want to write code for this simple SUT:
```python
def add(value1, value2):
    return value1 + values
```

Here is an example of bad code that leaks domain knowledge to tests.
```python
class CalculatorTests(unittest.TestCase):
    @parameterized.expand(
        (value1, value2)
        [
            (1, 3),
            (11, 33),
            (100, 500)
        ]
    )
    def test_adding_two_numbers(self, value1, value2):
        expected = value1 + value2  # ❶
        actual = Calculator.add(value1, value2)
        self.assertEqual(expected, actual)
```
This one is just an example of leaking domain knowledge.
For more complicated issues, the problem will be more serious with these pain points:
- Refactoring code becomes difficult as tests are tightly coupled to specific implementations (the adding logic in the above example)
- Leads to redundancy by replicating business logic in tests.

Good:
```python
class CalculatorTests(unittest.TestCase):
    @parameterized.expand(
        (value1, value2, expected_output)
        [
            (1, 3, 4),
            (11, 33, 44),
            (100, 500, 600)
        ]
    )
    def test_adding_two_numbers(self, value1, value2, expected_output):
        actual = Calculator.add(value1, value2)
        self.assertEqual(expected_output, actual)
```
12. Clearing data between test runs

This item is crucial to keep the isolation between tests. This behavior ensures that each test runs in a clean state.

So that, we could produce a good test result without causing flaky tests or false negative alerts.

There are some frameworks that already support us with flushing data after each test. For example, it is `django.test.TestCase` in Django.

13. Avoid using big JSON file as an input for a test
Using a big JSON file causes these painful points:

- Large JSON files are harder to read and understand, making it difficult to pinpoint issues or understand the test's purpose.
- Large files are harder to maintain. Any change in the structure or data can be cumbersome to manage.
- Tests should ideally be isolated and focused. Using a large JSON file might introduce unnecessary complexity and dependencies, making it harder to identify the root cause of failures.

Bad practice:
```python
import json
import unittest

class TestCreateAlertService(unittest.TestCase):
    def test_create_alert_with_missing_message_should_return_400_response(self):
        # Arrange
        with open('large_data.json') as f:
            data = json.load(f)
         
        # Act
        resp = self._make_request_to_create_alert(data)
        self.assertEqual(resp.status_code, 400)
```

Instead of using a large JSON file, we can mock the data to keep the tests focused and efficient.

We will have a base data and just add needed lines to modify the data according to the scenario:

Good practice:
```python
import json
import unittest

class TestCreateAlertService(unittest.TestCase):
    def test_create_alert_with_missing_message_should_return_400_response(self):
        request_payload_missing_message = self._get_base_success_request_payload()
        request_payload_missing_message['message'] = None
         
        resp = self._make_request_to_create_alert(data)
        
        self.assertEqual(resp.status_code, 400)
```

## Conclusion
Crafting high-quality tests requires significant time and practice, yet the rewards they yield are exceedingly valuable. 

![The importance of good tests](/blog/images/write_valuable_test/test_importance.png)

The last tip: When implementing Test-Driven Development (TDD) correctly, one has the potential to effectively adhere to almost all best practices.

## Apendix
nice-to-know stuff related to unit tests and integration tests.
### Unit tests
Unit tests are tests covering the smallest unit of the system. Unit tests target the domain model (main business)
#### Classical school vs London school
There are 2 approaches to writing mocks unit tests:
- Classical School: Focuses on testing the actual behavior of the unit with minimal use of mocks. Dependencies are typically real objects.
- London School: Focuses on testing the interactions between the unit under test and its collaborators using mocks or stubs to isolate the unit.

Let's make an example with this simple `Calculator` class:
```python
class Logger:
    def log(self, message):
        print(message)

class Calculator:
    def __init__(self, logger):
        self.logger = logger

    def add(self, a, b):
        result = a + b
        self.logger.log(f"Adding {a} and {b} to get {result}")
        return result
```

Classical school: Tests the Calculator with a real Logger (test doubles), focusing on overall behavior.
```python
class TestCalculatorClassical(unittest.TestCase):
    def test_add(self):
        fake_logger = FakeLogger()
        calculator = Calculator(fake_logger)

        result = self.calculator.add(2, 3)

        self.assertEqual(result, 5)
```

London School: Tests the Calculator with a mock Logger, focusing on interactions.
```python
class TestCalculatorLondon(unittest.TestCase):
    def setUp(self):
        mock_logger = Mock()
        calculator = Calculator(mock_logger)

        result = self.calculator.add(2, 3)
        
        mock_logger.log.assert_called_once_with("Adding 2 and 3 to get 5") # Not sure this one
        self.assertEqual(result, 5)
```
While the London school's benefits seem appealing, they introduce issues. 

- The focus should be on verifying behavior, not individual classes. Difficulty in unit testing often indicates poor code design, which test doubles only mask. 

- Although identifying which functionality has a bug after a test failure is useful, it's often unnecessary since the cause is usually the most recent change.

- Finally, the biggest issue with the London School of unit testing is the problem of over-specification — coupling tests to the SUT’s implementation details.

So, should prefer Classical school in writing unit tests, London school just stands out for unit tests for large graphs of interconnected classes.

#### Three Styles
There are 3 styles of unit tests: output-based, state-based, and communication-based.
- Output-based testing (a.k.a result-based testing): Verifies that system outputs match expected results, treating the system under testing (SUT) as a black box and focusing on the correctness of final outputs given specific inputs.
This style only works for SUTs that don’t generate side effects.

![Output-based](/blog/images/write_valuable_test/output_based.jpeg)

- State-based testing: Verify the state of the SUT after the operation is completed. This style is useful for testing objects where the state changes over time due to operations.
![State-based](/blog/images/write_valuable_test/state_based.jpeg)

- Communication-based testing: Verify all communications are initiated in the correct order and with the correct parameters. This style is ideal for ensuring that units interact correctly with their dependencies.
![Communication-based](/blog/images/write_valuable_test/communication_based.jpeg)

Compared to state-based and communication-based testing, output-based testing creates tests that are not tightly coupled to implementation details, making them easier to maintain and resistant to refactoring.

However, writing unit tests following output-based testing requires the SUT must be pure modules.
Functional programming and architecture: `Functional programming as core, mutable objects as shell` facilitates writing unit tests following output-based testing:
![Functional core architecture](/blog/images/write_valuable_test/functional_core_architecture.png)

If you find that code is hard to write unit tests, it is a strong indication that the codes need to be refactored.

### Integration tests
Integration testing is a level of software testing where individual units or components are combined and tested as a group to ensure they work together correctly.
Integration tests verify how your system works in integration with out-of-process dependencies (database, file system, other services).
It focuses on verifying the interactions and interfaces between modules and detecting any issues in their integration.
- Integration tests cover controllers; unit tests cover algorithms and the domain model.
- Integration tests provide better protection against regressions and resistance to refactoring; unit tests have better maintainability and feedback speed.
When writing integration tests for a system that requires database (managed dependency), we should use a real database for integration tests (avoid using mock databases like SQLite)

The code base should be implemented with interfaces for unmanaged dependencies so that it is easier to have mock objects for these dependencies in writing tests.
