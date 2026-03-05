# Contributing to InfinityLoop

Thank you for your interest in contributing to InfinityLoop! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Prerequisites**
   - [Bun](https://bun.sh) >= 1.0
   - [Docker](https://www.docker.com/) and Docker Compose
   - [Git](https://git-scm.com/)

2. **Clone the repository**

   ```bash
   git clone https://github.com/ezaz-ahmed/InfinityLoop
   cd InfinityLoop
   ```

3. **Run setup script**

   On Windows:

   ```bash
   setup.bat
   ```

   On macOS/Linux:

   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

4. **Start development**
   ```bash
   bun run dev
   ```

## Project Structure

- `apps/web`: Svelte frontend application
- `apps/api`: Hono backend API
- `turbo.json`: Turborepo pipeline configuration
- `docker-compose.yml`: Docker services

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body

footer
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(api): add user profile endpoint
fix(web): resolve authentication redirect issue
docs: update setup instructions
```

### Pull Requests

1. Create a new branch from `main`

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes

3. Test your changes

   ```bash
   bun run type-check
   bun run lint
   ```

4. Commit your changes

5. Push to your fork

   ```bash
   git push origin feat/your-feature-name
   ```

6. Open a Pull Request on GitHub

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure all checks pass
- Keep PRs focused and atomic

## Database Changes

When making database schema changes:

1. Update `apps/api/src/db/schema.ts`
2. Generate migration:
   ```bash
   cd apps/api
   bun run db:generate
   ```
3. Review the generated migration
4. Apply migration:
   ```bash
   bun run db:push
   ```

## Adding Dependencies

Use Bun to add dependencies:

```bash
# Add to root
bun add -D <package>

# Add to specific app
cd apps/web  # or apps/api
bun add <package>
```

## Testing

Currently, tests are not set up. Contributions to add a testing framework are welcome!

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
