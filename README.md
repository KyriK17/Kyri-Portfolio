# KYRI – editorial portfolio

Astro + TypeScript + Tailwind CSS site with a Decap CMS editing screen at `/admin`.
The public site is static and read-only. It ships with **no sample content**: every article, project, bio line, link and image comes from you.

## Commands

```bash
npm install        # once, to download the tools
npm run dev        # run the site at http://localhost:4321
npm run cms        # (second terminal) lets /admin save to your own files
npm run build      # build the real site into dist/
npm run preview    # look at the built site
npm run check      # optional type check
```

## Where content lives

| What                              | Where                          | Edited in the CMS under     |
| --------------------------------- | ------------------------------ | --------------------------- |
| Articles                          | `src/content/articles/*.md`    | Articles                    |
| Projects                          | `src/content/projects/*.md`    | Projects                    |
| About page                        | `src/content/about/about.md`   | About page                  |
| Name, tagline, email, socials, CV | `src/data/site.json`           | Site settings               |
| Homepage text and switches        | `src/data/home.json`           | Homepage                    |
| Menu links                        | `src/data/navigation.json`     | Navigation                  |
| SEO text and share image          | `src/data/seo.json`            | SEO                         |
| Intros on Articles/Projects/Contact | `src/data/pages.json`        | Page introductions          |
| Uploaded images and the CV        | `public/uploads/`              | (uploaded through the CMS)  |

Anything left empty is hidden automatically: no CV means no CV buttons, no email means no email links, and no articles means a quiet "No articles yet." message.

## Using the CMS on your own computer

1. Open two terminals in the project folder.
2. Terminal 1: `npm run cms`. Terminal 2: `npm run dev`.
3. Visit http://localhost:4321/admin/ and click the login button. Edits save straight into your files.
4. When happy, commit and push to GitHub (see below). Cloudflare then rebuilds the live site.

## Turning on the CMS online (one-time setup, not done yet)

The live `/admin` page can only publish after you log in with GitHub, which needs a small login service.
Cloudflare Pages does not provide one, so you must set one up. Until you do, online `/admin` cannot log anyone in.

1. In `public/admin/config.yml`, replace `YOUR-GITHUB-USERNAME/YOUR-REPO-NAME` with your repository.
2. On GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.
3. Deploy a free Decap-compatible GitHub OAuth proxy (for example on Cloudflare Workers; search for "Decap CMS Cloudflare Workers OAuth proxy" and follow that project's README). Use its address for the OAuth app's callback URL.
4. Put the OAuth app's Client ID and Client Secret into the **proxy's** environment variables. Never put them in this repository.
5. Uncomment `base_url:` in `config.yml` and set it to the proxy's address. Commit and push.

Only people with write access to your GitHub repository can publish. For extra safety you can also protect `/admin` with Cloudflare Access (free for small teams).

## Deploy to Cloudflare Pages

Connect the repository. Framework preset **Astro**, build command `npm run build`, output directory `dist`.
Set `SITE_URL` in `astro.config.mjs` to your real address, then push again.

## Notes

- Images upload to `public/uploads/` and are served as uploaded. Resize photos to about 1600px wide and compress them first.
- Share images for social media must be JPG or PNG (SVG does not work there).
- The default share image is `public/og-default.png` (just the name). Upload your own under SEO.
