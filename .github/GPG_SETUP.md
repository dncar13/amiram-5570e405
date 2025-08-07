# GPG Commit Signing Setup for Amiram Academy

This guide helps team members set up GPG signing for commits to critical paths in the Amiram Academy repository.

## Why GPG Signing is Required

GPG signing ensures:
- **Authenticity**: Commits are verified to come from the stated author
- **Integrity**: Commit content hasn't been tampered with
- **Non-repudiation**: Authors can't deny making signed commits
- **Compliance**: Required for changes to analytics, payment, and database code

## Critical Paths Requiring Signed Commits

The following paths require GPG-signed commits:
- `/src/services/analytics.ts`
- `/src/hooks/useAnalytics.ts`
- `/analytics/`
- `/tracking/` 
- `/supabase/functions/`
- `/src/components/payment/`
- Database migrations

## Step 1: Install GPG

### macOS
```bash
brew install gpg
```

### Ubuntu/Debian
```bash
sudo apt-get install gnupg
```

### Windows
Download and install [Gpg4win](https://gpg4win.org/)

## Step 2: Generate a GPG Key

1. Generate a new GPG key:
```bash
gpg --full-generate-key
```

2. Choose options:
   - **Key type**: RSA (default)
   - **Key size**: 4096 bits
   - **Expiration**: 2 years (recommended)
   - **Name**: Your full name
   - **Email**: Your work email address
   - **Passphrase**: Use a strong passphrase

3. Verify your key was created:
```bash
gpg --list-secret-keys --keyid-format LONG
```

Example output:
```
sec   rsa4096/ABC123DEF456 2024-01-01 [SC] [expires: 2026-01-01]
      1234567890ABCDEF1234567890ABCDEF12345678
uid                 [ultimate] Your Name <you@amiram.net>
ssb   rsa4096/XYZ789 2024-01-01 [E] [expires: 2026-01-01]
```

Note the key ID: `ABC123DEF456` in this example.

## Step 3: Add GPG Key to GitHub

1. Export your public key:
```bash
gpg --armor --export ABC123DEF456
```

2. Copy the entire output (including `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----`)

3. In GitHub:
   - Go to **Settings** → **SSH and GPG keys**
   - Click **New GPG key**
   - Paste your public key
   - Click **Add GPG key**

## Step 4: Configure Git

1. Tell Git about your GPG key:
```bash
git config --global user.signingkey ABC123DEF456
```

2. Configure Git to sign commits automatically:
```bash
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

3. Set your commit email to match your GPG key:
```bash
git config --global user.email "you@amiram.net"
```

## Step 5: Test Signing

1. Make a test commit:
```bash
git commit -S -m "Test GPG signing"
```

2. Verify the commit is signed:
```bash
git log --show-signature -1
```

You should see:
```
gpg: Signature made [date]
gpg:                using RSA key [key-id]
gpg: Good signature from "Your Name <you@amiram.net>"
```

## Step 6: IDE Integration

### VS Code
Install the **Git Graph** extension to see signature status in the UI.

### IntelliJ/WebStorm
1. Go to **Settings** → **Version Control** → **Git**
2. Check **Sign off commits**
3. Set **GPG executable path** if needed

## Troubleshooting

### "gpg: signing failed: Inappropriate ioctl for device"
```bash
export GPG_TTY=$(tty)
echo 'export GPG_TTY=$(tty)' >> ~/.bashrc
```

### "gpg: signing failed: No secret key"
Verify your key ID is correct:
```bash
git config --global user.signingkey
gpg --list-secret-keys --keyid-format LONG
```

### "gpg: can't connect to the agent"
Start the GPG agent:
```bash
gpg-agent --daemon
```

### Passphrase prompts
Configure GPG agent for longer caching:
```bash
echo "default-cache-ttl 28800" >> ~/.gnupg/gpg-agent.conf
echo "max-cache-ttl 86400" >> ~/.gnupg/gpg-agent.conf
gpgconf --reload gpg-agent
```

## Emergency Procedures

### If you lose your private key
1. Immediately revoke your GPG key on GitHub
2. Generate a new GPG key pair
3. Update your Git configuration
4. Add the new public key to GitHub
5. Inform the team of the key rotation

### If your key expires
1. Extend the expiration:
```bash
gpg --edit-key ABC123DEF456
> expire
> 2y
> save
```

2. Update GitHub with the refreshed public key

## Team Key Management

### Key Verification
Before accepting signed commits, verify the key belongs to the team member:

1. Download their public key from GitHub
2. Verify key fingerprint in person or via secure channel
3. Sign their key to mark it as trusted:
```bash
gpg --sign-key ABC123DEF456
```

### Key Backup
**Critical**: Back up your private key securely:
```bash
gpg --export-secret-keys ABC123DEF456 > private-key-backup.asc
```

Store this file in a secure location (password manager, encrypted drive, etc.)

## Compliance Checklist

- [ ] GPG key generated with 4096-bit RSA
- [ ] Key uploaded to GitHub
- [ ] Git configured for automatic signing
- [ ] Test commit successfully signed and verified
- [ ] Passphrase manager configured
- [ ] Private key backed up securely
- [ ] Team lead verified key fingerprint

## Repository-Specific Rules

For Amiram Academy repository:
- **Required**: All commits to `/analytics/`, `/tracking/`, `/supabase/functions/`
- **Recommended**: All commits to main and production branches
- **Enforcement**: Automated checks in CI/CD pipeline
- **Exceptions**: Documentation-only changes may be exempt

## Support

If you need help with GPG setup:
1. Check the troubleshooting section above
2. Ask in the #dev-support Slack channel
3. Contact @danielpogodin for critical path changes

---

**Security Note**: Never share your private key or passphrase. If compromised, immediately revoke the key and generate a new one.