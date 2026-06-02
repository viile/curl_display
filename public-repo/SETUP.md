# Public release repo — one-time setup

> This file does not get pushed to the public repo. It is the operator's runbook
> for bootstrapping `viile/curl_runner` from empty and triggering the first
> cross-repo release from this private source repo.

## 1. Bootstrap the empty public repo

`viile/curl_runner` is currently **empty** (no commits, no default branch).
Push the README/LICENSE bundle first so the cross-repo release has a target.

```bash
# Pick any working dir
cd /tmp
git clone https://github.com/viile/curl_runner.git
cd curl_runner

# Copy everything in public-repo/ EXCEPT SETUP.md into this clone
rsync -av --exclude='SETUP.md' \
  /Users/admin/code/curl_display/public-repo/ ./

git add -A
git commit -m "docs: initial README (20 languages) and MIT LICENSE"

# Ensure default branch is main on first push
git branch -M main
git push -u origin main
```

After the push, `viile/curl_runner` should show 21 files at the root:
`README.md` + 19 `README.<locale>.md` + `LICENSE`. GitHub will render
`README.md` as the homepage and show the MIT badge in the sidebar.

## 2. Configure the PAT (one time)

Reminder of what you should have set up already:

- A fine-grained PAT scoped to `viile/curl_runner` with **Contents: Read and write**.
- That PAT stored as the secret `RELEASE_REPO_TOKEN` on `viile/curl_display`.

## 3. (Optional) Change git identity for this public repo only

If you want a different name/email to appear in the bootstrap commit,
configure it **per-repo** before committing:

```bash
cd /tmp/curl_runner
git config user.name  "Your display name"
git config user.email "your-public@example.com"
```

## 4. Trigger the first cross-repo release

Back in the private source repo:

```bash
cd /Users/admin/code/curl_display
git tag v1.0.0      # bump as needed
git push origin v1.0.0
```

GitHub Actions on the private repo will:

1. Build macOS arm64, macOS x64, Windows x64, Linux x64 bundles in parallel.
2. Push every artifact to `viile/curl_runner` as a **draft** release named
   `cURL Runner v1.0.0`.

Once all four jobs finish, open
<https://github.com/viile/curl_runner/releases> and click **Publish release**.
`DESKTOP_DOWNLOAD_URL` (in the app) already points at `releases/latest`,
so the download button in the app will start working immediately.
