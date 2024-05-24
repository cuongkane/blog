# DJANGO PROJECT ARCHITECTURE
My journey in finding an appropriate project architecture for Django backend service in a micro-services system.

## Overview
Finding a suitable architecture to refactor a legacy Django backend project has been a challenging journey.

In this blog, I'm gonna share the most effective architecture for Django I've discovered so far and the insights gained along the way.

## Problem setup
All works should be derived from issues. There are some pain points about maintainability and scalability with the Legacy Django Project:

- A huge application folder (`api/`, `main/`,..) or big files (`utils.py`, `models.py`) contains every things.
It is hard for navigating between the project.

- Business logics are scattered on `utils` files.
It is hard to aware of where a business logic is located and causes the big mud issue on those big files.

- Changing data in persistence DB or interaction with external services are not centralized and aware.
It could from django models, utils, view folders, or anywhere in the project.
It is hard for maintainance and mocking in testing will be difficult to follow that.

- Coupling to unmanaged dependencies (out-of-process dependencies that the service doesn't fully control) can create challenges.
At some point, you might want to replace Redis with another system (like [KeyDB](https://github.com/Snapchat/KeyDB)). 
However, making this switch requires significant effort because many parts of your codebase (utils, views, models,...) call Redis directly and also have corresponding mock setups in unit tests.
This widespread dependency can stop you from migrating.

## Literature Review
I did a survey on well-known architectures such as Hexagonal Architecture([Check out my blog: Building Ideal Software Architectures
](https://lexuancuong.github.io/blog/posts/2023/11/ideal_software_architecture)):

Django has special features that prevent it from applying well-known architectures.

- Django includes ORM by itself following [Active Record pattern](https://docs.djangoproject.com/en/5.0/misc/design-philosophies/#include-all-relevant-domain-logic). It is hard to separate DB dependency (managed dependency) from domain model.

- Django has its guidelines to structure the project following official guidelines, so the architecture follows well-known architectures and doesn't fit Django's official guidelines.

- Django is known for its "batteries included" approach and strong conventions. Therefore, decoupling the framework from dependencies (managed and unmanaged dependencies) isn't easy. While almost modern architectures prefers maximize decoupling.

## Solution
Despite troubles with applying well-known architecture for Django framework, we cannot migrate to a new web framework (FastAPI, Flask,...), because:

- Team's familiarity and experience.

- Human and time resources are insufficient.

- Not targettedly solve addressed troubles.

Therefore, finding a robust architecture that could adopt a good mindset of modern architectures for the Django project and resolve our pain points is preferred.

Based on well-matured architectures such as Hexagonal, Clean Architecture, and also Domain-Drive Design, the main philosophy to refactor the Django project are `separation of concerns`.

Like physical scaling for infrastructure, there are also 2 kinds of seperation in a software project: Horizontal and Vertical.

1. **Separate Horizontally** (aka Bounded Context)

This seperation is usually used for splitting a big project into several applications.
The strategy is usually Domain-Driven Design.

Let's say you have a service to manipulate charts and follow alerts.
There are surrounding logics related to charts and alerts. 

The design architecture should separate that big service into 2 smaller applications: `charts` and `alerts` (plural noun as the recommendation from Django).

And then charts and alerts will talk with each other via `services` interface.

It creates room for migrating the `charts` or `alerts` into different micro services when the logic become bigger.

2. **Separate Vertically**

There are merely 3 layers in an application: Application, Business and Infrastructure layer.

- Application layer: Validate incoming requests and ensure outgoing responses follow service interface (for Rest API or Event Processing).

- Domain: The heart of your application. All business logics are located in this domain layer. Any side effect (change requests to infrastructure) are located from this layer.

- Infrastructure layer: Handle dependencies. In a micro-services system, there are 2 kind of dependencies: managed and unmanaged dependencies.
    - Managed dependencies are mostly owned data sources (Database, disk storage,..).
    - And unmanaged dependencies are data sources that shared with others.

With DDD, we have entity and aggregate objects to express the data schema for business layer.

We use `django.db.models.Model` class to define these objects.
Based on that, Django also support generate DB migration files arccordingly. 

Application and Infrastructure layers depend on business layer.

![Domain layer is the heart of the application](/blog/images/django_project_architecture/ddd.png)

## Django Project Architecture

Continue with the sample problem that I mentioned in the previous part.

We have a service with 2 smaller applications: `charts` and `alerts`.

- `charts` will have Rest APIs to get/list/create/update/delete chart objects.

- `alert` will have Rest APIs to get/list/create/update/delete alert objects and a cron job to evaluate data and send alert if needed.

The folder structure for this application will be:

```shell
├── project_name
    ├── asgi.py
    ├── settings.py
    ├── wsgi.py
    ├── urls.py
    ├── celery.py
├── core
    ├── clients
        ├── kafka_client.py
        ├── redis_client.py
        ├── another_service_client.py
    ├── utils
        ├── string_util.py
        ├── celery_util.py
        ├── array_util.py
    ├── tests
        ├── test_clients
            ├── test_kafka_client.py
            ├── test_redis_client.py
            ├── test_another_service_client.py
├── charts
    ├── models
        ├── chart.py
    ├── services
        ├── create_chart_service.py
    ├── repositories
        ├── chart_repository.py
    ├── views
        ├── v1
            ├── charts
                ├── filter_chart_view.py
                ├── get_chart_view.py
                ├── update_chart_view.py
            ...
    ├── tests
        ├── views 
            ├── v1 
                ├── charts
                    ├── test_filter_chart_view.py
                    ├── test_get_chart_view.py
                    ├── test_update_chart_view.py
├── alerts
    ├── models
        ├── alert.py
    ├── services
        ├── create_alert_service.py
    ├── views
    ├── tasks
        ├── evaluate_alert_task.py

```
Explaination:
1. `project_name/`: Contains the main configuration files for the Django project.

- `asgi.py`, `settings.py`, `wsgi.py`, and `urls.py` are standard Django files for ASGI configuration, project settings, WSGI configuration, and URL routing respectively.

`celery.py` is a separate file used for configuring Celery within the Django project. The `CELERY_BEAT_SCHEDULE` is declared in this file to manage scheduled jobs.

2. `core/`: Contains core functionalities, utilities, and clients used across the project.

- `core/clients` (Infra layer): Contains client modules for interacting with external services such as Kafka, Redis, or other third-party services.

- `core/utils`: Contains utility modules with commonly used functions such as string modifications, Celery helper functions, or array manipulations...

- `core/tests`: Contains unit tests for client modules and utilities.

3. `charts/`: Represents the charts application.
- `charts/models` (Domain layer): Contains Django models related to charts (DDD's entities).

- `charts/services` (Domain layer): Contains service modules responsible for business logic related to charts (e.g., creating charts).
This layer works as a unit of works in DDD.

- `charts/repositories` (Infra layer): Contains repository modules responsible for data access related to charts (e.g., fetching charts from the database).

- `charts/tests`: Contains unit tests for views and other components related to charts.

4. `alerts/`: Represents the alerts application.
- `alerts/models` (Domain layer): Contains Django models related to alerts (DDD's entities).
- `alerts/services` (Domain layer): Contains service modules responsible for business logic related to alerts (e.g., creating alerts).
- `alerts/views`(Application layer): Contains view modules responsible for handling HTTP requests and responses related to alerts.
- `alerts/tasks`(Application layer): Contains Celery task modules responsible for periodic tasks related to alerts (e.g., evaluating alerts and sending notifications).

This project architecture follows a modular approach, organizing codebase into separate components (applications) based on their functionalities (charts, alerts) and reusability (core, clients, utils).

## Example
Let's make an example to fulfill the requirement following the above architecture:
- A chart could have multiple alerts.
- An alert could be muted and unmuted by customers.
- A scheduled job to evaluate alerts and send an email report for alerts belonging to one chart.

Here is step by step of implementation with the above project architecture.

1. We'll start by updating the Chart and Alert models to include the necessary fields and logic.

For chart models:
```python
# charts/models/chart.py

from django.db import models

class Chart(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    data = models.JSONField()
```

For alert model:
```python
# alerts/models/alert.py

from django.db import models

class Alert(models.Model):
    chart_id = models.Integer()
    message = models.TextField()
    muted_by_customer = models.BooleanField(default=False)

    def mute(self):
        self.muted_by_customer = True

    def should_send_alert(self, data) -> bool:
        ...
    def generate_alert_message(self) -> str:
        ...
```

2. Add needed methods to alert repository.

```python
# alerts/repositories/alert_repository.py
from alerts.models import Alert
class AlertRepository:
    def get(self, alert_id: int) -> Alert | None:
        try:
            return Alert.object.get(alert_id)
        except Alert.ObjectDoesnotExit:
            return None

    def save(self, alert: Alert):
        return Alert.save()

    def filter_by_chart(self, chart_id) -> QuerySet[Alert]:
        return Alert.objects.filter(chart_id=chart_id)
```

3. Add email client for sending email stuff.

```python
# core/clients/email_client.py
class EmailClient:
    def send_email(subject, message, sender, recipients) -> bool:
        # Implement email sending logic using an external email service
        pass
```

4. Add chart service to get chart's data.

Applications commute with each others via public services instead of implementation details.

Facilitate migrating to new services when the complexity is increased.

```python
# charts/services/get_chart_data_service.py
@dataclass
def GetChartDataService:
    chart_repository: ChartRepository = field(default_factory=ChartRepository)
    def excute(self, chart_id: int) -> dict:
        chart = chart_repository.get(chart_id=chart_id)
        return chart.data
```

5. Add alert service to evaluate alert and send email.

```python
# charts/services/evaluate_alerts_and_send_report_service.py
from alerts.models import Chart
from alerts.repositories import AlertRepository
from charts.services import get_chart_data
from core.clients.email_client import EmailClient

class EvaluateAlertsAndSendReportService:
    def __init__(self, chart_id):
        self.chart_id = chart_id
        self.alert_repository = AlertRepository()
        self.email_client = EmailClient()

    def execute(self) -> bool:
        alerts = self.alert_repository.filter_by_chart(chart_id)
        unmuted_alerts = [alert for alert in alerts if not alert.muted_by_customer]
        if not unmuted_alerts:
            return False
        data = GetChartDataService(chart_id).execute() or {}
        messages = [alert.generate_alert_message() for alert in unmuted_alerts if alert.should_send_alert(data)]
        accumulated_message = "\n".join(messages)
        sender = "from@example.com"
        recipients = ["to@example.com"]
        self.email_client.send_email("Schedule Alert", accumulated_message, sender, recipients)
        return True
```

6. Declare Celery task for evaluate_alerts_and_send_report.

This one deals with Celery task cronjob definition instead of business logic.
```python
# charts/tasks/evaluate_alerts_task.py
from celery import shared_task
from alerts.services import EvaluateAlertsAndSendReportService

@shared_task()
def evaluate_alerts_and_send_report(chart_id: int):
    logging.info('Some debug log for this cron job ...')
    service = EvaluateAlertsAndSendReportService(chart_id)
    service.execute()
```

## Strengths
Beyond solving pain points mentioned in the `Problem setup` part, the new project architecture has this strength:

1. Facilitate separating a big service into microservices

In the above example, we separated based the root entities: `chart` and `alert`.

If the project can grow and be added new features, we could separate the service into micro services based on 2 isolated application to keep the service small.

It is better for scaling and maintaining processing by that way.

2. Facilitate writing readable unit tests.

Instead of mocking modules based on path, we could pass it directly into the input.

Before:
```python
class TestEvaluateAlertAndSendReportService(SimpleTestCase):
    @patch('abc.xyz.email_client')
    @patch('abc.xyz.service_a_client')
    def test_should_send_email_when_meet_the_condition_to_trigger(
        self,
        mock_email_client,
        mock_service_a_client
    ):
        mock_service_a_client.get_value.return_value = fake.pystr(6)
        self.mock_email_client.send_email.return_value = True
        mock_email_client = self.mock_email_client

        total_value = evalue_alert_and_send_report_util(data={'foo', 'bar'})

        self.mock_email_client.send_email.assert_called_once()
```

After:
```python
class TestCalculateTotalValueService(SimpleTestCase):
    def test_should_send_email_when_meet_the_condition_to_trigger(self):
        self.mock_service_a_client.get_value.return_value = fake.pystr(6)
        self.mock_email_client.send_email.return_value = True

        service = CaculateTotalValueService(
            data = {'foo': 'bar'}
            email_client=self.mock_email_client,
            service_a_client=self.mock_service_a_client,
        )
        total_value = service.execute()

        self.mock_email_client.send_email.assert_called_once()

```
It is straightforward to declare the input and the expected output. 
It is more readable and maintainable (resistence to refactoring).

## Drawbacks
1. Dependency Injection Violation As you can see, I don't introduce interfaces (repository and clients) for infrastructure layer.
Therefore, we wouldn't have dependency injection features, other layers depend on the Repository's implementation details instead of an interface class.
But we accept this drawback because:
    - Duration with Django: Django ORM works as a repository and we decided to stick with Django. So, it is unnecessary to declare interfaces for the repository layer.
    - Less Boilerplate: Avoiding interfaces can reduce the amount of boilerplate code, making the implementation more straightforward and reducing initial development time.
    - Non-Complex Applications: We would like to apply this application for microservices, as the service size is small.
    - Stable Dependencies: The third-party services or remote clients are stable and also mostly handled by the in-house team, so, the risk associated with direct dependency is reduced.

## FAQ
1. Is it necessary to have `repository` layer meanwhile Django ORM could take the duty of this layer?

Basically, Django ORM could take the duty of `repository` layer.
Because it supports 5 SQL databases and allows the use of in-memory databases for testing.
But, I introduce repository layer in order to: 
    - Separate the saving/getting persistence data duty from Django models. So that, Django models could work as DDD's entities only (Single Responsibility).
    - Application layer could use repository layer for simple query logics. 
    - Centralizing saving/getting DB records could be useful to manage queries to database. 

2. When should we move logic from `views/` folder to a separate service (`services/` folder)?
Here are the main points to consider when deciding whether to move logic from a view to a separate service:

- Complexity: If the logic is becoming too complex for a view function to handle efficiently, consider moving it to a separate service.

- Reusability: If the logic is likely to be reused in multiple parts of the application, extracting it into a service can promote code reuse and reduce redundancy.

- Maintainability: Separating business logic into services improves code maintainability by adhering to the principle of separation of concerns.

## Conclusion
Aligning an architecture for the team is always a hard part.
It depends so much on team's aspects.
With Django, the problem is even harder.

If we could utilize Django's `batteries` to build a maintainable with seperation of concerns, it could create a robust architecture to achieve the stability and productivity for your Django project.
