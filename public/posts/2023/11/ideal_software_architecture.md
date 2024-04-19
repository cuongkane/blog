# Building Ideal Software Architectures

## Ideal Software Architecture Metrics
When starting the process of crafting a software architecture tailored to a particular project, it's not just about making sure it meets the project's needs.

It's equally important to consider 5 non-functional requirements:

- **Comprehensiveness**: An effective architecture provides developers with a cohesive and easily navigable structure. Clarity and coherence empower code readers to grasp the entirety of the project's components effortlessly.

- **Flexibility**: The hallmark of a robust architecture lies in its adaptability to conceptual changes with minimal effort and code modifications.
Whether it's integrating new features, optimizing existing logic, or even transitioning to different frameworks or databases, flexibility ensures seamless evolution.

- **Fast delivery**: For startup projects, this requirement is crucial 

- **Maintainability**: The ease of investigation, bug fixing, and addition of minor features defines the maintainability of a codebase. Achieving maximum conceptual changes with minimal code alterations is indicative of a well-maintained architecture. Encapsulation, low coupling, and high cohesion serve as prerequisites for a maintainable codebase.

- **Testability**: A testable architecture lays the foundation for comprehensive testing methodologies, enabling the creation of unit tests and integration tests for all components and features. Clear interfaces and component integration facilitate thorough testing, ensuring the robustness of the system.

In this post, I will address the evolution of architectures and evaluate them following these 4 non-functional requirements.

## Evolution of Software Architectures

### Spaghetti Architecture
#### Summary
Spaghetti Architecture represents an early, disorganized approach to software development.
Modules and components are intertwined without a clear structure, resembling tangled strands of spaghetti.
This lack of organization leads to complexity, making the codebase difficult to understand and maintain.

#### Advantages
- **Fast delivery**: Quickly deliver the project at the beginning time.

#### Disadvantages
- **Comprehensiveness: Lack of Structure**. Modules are interwoven, making the codebase difficult to navigate.
- **Flexibility: Maintenance Nightmare**. Modifications and additions are challenging due to the lack of clarity.
- **Maintainability: Poor Scalability**. The architecture inhibits growth and the addition of new features.
- **Testability: Hard for unit test**. Could only support integration tests or end-to-end tests.
It is not separated of concerns, so, writing unit tests for chaotic components is impossible.

### Layered Architecture
Layered architecture, prevalent in web development, segregates components with similar functionalities into distinct layers.

#### Summary
The layered approach organizes modules into horizontal layers, each serving a specific role within the application. Emphasizing the separation of concerns, this architecture fosters clarity in understanding individual layers and their interrelationships.

![General Layered architecture diagram](/blog/images/software_architecture/layered_architecture.png)

MVC (Model-View-Controller) stands as a prominent variant of the layered structure.

Monolith Systems or small projects usually utilize layered architectures to organize the source code.

#### Advantages
- Comprehensiveness: Promotes separation of concerns.
- Testability: Reduces dependency, facilitating easier testing of individual components.
- Fast delivery: Quickly implemented to meet the requirements because of low complexity.

#### Disadvantages

- Flexibility: Limited scalability due to framework constraints.

- Maintainability: Maintenance challenges stemming from interdependence between layers. Incomplete encapsulation may also lead to cross-layer dependencies.

### Hexagonal Architecture
The Hexagonal Architecture, also known as ports and adapters, offers a paradigm shift in isolating core application logic from external dependencies.

#### Summary
Introduced by Alistair Cockburn in 2005, the Hexagonal Architecture aims to decouple the core logic of an application from external dependencies such as databases and user interfaces.

This abstraction facilitates seamless testing and refactoring, empowering developers to adapt to evolving requirements effortlessly.

![Hexagonal architecture diagram (Source: Internet)](/blog/images/software_architecture/layered_architecture.png)

Hexagonal architecture inherits the mindset of DDD (Which was Introduced by Eric Evan in 2003) in design all things go inward central domain: Domain Model (The part that the author believes is the least changed part and the heart of the system)

Domain Model has Domain Services to rely on and coordinate with external dependencies (including DB as well) via Ports(for querying data) and Adapters(for changing data) to build up the system flow.

#### Advantages
- Really Flexibility: Decouple from libraries and frameworks (But still couple on Programming Language)
- Good for maintainability: Separation of concerns when system components are categorized into specified layers with concrete roles. Easy to replace port or adapter in case of incident.
- Easy to comprehend: Read the domain services could tell us about the main business logic of the system.
- Facilitate testing: Mock ports/adapters to produce fast feedback and don't need to write integration tests.

#### Disadvantages
- Fast delivery: It is hard to fulfill the requirement quickly with Hexagonal Architecture. Due to its complexity with multiple components, the inexperienced team cannot adapt to this one or cannot keep the productivity.
- From my perspective, it is not suitable for structure source code in a microservices architecture. Because the microservice mindset is breaking the system into small micro services for fast delivery.

## Conclusion
Finding a suitable code architecture is not easy at all, it must fit with almost all the team members instead of just focusing on achieving vague targets.

Because human is the main heart of the project.
