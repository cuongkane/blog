# Django-Ninja: Is DRF over?
A new framework for building APIs with Python and Django could beat DRF?

# 1. Overview

Recently, buidling Rest API application is a common task in internet industry.

There are many frameworks and libraries support implementation these applications.

Django is oldest web framework in Python world (since 2005).

It provides rapid development, clean and pragmatic design.

To avoid boilerplate code and speed up repeated tasks when building Rest API Application, the most known tool is Django Rest Framework.

Django Rest Framework is well mature and have been chosen by many companies and people.

But there are some painful point when dealing with DRF so that we need another alternative candidate - Django Ninja was born.

# 2. Django Ninja Introduction

## Motivation

## Philosophy

## CRUD API applicatin
Here is a simple CRUD application with Django Ninja.

```python
from datetime import date
from typing import List

from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema

from books.models import Book

api = NinjaAPI()

class BookIn(Schema):
    name: str
    author: str

class BookOut(Schema):
    id: int
    name: str
    author: str
    created_date: datetime

@api.post("/books/", response=BookOut)
def create_book(request, payload: BookIn):
    book = Book.objects.create(**payload.dict())
    return {"id": book.id}

@api.get("/books/{book_id}", response=BookOut)
def get_book(request, book_id: int):
    book = get_object_or_404(book, id=book_id)
    return book

@api.get("/books", response=List[bookOut])
def list_books(request):
    return book.objects.all()

@api.put("/books/{book_id}", response=BookOut)
def update_book(request, book_id: int, payload: bookIn):
    book = get_object_or_404(book, id=book_id)
    for attr, value in payload.dict().items():
        setattr(book, attr, value)
    book.save()
    return book

@api.delete("/books/{book_id}")
def delete_book(request, book_id: int):
    book = get_object_or_404(book, id=book_id)
    book.delete()
    return {"success": True}
```

From the sample code, we could recognize that the simplicity without magic implementation of Django Ninja.
All request and response class was define concretely and specify on every endpoint.
They are automatically visulized on the Open Swagger UI of this web application.

We will dive into all outstanding points of Django Ninja in the next part.

# 3. Django-Ninja vs DRF
## Performance
Django-ninja's performance is significantly higher than DRF (parsing, validating, exporting,...) based on Pydantic.

There are a benchmark for Django, DRF and Flask+Marshmallow. With these API endpoint:
For DRF:
```
@api_view(['POST'])
def create(request):
    data = Model(data=json.loads(request.body))
    assert data.is_valid()
    return Response({'success': True})
```

For Django Ninja:
```
@api.post("/create")
def create(request, model: Model):
    return {"success": True}
```

For Flask + Marshmallow:
```python
@app.route("/api/create", methods=["POST"])
def create():
    json_data = request.get_json()
    data = model_schema.load(json_data)
    return {"success": True}, 201
```

(Environment: The same WSGI with one currency and Hardware)

Eventually, Django-ninja is faster 2 times than DRF at serializing task.
![benchmark](/assets/images/django_ninja/benchmarks.png)

## Syntax

Django-ninja write and define schemas is the same as Pydantic.

So, like Pydantic, schema classes follow the [PEP 484](https://peps.python.org/pep-0484/): `variable_name: type`.

It is explicitly straight forward and could be ensure by almost linter/code diagnostic (i.e mypy, pyright,...) without installing extra library for type checking.
For example, define schema classes in Django-ninja is:

```python
class UserRequest(pydantic.BaseModel):
  name: str
```

For DRF, we need to install [drf-stubs](https://github.com/typeddjango/djangorestframework-stubs) package to support linter tools verify type hints.

the way to define DRF's classes we need to learn about DRF convention.

For example:
```python
class UserRequest(drf_serializers.Serializer):
  name = serializers.CharField()
```

This explicity feature is the most attractive one for me.

## Explicity

It has mandatory type hints for function arguments that make the API specification very straightforward, and easy to write, read and maintain.
```python
@api.post("/books/", response=BookOut)
def create_book(request, payload: BookIn):
    book = Book.objects.create(**payload.dict())
    return {"id": book.id}
```
From the feature, we could

## Boilerplate
We don't need to write these extra lines to validate the payloads when using django-ninja:
```
    input_serializer = ShipmentIdentifierRequestSerializer(data=request.query_params)
    input_serializer.is_valid(raise_exception=True)
    validated_data = input_serializer.validated_data # a dictionary
```
These DRF's boilerplate code make the application so complicated.
This will help us have more concise code. In typical cases, the more line of code we have, the more risks we must face. (obey DRY principles)

## API Documentation

Django-ninja supports generating Swagger API documentation automatically from the API specification on application API endpoints.

![Swagger API documentation generated by django-ninja](TODO define it)

With DRF, we need to install an external library [drf-yasg](https://github.com/axnsan12/drf-yasg) to generate the Swagger API docs.

Due to implicit code, `drf-yasg` has a problem in addressing the schema of POST request payload. `drf-yasg` cannot identify the request payload schema because it is hidden from the API interface.

```python
@api_view(['POST'])
def create(request):
    data = Model(data=json.loads(request.body)) # the request schema is specified behind the API interface.
    data.is_valid(raise_exception=True)
    validated_data = data.validated_data
```

## Maturity

DRF is older than Django-ninja (Django-ninja is just 3 years old).

DRF has a lot of documentation, blog posts, answers on StackOverflow, etc.

But Django-ninja is minialist and the documentation that easily to learn from start.

(It just took me around 40 minutes to read all of Django-ninja documentation. For DRF, it took me a lot of days to fo through all of its features (these things that I haven't used at this moment))

# 4. Project Structure

To build up an API application, you could follow my fine-tuned project structure. It is quite explicit and follow common archiecture principles.

# 5. Conclusion
