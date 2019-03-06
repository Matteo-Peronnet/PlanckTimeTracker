# PLANCK TIME TRACKER


## Installation

```bash
npm install
npm run start
npm run electron
```

## Time tracker token 

The token is stored with a native Node module (`keytar`) who store passwords in system's keychain. 
On macOS the passwords are managed by the Keychain,
on Linux they are managed by the Secret Service API/libsecret, and on Windows they are managed by Credential Vault. The token is stored with the name `PlanckTimeTracker`

