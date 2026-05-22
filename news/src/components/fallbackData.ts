export type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt?: string;
  source?: {
    name: string;
  };
  author?: string;
};

export const fallbackArticles: Record<string, Article[]> = {
  general: [
    {
      title: "Global Summit Agrees on Landmark Cross-Border Climate Accord",
      description: "Representatives from over 190 nations have reached a historic consensus, signing a comprehensive carbon reduction mandate with legally binding transition milestones.",
      url: "https://example.com/climate-accord-2026",
      urlToImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T08:30:00Z",
      source: { name: "International Herald" },
      author: "Sarah Jenkins"
    },
    {
      title: "Urban Architecture Explores Net-Zero Subterranean Communities",
      description: "As surface temperatures shift, metropolitan planning commissions are greenlighting pioneering underground residential sectors powered fully by geothermal energy.",
      url: "https://example.com/netzero-subterranean",
      urlToImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T06:15:00Z",
      source: { name: "Urban Future" },
      author: "Marcus Vance"
    },
    {
      title: "The Re-emergence of Heritage Crafts in the Digital Age",
      description: "A cultural shift is underway as younger generations embrace physical, slow-made goods over fast-produced digital items, reviving centuries-old artisan traditions.",
      url: "https://example.com/heritage-crafts",
      urlToImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-21T18:40:00Z",
      source: { name: "Cultural Review" },
      author: "Helena Rostova"
    },
    {
      title: "Deep-Ocean Research Fleet Discovers Historic Submerged Metropolis",
      description: "Exploration vessels mapping uncharted sections of the oceanic shelf have captured high-resolution sonar profiles of a prehistoric civilization submerged thousands of feet deep.",
      url: "https://example.com/submerged-metropolis",
      urlToImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-21T14:10:00Z",
      source: { name: "Oceanic Science" },
      author: "Dr. Arthur Pendelton"
    }
  ],
  business: [
    {
      title: "Central Banks Synchronize Rates Amid Stabilizing Global Commerce",
      description: "In a coordinated monetary policy realignment, major financial institutions announce slight rate cuts to bolster supply chain corridors and spur small-business initiatives.",
      url: "https://example.com/central-bank-synchronized-rates",
      urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T09:00:00Z",
      source: { name: "Financial Post" },
      author: "David Vance"
    },
    {
      title: "Micro-Investing Platforms Break Growth Records Among Gen-Z Users",
      description: "Sleek, algorithmic fractional stock apps report a substantial surge in active accounts, reshaping modern corporate equity dynamics and long-term asset accumulation.",
      url: "https://example.com/micro-investing-genz",
      urlToImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T07:45:00Z",
      source: { name: "Wall Street Digest" },
      author: "Clarissa Montgomery"
    },
    {
      title: "Global Supply Chain Congestion Fully Eases to Pre-Pandemic Baselines",
      description: "Freight indices verify port turn-times have hit multi-year optimals. Maritime shipping conglomerates report streamlined trade lanes and lower distribution overheads.",
      url: "https://example.com/supply-chain-eased",
      urlToImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-21T22:30:00Z",
      source: { name: "Commerce Logistics" },
      author: "Hassan Al-Jamil"
    }
  ],
  entertainment: [
    {
      title: "Indie Sci-Fi Epic Clinches Top Honors at International Cinema Gala",
      description: "A micro-budget feature shot with experimental anamorphic lenses surprises the industry, walking away with five prestigious visual and dramatic accolades.",
      url: "https://example.com/indie-scifi-epic",
      urlToImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T10:10:00Z",
      source: { name: "Screen Horizon" },
      author: "Leo Sterling"
    },
    {
      title: "Immersive Holographic Theater Production Debuts to Rave Reviews",
      description: "Blending classic theater dramatics with next-generation spatial computing, a new London production allows audiences to walk directly alongside photorealistic virtual actors.",
      url: "https://example.com/holographic-theater",
      urlToImage: "https://images.unsplash.com/photo-1503095391755-14144b6969FC?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T05:20:00Z",
      source: { name: "Stage & Pixel" },
      author: "Fiona Gallagher"
    },
    {
      title: "The Renaissance of Vinyl: Physical Music Sales Outpace Digital Single Downloads",
      description: "Audio purists and visual design fans push vinyl pressings to unprecedented heights, compelling recording studios to expand physical production plants worldwide.",
      url: "https://example.com/vinyl-sales-record",
      urlToImage: "https://images.unsplash.com/photo-1539625313006-0b86384767c9?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-21T16:15:00Z",
      source: { name: "Auditory Culture" },
      author: "Jonas Beck"
    }
  ],
  health: [
    {
      title: "Pioneering Cellular Regenerative Therapy Gains Regulatory Approval",
      description: "In a medical breakthrough, research agencies approve a highly targeted molecular treatment proven to safely repair degenerative cardiac tissue in record phases.",
      url: "https://example.com/cellular-regen-therapy",
      urlToImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T11:00:00Z",
      source: { name: "Medical Lancet" },
      author: "Dr. Eleanor Vance"
    },
    {
      title: "Chronobiology Reveals the Surprising Health Benefits of Circadian Lighting",
      description: "Clinical studies confirm adjusting corporate desk lumination spectrums to match organic solar patterns improves cognitive endurance and night-time deep sleep metrics.",
      url: "https://example.com/circadian-lighting-science",
      urlToImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T08:00:00Z",
      source: { name: "Nature Biohealth" },
      author: "Renée DuPont"
    },
    {
      title: "Mindfulness and Cold-Exposure Training: Insights from Neurological Scans",
      description: "New neuro-imaging research shows how combining controlled breathing with targeted cold exposure radically diminishes chronic inflammatory markers in human tissue.",
      url: "https://example.com/mindfulness-cold-exposure",
      urlToImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-21T13:40:00Z",
      source: { name: "Brain Science Journal" },
      author: "Dr. Takashi Sato"
    }
  ],
  science: [
    {
      title: "Deep Space Telescope Discovers Intricate Biosignature in Nearby Star System",
      description: "Astronomers have detected atmospheric trace gases indicative of photosynthetic cycles on a terrestrial-sized exoplanet orbiting a stable star 42 light-years away.",
      url: "https://example.com/exoplanet-biosignature",
      urlToImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T10:45:00Z",
      source: { name: "Astrobiology Weekly" },
      author: "Liam Thorne"
    },
    {
      title: "Solid-State Hydrogen Power Cells Unveiled by Aerospace Pioneers",
      description: "A revolutionary solid metal-hydride cell achieves energy densities matching standard aviation fuel, offering zero-emission high-altitude long-haul flights.",
      url: "https://example.com/solid-state-hydrogen-cells",
      urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T09:12:00Z",
      source: { name: "Science Horizon" },
      author: "Dr. Albert Chen"
    },
    {
      title: "Ancient Antarctic Core Samples Rewrite Prehistoric Atmospheric Records",
      description: "Ice core drills operating at extreme depths recover ice packed four million years ago, indicating CO2 cycles were highly responsive to subterranean activity.",
      url: "https://example.com/antarctic-ice-core-rewrite",
      urlToImage: "https://images.unsplash.com/photo-1517783905612-67364b267396?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-21T20:25:00Z",
      source: { name: "Paleoclimatology" },
      author: "Ingrid Nilsen"
    }
  ],
  sports: [
    {
      title: "Sprint Legend Smashes Historic Century Barrier at Milan Championships",
      description: "Under perfect tailwinds, a 21-year-old challenger blazes across the track to secure a world-record finish, stunning analysts and setting a high benchmark.",
      url: "https://example.com/sprint-record-milan",
      urlToImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T12:00:00Z",
      source: { name: "Athletic Arena" },
      author: "Christian Cole"
    },
    {
      title: "Decentralized Fan-Owned Teams Reshape Professional Soccer Ownership",
      description: "By employing decentralized community voting frameworks, direct digital fan collectives acquire regional franchises, challenging billionaire conglomerate structures.",
      url: "https://example.com/fan-owned-soccer-clubs",
      urlToImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T06:30:00Z",
      source: { name: "Sports Economy" },
      author: "Dominic Thorne"
    },
    {
      title: "High-Altitude Trekking Innovations: Biodegradable Synthetic Exosuits",
      description: "Alpine equipment manufacturers unveil active muscle support exosuits made entirely of biodegradable starch compounds, offering extra joint longevity in high ridges.",
      url: "https://example.com/exosuit-mountaineering-tech",
      urlToImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-21T15:10:00Z",
      source: { name: "Alpine Gear Review" },
      author: "Marcella Rossi"
    }
  ],
  technology: [
    {
      title: "Silicon Photonics Achieve Commercial Production Breakthrough",
      description: "Replacing electronic wires with microscopic laser beams on standard microchips boosts calculations-per-watt by 1,000x, initiating an unprecedented computing revolution.",
      url: "https://example.com/silicon-photonics-chips",
      urlToImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T11:30:00Z",
      source: { name: "TechCrunch Ledger" },
      author: "Elena Rostova"
    },
    {
      title: "Decentralized Personal AI Networks Redefine Digital Privacy Boundaries",
      description: "An open-source movement allowing secure, personal neural networks to execute locally on consumer gadgets is gaining mass traction and bypassing massive tech host clouds.",
      url: "https://example.com/personal-decentralized-ai",
      urlToImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-22T08:50:00Z",
      source: { name: "Wired Decentralized" },
      author: "Raymond Kurzweil"
    },
    {
      title: "Next-Generation Biomimetic Robots Navigate High-Density Obstacles Flawlessly",
      description: "Using soft silicon actuators inspired by gecko muscles, new search-and-rescue androids negotiate delicate debris fields during recent emergency simulations.",
      url: "https://example.com/biomimetic-robots-rescue",
      urlToImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      publishedAt: "2026-05-21T19:15:00Z",
      source: { name: "Robotic Systems Journal" },
      author: "Dr. Kenji Tanaka"
    }
  ]
};
