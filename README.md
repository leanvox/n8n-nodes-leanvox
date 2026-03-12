# n8n-nodes-leanvox

n8n community node for the [LeanVox](https://leanvox.com) TTS & STT API.

Convert text to speech, transcribe audio, and manage voices directly from your n8n workflows.

## Installation

In your n8n instance, go to **Settings > Community Nodes** and install:

```
n8n-nodes-leanvox
```

Or install manually:

```bash
npm install n8n-nodes-leanvox
```

## Credentials

1. Sign up at [LeanVox](https://leanvox.com) and obtain an API key (starts with `lvx_`).
2. In n8n, create a new **LeanVox API** credential and paste your API key.

## Resources & Operations

### Speech
| Operation | Description |
|---|---|
| **Generate** | Synchronous text-to-speech — returns audio binary |
| **Generate Async** | Asynchronous text-to-speech — returns a job ID |
| **Check Job** | Check the status of an async TTS job |
| **Dialogue** | Multi-speaker dialogue generation |

### Audio
| Operation | Description |
|---|---|
| **Transcribe** | Transcribe audio to text (supports summary & diarization) |

### Voices
| Operation | Description |
|---|---|
| **List** | List available voices |
| **List Curated** | List curated voices with preview URLs |

### Account
| Operation | Description |
|---|---|
| **Check Balance** | Check your credit balance |

## Notes

- The `voice_instructions` parameter is only available when using the **max** model.
- The synchronous **Generate** operation returns binary audio data that can be connected to downstream nodes (e.g., write to file, send via email).
- **Transcribe** accepts binary audio input and supports optional features: `summary` and `diarization`.

## License

[MIT](LICENSE)
