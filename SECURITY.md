# Security Policy

## Supported Versions

BlackVideo uses a **custom semantic–hierarchical versioning format**:

```
v<major>.<minor>.<feature>.<patch>.<build>
```

Only actively maintained versions receive **security updates and vulnerability patches**.

### Currently Supported Versions

| Version      | Supported          |
| ------------ | ------------------ |
| v1.1.01.x.x  | :white_check_mark: |
| v1.1.00.x.x  | :white_check_mark: |
| v1.0.x.x.x   | :x:                |
| < v1.0.0.0.0 | :x:                |

### Version Support Policy

* **Major & Minor releases** (`v1.1.*`) receive security updates.
* **Patch and build updates** inherit support from their parent version.
* Deprecated versions **do not** receive:

  * Security patches
  * Vulnerability fixes
  * Dependency updates

Users are strongly encouraged to upgrade to the **latest supported release**.

---

## Reporting a Vulnerability

If you discover a security vulnerability in BlackVideo, please report it responsibly.

### How to Report

* **Do NOT** open a public GitHub issue for security vulnerabilities.
* Instead, report privately via one of the following:

**Preferred:**

* GitHub Security Advisories (if enabled)

**Alternative:**

* Email: `security@blackvideo.app` 

### What to Include

Please provide as much detail as possible:

* Affected version(s)
* Description of the vulnerability
* Steps to reproduce
* Potential impact
* Proof-of-concept (if available)
* Any suggested mitigation

---

## Response & Disclosure Process

* Reports are acknowledged within **48–72 hours**
* Vulnerabilities are assessed and prioritized
* Fixes are released as:

  * Patch updates
  * Security advisories
* Public disclosure occurs **after a fix is available**

We appreciate responsible disclosure and will credit reporters when appropriate.

---

## Security Scope

This policy applies to:

* BlackVideo core application
* Native modules (Tauri / Rust)
* Backend services
* Extension system APIs
* CLI / Terminal interfaces

### Out of Scope

* Third-party services or APIs
* External extensions not maintained by the BlackVideo team
* Unsupported or deprecated versions

---

## Security Principles

BlackVideo is built with a **security-first mindset**, including:

* Sandboxed extension execution
* Permission-based APIs
* Restricted native access
* Secure defaults
* Minimal privilege design
* No silent remote code execution

---

## Notes

This security policy is a **living document** and may evolve as the project grows.

---
