type VoiceProfile = {
  language: string;
  name: string;
  gender: string;
  voiceType: string;
  applicationArea: string;
  accent: string;
  id: string;
  previewUrl?: string;
};

export const voiceProfiles: VoiceProfile[] = [
  {
    language: "English",
    name: "Sarah",
    gender: "Female",
    voiceType: "Calm",
    applicationArea: "News",
    accent: "American English",
    id: "EXAVITQu4vr4xnSDxMaL",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/6851ec91-9950-471f-8586-357c52539069.mp3"
  },
  {
    language: "English",
    name: "Adam",
    gender: "Male",
    voiceType: "Deep",
    applicationArea: "Narration",
    accent: "American English",
    id: "pNInz6obpgDQGcFmaJgB",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/38a69695-2ca9-4b9e-b9ec-f07ced494a58.mp3",
  },
  {
    language: "English",
    name: "Charlie",
    gender: "Male",
    voiceType: "Casual",
    applicationArea: "Conversational",
    accent: "Australian English",
    id: "IKne3meq5aSn9XLyUdCD",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3",
  },
  {
    language: "English",
    name: "Clyde",
    gender: "Male",
    voiceType: "War veteran",
    applicationArea: "Video games",
    accent: "American English",
    id: "2EiwWnXFnvU5JabPnv8n",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/2EiwWnXFnvU5JabPnv8n/65d80f52-703f-4cae-a91d-75d4e200ed02.mp3",
  },
  {
    language: "English",
    name: "Dorothy",
    gender: "Female",
    voiceType: "Pleasant",
    applicationArea: "Children’s stories",
    accent: "British English",
    id: "ThT5KcBeYPX3keUQqHPh",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/ThT5KcBeYPX3keUQqHPh/981f0855-6598-48d2-9f8f-b6d92fbbe3fc.mp3",
  },
  {
    language: "English",
    name: "Freya",
    gender: "Female",
    voiceType: "Overhyped",
    applicationArea: "Video games",
    accent: "American English",
    id: "jsCqWAovK2LkecY7zXl4",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/jsCqWAovK2LkecY7zXl4/8e1f5240-556e-4fd5-892c-25df9ea3b593.mp3",
  },
  {
    language: "English",
    name: "Gigi",
    gender: "Female",
    voiceType: "Childlish",
    applicationArea: "Animation",
    accent: "American English",
    id: "jBpfuIE2acCO8z3wKNLl",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/jBpfuIE2acCO8z3wKNLl/3a7e4339-78fa-404e-8d10-c3ef5587935b.mp3",
  },
  {
    language: "English",
    name: "Harry",
    gender: "Male",
    voiceType: "Anxious",
    applicationArea: "Video games",
    accent: "American English",
    id: "SOYHLrjzK2X1ezoPC6cr",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3",
  },
  {
    language: "English",
    name: "James",
    gender: "Male",
    voiceType: "Calm",
    applicationArea: "News",
    accent: "Australian English",
    id: "ZQe5CZNOzWyzPSCn5a3c",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/ZQe5CZNOzWyzPSCn5a3c/35734112-7b72-48df-bc2f-64d5ab2f791b.mp3",
  },
  {
    language: "English",
    name: "Lily",
    gender: "Female",
    voiceType: "Raspy",
    applicationArea: "Narration",
    accent: "British English",
    id: "pFZP5JQG7iQjIQuC4Bku",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/0ab8bd74-fcd2-489d-b70a-3e1bcde8c999.mp3",
  },
  {
    language: "English",
    name: "Rachel",
    gender: "Female",
    voiceType: "Calm",
    applicationArea: "Narration",
    accent: "American English",
    id: "21m00Tcm4TlvDq8ikWAM",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/df6788f9-5c96-470d-8312-aab3b3d8f50a.mp3",
  },
];

/*

  const voices = [
    {
      "voice_id": "SOYHLrjzK2X1ezoPC6cr",
      "name": "Harry",
      "samples": null,
      "category": "premade",
      "fine_tuning": {
        "is_allowed_to_fine_tune": false,
        "finetuning_state": "not_started",
        "verification_failures": [],
        "verification_attempts_count": 0,
        "manual_verification_requested": false,
        "language": null,
        "finetuning_progress": {},
        "message": null,
        "dataset_duration_seconds": null,
        "verification_attempts": null,
        "slice_ids": null,
        "manual_verification": null
      },
      "labels": {
        "accent": "american",
        "description": "anxious",
        "age": "young",
        "gender": "male",
        "use case": "video games"
      },
      "description": null,
      previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3",
      "available_for_tiers": [],
      "settings": null,
      "sharing": null,
      "high_quality_base_model_ids": [
        "eleven_multilingual_v1"
      ],
      "safety_control": null,
      "voice_verification": {
        "requires_verification": false,
        "is_verified": false,
        "verification_failures": [],
        "verification_attempts_count": 0,
        "language": null,
        "verification_attempts": null
      }
    },
  ]
  */
