##JiraMate

## Inspiration
Pain points that product managers endure through struck us hard. We empathized with the need to automate repetitive workflows, where AI wrappers can streamline such work for a product manager, especially the ones that product managers spend the most time in. 

## What it does
We built a web AI tool that acts as an extension to Jira, a widely used product management tool, fetching latest data from a product(its current tasks, backlog information, epics, etc.), and transforming it into smart insights that remove the need for product managers to do manual tasks. Their backlogs will be sorted based on the most important priorities, user stories will be created based on feature requests, the correct acceptance criterium will be applied, all based on all previous data collected in Jira. Everything can be pushed back onto Jira, making JiraMate a smart and ever-evolving AI partner to Jira.

## How we built it
We used NodeJS and express for the backend. We used the Nemotron APIs as our AI models. We had firebase as our database storing user stories and all interactions with the product manager. We built the frontend with ReactJS and Tailwind CSS. Did our initial designs of the interface in Figma.

## Challenges we ran into
We encountered several technical and conceptual challenges during the development process.The primary issue was understanding the actual pain points of product managers and how Jira workflows operate in practice. Since our team was initially unfamiliar with Jira, we attended workshops and spoke directly with PNC representatives to refine our concept and ensure our solution aligned with their needs. Another significant challenge was with the Nemotron API. Our requests to its server failed inconsistently, so had to do extensive debugging and review of the API documentation to resolve. Additionally, integrating OpenRouter for API linking was difficult at first. We faced multiple connection and configuration issues, but through experimentation, debugging, and leveraging AI LLMs to troubleshoot complex errors, we achieved a stable integration.

## Accomplishments that we're proud of
We are proud to finally have built an application that employs AI in its function, that too something that optimizes workflow for product managers. We are glad to have gone through this process as we more clearly understand the role of a product manager and their importance in working a product through its lifecycle. We are also proud to have built a full stack application, and to have gone through the process of identifying a problem to fully solving it.

## What we learned
We learned that working with AI in applications is not as complex as we imagined. It is just an API that could be included with some backend logic that needs to implement. We also learned that dividing and conquering, but also convening at tricky moments, can be the best strategy to achieve the most during a short time period. It is possible to build an actual solution within a day. Additionally, AI as a tool to maximize productivity is truly a life-changing occurrence that exists in the world today. It is able to do what humans would do in hours, in 5 seconds, and that is monumental for boosting efficiency. We will definitely employ AI to do more tasks in our projects going further.

## What's next for Team Registration
So far, we have largely focused on creating an optimization solution for the lifecycle stage of requirements and development. We would like to expand our chatbot to be able to work with any stage of the lifecycle in the future. 
