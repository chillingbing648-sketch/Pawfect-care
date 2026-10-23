# 🐾 Pawfect Care
### Because every paw deserves love.

Pawfect Care is a lightweight, responsive pet-care resource website designed to help pet owners quickly find links for veterinary check-ups, grooming, emergency support, animal rescue, and adoption.

Built with plain **HTML, CSS, and JavaScript**, the project keeps the experience simple: open the page, choose the kind of help you need, and follow the relevant contact or service link.

<p align="center">
  <strong>Pet care • Grooming • Emergency resources • Adoption</strong>
</p>

---

## ✨ What’s inside

- **Friendly landing page** — a welcoming hero section and clear calls to action.
- **Pet-care service cards** — quick links for vet consultations, grooming and hygiene, emergency/rescue resources, and adoption.
- **Emergency contact section** — a tap-to-call telephone link for quick access on supported devices.
- **Community connections** — links to an animal-welfare organisation and the project’s social profile.
- **Simple navigation** — jump directly to Services, Emergency Help, or Connect.
- **Responsive styling** — basic small-screen adjustments for a more comfortable mobile experience.
- **Lightweight implementation** — no framework or package installation is required to run the current static page.

## 🧰 Built with

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and content |
| CSS3 | Layout, colours, typography, and responsive styling |
| Vanilla JavaScript | Smooth section navigation and opening external links |
| Google Fonts | Quicksand body text and Baloo 2 headings/buttons |

## 🚀 Run locally

### Option 1 — Download the repository

1. Open the repository: [chillingbing648-sketch/Pawfect-care](https://github.com/chillingbing648-sketch/Pawfect-care).
2. Select **Code → Download ZIP** and extract the files.
3. Open the project’s HTML entry file in a modern browser.

The current entry file is named `index (1) (1).html`. If you rename it to `index.html`, update any references or deployment configuration that depend on its existing filename.

### Option 2 — Clone with Git

```bash
git clone https://github.com/chillingbing648-sketch/Pawfect-care.git
cd Pawfect-care
```

Then open `index (1) (1).html` in your browser.

> **No build step is needed** for the current static version. The Google Fonts import requires an internet connection; fallback fonts are available if the font service cannot be reached.

## 🗺️ How to use the website

1. Open the page in your browser.
2. Use the navigation or **Our Services** call to action to reach the service cards.
3. Select a card to open its linked external resource.
4. Use **Emergency Help** to access the configured phone link.
5. Visit **Connect With Us** for additional animal-welfare and social links.

External services open in a separate tab. Their availability, content, and policies are controlled by their respective providers.

## 📁 Project structure

The current project is a small, single-page website:

```text
Pawfect-care/
└── index (1) (1).html   # Markup, embedded CSS, and JavaScript
```

The HTML file currently contains the page structure, styles, and the small JavaScript helpers used by the interface.

## ⚠️ Important notes

- **Verify emergency information before use.** The phone number and third-party links are configured directly in the HTML file. Confirm that they are current, legitimate, and appropriate for your location before relying on them.
- Pawfect Care is a **resource directory / informational website**, not a veterinary provider. It does not diagnose conditions or replace advice from a qualified veterinarian.
- The current implementation does not establish online appointments, user accounts, payments, or a backend service.
- External links may change or become unavailable; check them periodically.
- Avoid entering or sharing sensitive personal information through third-party links unless you trust the destination.

## 🛠️ Customisation

To update the site, open `index (1) (1).html` in a code editor.

- **Change content:** edit the headings, paragraphs, and service-card labels in the HTML.
- **Update service destinations:** edit the URLs passed to `openLink(...)`.
- **Change the emergency phone link:** update both the `tel:` URL and the displayed number so they match.
- **Adjust the design:** edit the CSS in the document’s `<style>` blocks.
- **Update typography:** change the Google Fonts import and the corresponding `font-family` declarations.

When changing contact details, test each link on both desktop and mobile.

## 🌱 Ideas for future improvements

- Separate HTML, CSS, and JavaScript into maintainable files.
- Improve navigation on narrow screens and add stronger keyboard-focus states.
- Add a verified, location-aware directory of veterinarians and animal shelters.
- Add clear opening hours and service-area information where providers confirm them.
- Add automated link checks and accessibility testing.
- Add a deployment workflow and a public live-demo link once hosting is configured.

These are potential next steps, not features currently claimed by the project.

## 🤝 Contributing

Suggestions and improvements are welcome.

1. Fork the repository.
2. Create a branch for your change:
   ```bash
   git checkout -b feature/your-improvement
   ```
3. Make and test your changes in a browser.
4. Commit with a clear message:
   ```bash
   git commit -m "Improve pet care resources"
   ```
5. Push your branch and open a pull request describing the change.

## 📄 License

No license has been confirmed in the repository information reviewed for this README. Unless a license file or explicit license is added, do not assume that the project is available for unrestricted reuse. Add a suitable `LICENSE` file if you intend to permit reuse.

---

<p align="center">
  Made with ❤️ for pets and the people who care for them.
</p>
