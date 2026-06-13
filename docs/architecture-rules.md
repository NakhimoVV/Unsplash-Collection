# Architecture Rules
The project follows Feature-Sliced Design (FSD).
Reference:
https://fsd.how/ru/docs
Allowed dependency direction:
app → widgets → features → entities → shared
Lower layers must never import upper layers.

- Folder "pages" не используем, потому что проект Next.js 16 (App Router)
- Keep reusable UI in `shared/ui`.
- Keep API clients and server utilities separated.
- Keep database logic on the server only.
- Do not expose secrets to client components.