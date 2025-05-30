<!-- Add badges here if applicable, e.g., build status, license -->
<!-- [![Build Status](<badge-url>)](<link-url>) -->
<!-- [![License: MIT](<badge-url>)](<link-url>) -->

# CircuitAi

This project is an AI-powered circuit creator that leverages Digitaljs for circuit simulation and visualisation. It provides an interactive and user-friendly interface for designing and simulating electronic circuits using natural language prompts or guided design flows.

## Features
- **AI-Assisted Design:** Describe circuit requirements in natural language, and the AI suggests components and connections.
- **Interactive Simulation:** Real-time circuit simulation powered by Digitaljs. Visualise signal flow and component states.
- **Component Library:** Includes a basic library of digital logic gates and components. (Expandable)
- **Drag-and-Drop Interface:** Easily place and connect components on the canvas. (If applicable)
- **Responsive UI:** Built with React and Tailwind CSS for a seamless experience across devices.

## Installation

1. Clone the repository:
   ```
   https://github.com/KshKnsl/CircuitAI.git
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1.  **Start the Application:** Run `npm run dev` and open `http://localhost:3000` (or the specified port) in your browser.
2.  **Design:**
    *   Use the input field to describe the circuit you want to build (e.g., "Create a 2-input AND gate connected to an LED").
    *   Connect components by clicking and dragging between ports.
3.  **Simulate:**
    *   Click the "Simulate" button (or observe real-time simulation).
    *   Interact with input elements (like switches) to see how the circuit behaves.
    *   Observe the visualisation provided by Digitaljs.
4.  **Modify & Iterate:** Refine your design based on simulation results.

## Project Structure

```
.
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   ├── components/     # Reusable React components (UI, circuit elements)
│   └── styles/         # Global styles, Tailwind configuration
├── .env                # Environment variables (API keys)
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## Technologies Used
- **Frontend:** Next.js, React, Tailwind CSS
- **Simulation:** DigitalJS
- **AI:** Gemini Ai API

## Configuration

- Create a `.env` file in the root directory for environment variables.
- Example:
  ```
  # .env
  GEMINI_API_KEY=your_api_key_here
  # Add other necessary environment variables
  ```

## Roadmap

- [ ] Feature: Implement user accounts and saved circuits.
- [ ] Feature: Expand the component library (e.g., add analog components, more complex ICs).
- [ ] Feature: Allow circuit export/import in standard formats (e.g., JSON, SPICE).
- [ ] Improvement: Enhance AI capabilities for more complex circuit generation and optimization.
- [ ] Improvement: Refine UI/UX based on user feedback.
- [ ] Chore: Add comprehensive unit and integration tests.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`). Adhere to [Conventional Commits](https://www.conventionalcommits.org/) if possible.
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.
