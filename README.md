# Vaishnavi Singh — Profile Website

A simple, framework-free profile site (plain HTML/CSS/JS) built from the
[knowledge-base](../knowledge-base/) content, for schools and education
organisations to learn about Vaishnavi Singh's work as a School Improvement
Consultant and Teacher Educator.

## Structure

```
website/
├── index.html          # the entire site (single scrolling page)
├── css/style.css        # all styling
├── js/main.js            # mobile nav, active-link highlighting, scroll reveal
├── assets/
│   ├── favicon.svg
│   └── images/           # real photos, extracted and compressed from the source PDF
└── README.md
```

No build tools, no dependencies, no external fonts or scripts — everything
needed is in this folder, so it works directly from GitHub Pages.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `vaishnavi-singh-profile`).
2. From this `website/` folder, initialize git and push:

   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. In the GitHub repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then **Save**.
6. GitHub will publish the site at:
   `https://<your-username>.github.io/<repo-name>/`

To use a custom domain later, add a `CNAME` file with the domain name to this
folder and configure DNS per GitHub's custom domain instructions.

## Editing content

All text on the site comes from `../knowledge-base/`. To update the site,
edit the relevant section directly in `index.html` (each section is labeled
with an HTML comment, e.g. `<!-- ============ ABOUT ============ -->`).
