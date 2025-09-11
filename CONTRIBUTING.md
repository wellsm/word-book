# Contributing to Word Book 🤝

Thank you for your interest in contributing to Word Book! We welcome contributions from everyone, regardless of experience level.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm
- Git

### Setting up your development environment
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/word-book.git
   cd word-book
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- Use the GitHub issue tracker
- Include detailed steps to reproduce
- Provide browser/device information
- Include screenshots if applicable

### ✨ Feature Requests
- Check existing issues first
- Describe the feature clearly
- Explain the use case and benefits
- Consider implementation complexity

### 💻 Code Contributions
- Pick an issue labeled `good first issue` for beginners
- Comment on the issue before starting work
- Follow our coding standards
- Write tests for new features

## 📝 Development Guidelines

### Code Style
- We use **Biome** for linting and formatting
- Run `npm run lint` before committing
- Follow TypeScript best practices
- Use meaningful variable and function names

### Component Structure
```
src/components/
├── ui/          # Reusable UI components (shadcn/ui)
├── app/         # Application-specific components
└── ...
```

### Commit Messages
Follow conventional commits format:
```
type(scope): description

feat(quiz): add multiple choice quiz mode
fix(modal): prevent keyboard from opening on mobile
docs(readme): update installation instructions
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, tested code
   - Update documentation if needed
   - Follow our style guidelines

3. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feat/your-feature-name
   ```
   - Create a pull request on GitHub
   - Fill out the PR template
   - Link any related issues

### Pull Request Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Changes tested on desktop and mobile
- [ ] Documentation updated (if applicable)
- [ ] No console errors or warnings
- [ ] Accessible design considerations

## 🧪 Testing

### Manual Testing
- Test on different screen sizes
- Verify mobile responsiveness
- Check keyboard navigation
- Test with screen readers (if applicable)

### Automated Testing
- Write unit tests for new components
- Update tests when modifying existing code
- Ensure all tests pass before submitting

## 📱 Mobile Considerations

Since Word Book is mobile-first:
- Test on actual mobile devices when possible
- Consider touch interactions
- Verify keyboard behavior
- Check performance on slower devices

## 🎨 Design Guidelines

### UI/UX Principles
- **Accessibility**: Follow WCAG guidelines
- **Consistency**: Use existing design patterns
- **Simplicity**: Keep interfaces clean and intuitive
- **Performance**: Optimize for mobile devices

### Color Usage
- Use semantic color variables
- Maintain contrast ratios
- Support both light and dark themes
- Test with colorblind users in mind

## 📚 Learning Resources

### Project Technologies
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Development Tools
- [Vite Guide](https://vitejs.dev/guide/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## 🤔 Questions?

- 💬 **Discussions**: Use GitHub Discussions for questions
- 📧 **Issues**: Create an issue for bugs or feature requests
- 📖 **Documentation**: Check the README for basic information

## 🎉 Recognition

Contributors will be:
- Listed in our contributors section
- Mentioned in release notes for significant contributions
- Invited to join our contributor Discord (coming soon!)

## 📋 Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `documentation`: Improvements to docs
- `mobile`: Mobile-specific issues
- `accessibility`: A11y improvements

Thank you for contributing to Word Book! 🎉

---

**Happy Coding!** 💻✨ 