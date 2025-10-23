# Contributing to Pairings Project

Thank you for your interest in contributing! This project welcomes contributions from the community.

## Getting Started

1. **Read the documentation**
   - Start with [README.md](README.md)
   - Review [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
   - Check [docs/ROADMAP.md](docs/ROADMAP.md) for priorities

2. **Set up your development environment**
   - Follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
   - Ensure you can run locally

3. **Find an issue to work on**
   - Check the [Issues](https://github.com/yourusername/pairings-project/issues) page
   - Look for "good first issue" labels
   - Comment on the issue to claim it

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/pairings-project.git
cd pairings-project
git remote add upstream https://github.com/ORIGINAL-OWNER/pairings-project.git
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 3. Make Your Changes

- Write clean, documented code
- Follow existing code style
- Reference specs in [docs/](docs/)
- Add tests for new features
- Update documentation if needed

### 4. Test Your Changes

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### 5. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: implement Swiss pairing algorithm

- Add pairing logic for first round (random)
- Add subsequent round pairing by tournament points
- Implement no-rematch checking
- Add bye assignment logic

Refs #42"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference to related issue(s)
- Screenshots/demos if applicable
- Checklist of what was done

## Code Style Guidelines

### Backend (Node.js)
- Use ES6+ features
- Use `const` by default, `let` when needed
- Use async/await over callbacks
- Handle errors properly
- Comment complex logic
- Keep functions small and focused

### Frontend (React Native)
- Use functional components with hooks
- Use TypeScript types when applicable
- Follow React best practices
- Keep components small and reusable
- Use descriptive variable names

### Database
- Follow schema in [docs/DATABASE.md](docs/DATABASE.md)
- Use migrations for schema changes
- Add indexes for performance
- Use transactions when needed

### API
- Follow REST conventions
- Match specs in [docs/API.md](docs/API.md)
- Return consistent error formats
- Use appropriate HTTP status codes

## Testing

- Write tests for new features
- Maintain or improve code coverage
- Test edge cases
- Test error conditions

## Documentation

When adding features:
- Update relevant docs in `/docs`
- Update API.md for new endpoints
- Update DATABASE.md for schema changes
- Update ARCHITECTURE.md for design changes
- Keep README.md current

## Pull Request Process

1. **Ensure CI passes** (when set up)
2. **Get code review** from maintainers
3. **Address feedback** promptly
4. **Squash commits** if requested
5. **Merge** once approved

## Code Review Guidelines

### For Contributors
- Be open to feedback
- Respond to comments
- Make requested changes
- Ask questions if unclear

### For Reviewers
- Be constructive and kind
- Explain the "why" behind suggestions
- Approve when ready
- Thank contributors

## Reporting Bugs

Use the GitHub issue tracker:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional context**
Any other relevant information.
```

## Feature Requests

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context or screenshots.
```

## Questions?

- Check [docs/INDEX.md](docs/INDEX.md) for documentation
- Ask in GitHub Discussions
- Open an issue with the "question" label

## Community Guidelines

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the code, not the person
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Thanked in release notes
- Credited in commit history

Thank you for contributing! 🎉
