# ENHANCE CODE QUALITY WITH BLACK(FORMATTER) AND RUFF(LINTER) IN PYTHON
Utilize formatter and linter to speed up development and analysis errors.

---
## Outline

**1. Overview**

What are Code Formatter and Linter? And a quick tour with some typical tools.

**2. Code formatter with Black**

Introducing Black as a code formatter and how to configure it.

**3. Linter with Ruff**

Introducing Ruff and how to configure it.

---
## Overview
### Code formatter(fixer)

Code formatter is a tool/library that converts source code from one format style to another following its rules. The most popular rule is PEP8.

Common code formatter in Python:

- autopep8

Format Python code to conform to the PEP 8 style guide.

- black

Uncompromising Python code formatter.

- prettier

Opinionated code formatter, not only for Python.

- yapf

Yet another Python code formatter from Google.

### Linter

Linter is a software tool that analyzes static code and then reports errors, bugs, stylistic errors, and suspicious constructs.

There are many lines in Python:

- Pylint

Checks for errors try to enforce a coding standard and looks for code smells.

- PyFlakes

Analyzes programs and detects various errors.

- pycodestyle

Checks against some of the style conventions in PEP 8.

- Bandit

Analyzes code to find common security issues.

### Why do we need Code Formatter and Linter?

High-quality code identifiers are:

1. It does what it is supposed to do.

2. It does not contain defects or problems.

3. It is easy to read, maintain, and extend.

With Code Formatter and Linter, we could:
1. Enhance the Code Quality:
- By using the same code format, it is easier to read maintain and extend.
- With a linter, it is easy to spot common bugs like an undefined variable, break-outside-loop, and if-tuple,...

2. Support reviewing code by an automatic process to quickly detect issues/errors and spot missed style codes.

3. Don't need to care about the code style when writing code.
- It helps us focus on the problem we want to solve and code solutions,
  rather than getting distracted by code structure and minor stylistic differences.

- Code formatting will help you format it following configured styles after coding.

## Code formatter with Black

Introducing Black as a code formatter and how to configure it.

### Black Introduction

- Black is the uncompromising Python code formatter that follow PEP8 guideline.

- Black can reformat the entire file in place according to the Black code styles.

- Latest version of Black is `23.1.0`.

### Black Comparison
1. Usage: Simple and easy to use.

2. Configuration: Black supports `pyproject.toml` file.
Writing TOML files is quite similar to writing Python code.

4. Feature: With `--check` option, Black allows both auto-formatting and checking on the CI pipeline.
(Beat `autopep8` and `yapf` at this point, more strictly than autopep8).

3. Popularity: Black is the most popular formatter tool(with 31.5k GitHub stars) and many open sources outside are applying it.

If you are familiar with it, you will have a consistent style of reading code from open source.

### Black Feature
1. Wraps lines
```py
# in:
j = [1,
     2,
     3
]

# out:
j = [1, 2, 3]
```
2. Format code to satisfy the line length.
```py
# in:
data_io_resp = retrieve_booking_data_from_data_io(organization_id=meta_data.organization_id, carrier_reference=meta_data.carrier_reference)

# out:
data_io_resp = retrieve_booking_data_from_data_io(
    organization_id=meta_data.organization_id,
    carrier_reference=meta_data.carrier_reference,
)
```
4. Remove redundant empty lines and spaces.
5. Auto-adding empty lines between classes, functions, and class methods.

6. Auto adding a trailing comma.
> Avoid confused when writing a tuple with one element.

> Easy to extend more arguments later.

```py
# in:
data_io_resp = retrieve_booking_data_from_data_io(
    organization_id=meta_data.organization_id,
    carrier_reference=meta_data.carrier_reference
)

# out:
data_io_resp = retrieve_booking_data_from_data_io(
    organization_id=meta_data.organization_id,
    carrier_reference=meta_data.carrier_reference, <- trailing comma will be added
)
```

7. Support long call chains.
```
# In
result = (
    session.query(models.Customer.id).filter(models.Customer.account_id == account_id, models.Customer.email == email_address,).order_by(models.Customer.id.asc()).all()
)

# Out
result = (
    session.query(models.Customer.id)
    .filter(
        models.Customer.account_id == account_id,
        models.Customer.email == email_address,
    )
    .order_by(models.Customer.id.asc())
    .all()
)
```

1. To set up Black to follow our Python coding guidelines,there are some options that we need to configure:
```
skip-string-normalization = true
```
(Black defaults to 88 characters per line. You should keep this number to make your code more readable.)
2. To apply a black formatter on your directory:
Just need to add your configuration into `pyproject.toml` file and then simply run:
```
black path/to/your/directory/
```

To add the Black check into your CI, could use the constructed template from Anoork by adding these lines into `.gitlab-ci.yml`
```
stages:
  - black-check

include:
  - project: 'devops/gitlab-ci-template'
    ref: master
    file: 'code-check.gitlab-ci.yml'
```


### Black Drawback
- Doesn't format comment.

- Use the double quote as default.

- Couldn't split the line to ensure its length is less than the configured max-line-length option.

- Black only supports Python 3.7+.

- In some cases, the formatted code is harder to read (rarely).



---
## Linter with Ruff

Introducing Ruff and how to configure it.

### Ruff Introduction
- Ruff is an open-source linter for Python code written in Rust.

- Ruff currently supports python3.7 -> python3.10.

- Ruff's rules are combined from many popular linters (like Pyflakes, pycodestyle, flake8,...).

- The first version was published on Aug 30, 2022. The latest version of Ruff is `0.0.254`.

#### Ruff Comparison
1. Speed: Ruff is extremely fast.
I tried on a repo: 129255 Python lines.
```bash
>> cd pp_scraper
>> cat $(find . -name "*.py") | grep -E -v '^\s*$|^\s*#' | wc -l
129255
```
With flake8, it takes 12.28 to run the linter over these lines.
```bash
>> time flake8 .
flake8 .  12.28s user 0.18s system 99% cpu 12.510 total
```
It is jus 0.03s with ruff.
```bash
>> time ruff .
ruff check .  0.03s user 0.11s system 177% cpu 0.078 total
```

2. Linter rules: Aggregate many code styles/errors/diagnostic (including Flake8's rules) and propose a lot of configuration options.

- Ruff supports over 500 lint rules, many of which are inspired by popular tools like Flake8, isort, pyupgrade, and others.

- Regardless of the rule's origin, Ruff re-implements every rule in Rust as a first-party feature.


3. Configuration: Configure via pyproject.toml.
- From [PEP518](https://peps.python.org/pep-0518/), the configuration file for a Python project was recommended with TOML file format.

| Feature                     | TOML       | YAML      | JSON      | CFG/INI |
| --- | --- | ---- | --- | --- |
| Well-define                 | yes        | yes       | yes       | no      |
| Real data types             | yes        | yes       | yes       | no      |
| Reliable Unicode            | yes        | yes       | yes       | no      |
| Reliable Comment            | yes        | yes       | no        | ??      |
| Easy for human to edit      | yes        | ??        | no        | ??      |
| Easy for tool to edit       | yes        | ??        | yes       | yes     |
| Easy for pip to vender      | yes        |           | no        | no      |

Ruff supports well with both `pyproject.toml` or `ruff.toml`

4. More features: Besides linter, Ruff is also a great tool for formatting(fixer)
- With option `--fix`, ruff could be an effective code formatted besides Black or other formatting tools.

5. Quickly get a detailed description of rule
  ```
    ruff rule {error_code}
  ```
  For example:
  ```
    ╰─ ruff rule F522
        # string-dot-format-extra-named-arguments (F522)

        Derived from the **Pyflakes** linter.

        Autofix is always available.

        Message formats:
        * `.format` call has unused named argument(s): {message}

  ```

### Ruff Feature
1. PLW2901 `for` loop variable `column` overwritten by assignment target
```py
for column, query in filter.items():
  column = column.split(".")
```

2. E741 Ambiguous variable name: `l`
```py
for l in data:
  ...
```

3. F821 Undefined name `err`
```py
try:
    do_sth()
except Exception as exc:
    print(f"Failed to precess because {err}")
```

4. f-string without any placeholders
```py
dummy_string = f"foo bar"
```

5. Argument `format` is shadowing a python builtin
```py
def do_sth(format: Optional[str] = None)
  ...
```

6. B904 Within an `except` clause, raise exceptions with `raise ... from err` or `raise ... from None` to distinguish them from errors in exception handling
```py
try:
  do_sth()
except Exception as err:
  raise ValueError('')
```

7. E722 Do not use bare `except`
```py
try:
  do_sth()
except:
  print('Failed to process')
```

8. C408 [*] Unnecessary `dict` call (rewrite as a literal)
```py
sth = dict(foo=10, bar=10)
```

9. B006 Do not use mutable data structures for argument defaults
```py
def bookmark_info(only: list = []):
```

### Ruff Application
1. Docstring should use double quotes
```toml
[tool.ruff.flake8-quotes]
  docstring-quotes = "double"
```

2. Ignore some accepted issues:
```toml
[tool.ruff]
ignore = [
# Ignore Line too long
'E501',
# module-import-not-at-top-of-file
'E402',
# multiple-imports-on-one-line
'E401'
]
```

3. Group imports
```toml
[tool.ruff.isort]
known-third-party = ["dateutil","requests", "boto3", "django", "rest_framework", "pydantic"]
known-first-party = ["pp_saturn", "api", "scatter", "pp_data_io"]
combine-as-imports = true
force-wrap-aliases = true
```

### Ruff Drawback
- Ruff is rough literally.

- Only support 3.7+. Cannot be installed on Python3.6.

- Too many rules/setting options.

- Need time to apply to all of the team members.
