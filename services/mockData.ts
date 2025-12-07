

import { Contact, Product, CalendarEvent, UserSettings, Message, Post, Story, SocialNotification } from '../types';

// REALISTIC SEED DATA
// This data acts as the initial state of the "Database" when the user first installs the app.

export const INITIAL_CONTACTS: Contact[] = [
    { 
        id: 'c1', 
        name: 'Sarah Chen', 
        mood: 'serene', 
        affinity: 0.95, 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop', 
        lastMessage: 'The exhibition opens tonight at 8. You coming?', 
        isGroup: false, 
        badges: [{ type: 'verified', label: 'Verified Artist' }], 
        isOnline: true,
        lastSeen: Date.now(),
        about: 'Capturing light in the digital void.',
        nickname: 'Sare',
        phoneNumber: '+1 (555) 012-3456'
    },
    { 
        id: 'c2', 
        name: 'Marcus Thorne', 
        mood: 'energetic', 
        affinity: 0.88, 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop', 
        lastMessage: 'Just sent over the blueprints. Let me know what you think.', 
        isGroup: false, 
        badges: [{ type: 'gold', label: 'Aura Gold' }], 
        lastSeen: Date.now() - 1200000,
        about: 'Architecting the future.',
        phoneNumber: '+1 (555) 098-7654'
    },
    { 
        id: 'c3', 
        name: 'Elara Vance', 
        mood: 'melancholic', 
        affinity: 0.75, 
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop', 
        lastMessage: 'I need some space to think about this.', 
        isGroup: false, 
        badges: [], 
        isOnline: false,
        lastSeen: Date.now() - 86400000, // 1 day ago
        about: 'Lost in the music.'
    },
    { 
        id: 'c4', 
        name: 'Design Team Alpha', 
        mood: 'neutral', 
        affinity: 0.6, 
        avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=2dd4bf&color=fff', 
        isGroup: true, 
        members: ['c1', 'c2', 'me'],
        lastMessage: 'Sarah: Updated the Figma file.', 
        badges: [{ type: 'developer', label: 'Work' }],
        about: 'Official channel for Project Nebula.'
    },
    { 
        id: 'c5', 
        name: 'Hiroshi Tanaka', 
        mood: 'joyful', 
        affinity: 0.5, 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop', 
        lastMessage: 'Ramen tonight? 🍜', 
        isGroup: false, 
        badges: [{ type: 'early_adopter', label: 'Early Bird' }],
        isOnline: true,
        about: 'Tech enthusiast & Foodie.'
    },
];

export const INITIAL_PRODUCTS: Product[] = [
    { 
        id: 'p1', 
        sellerId: 'c1', 
        title: 'Leica M6 Film Camera', 
        price: 2800, 
        currency: '$', 
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&h=600&auto=format&fit=crop', 
        description: 'Mint condition classic rangefinder. Includes 50mm Summicron lens. Recently serviced.', 
        category: 'Physical', 
        location: 'Brooklyn, NY', 
        condition: 'used_like_new', 
        rating: 4.9, 
        reviews: 42, 
        isPromoted: true 
    },
    { 
        id: 'p2', 
        sellerId: 'c2', 
        title: 'Modernist Chair Design', 
        price: 450, 
        currency: '$', 
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&h=600&auto=format&fit=crop', 
        description: 'Original mid-century modern replica. Walnut finish with leather upholstery.', 
        category: 'Furniture', 
        location: 'Austin, TX', 
        condition: 'new', 
        rating: 4.5, 
        reviews: 12 
    },
    { 
        id: 'p3', 
        sellerId: 'c5', 
        title: 'Custom Mechanical Keyboard', 
        price: 320, 
        currency: '$', 
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&h=600&auto=format&fit=crop', 
        description: 'Hand-lubed switches, GMK keycaps, aluminum case. Typing sound is heavenly.', 
        category: 'Electronics', 
        location: 'San Francisco, CA', 
        condition: 'used_good', 
        rating: 5.0, 
        reviews: 8 
    },
    { 
        id: 'p4', 
        sellerId: 'c3', 
        title: 'Digital Soundscape Pack', 
        price: 40, 
        currency: '$', 
        image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&h=600&auto=format&fit=crop', 
        description: 'A collection of 50 ambient textures and drones for music production. Royalty free.', 
        category: 'Digital Art', 
        location: 'Remote', 
        condition: 'new', 
        rating: 4.7, 
        reviews: 156 
    },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
    { 
        id: 'e1', 
        organizerId: 'c1', 
        title: 'Gallery Opening: Void', 
        description: 'An exploration of empty spaces in the modern digital landscape. Drinks provided.', 
        startTime: Date.now() + 86400000 * 2, // 2 days from now
        location: 'The Modern Loft, Soho', 
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800&h=400&auto=format&fit=crop', 
        attendees: ['c1', 'c2', 'c3', 'me'], 
        interested: ['c5'] 
    },
    { 
        id: 'e2', 
        organizerId: 'c5', 
        title: 'Tech Talk: AI & Art', 
        description: 'Discussion panel on the ethics of generative models.', 
        startTime: Date.now() + 86400000 * 5, 
        location: 'Innovation Hub / Zoom', 
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&h=400&auto=format&fit=crop', 
        attendees: ['c5', 'me'], 
        interested: ['c1', 'c2'] 
    },
];

export const INITIAL_SETTINGS: UserSettings = {
    name: 'Alex Rivera', 
    about: 'Digital Nomad. Seeking resonance.', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop', 
    phoneNumber: '+1 (555) 999-0000', 
    username: 'arivera',
    isPremium: false, 
    subscriptionTier: 'stardust', 
    badges: [{ type: 'early_adopter', label: 'Founder' }],
    auraCoins: 150,
    readReceipts: true, onlineStatus: true, lastSeenPrivacy: 'everyone', profilePhotoPrivacy: 'everyone', aboutPrivacy: 'everyone',
    notifications: true, soundEnabled: true, vibrationEnabled: true, groupNotifications: true,
    theme: 'dark', wallpaper: 'default', fontSize: 'medium', mediaAutoDownload: true,
    mediaQuality: 'standard', highFidelityAudio: false, hapticsStrength: 0.8, renderScale: 1.0,
    telegramFeatures: {
        chatFolders: [{ id: 'work', name: 'Work', icon: 'briefcase', includedChats: ['c2', 'c4'], excludedChats: [] }],
        autoNightMode: true,
        animationSpeed: 1.0,
        stickerSets: [],
        privacyExceptions: { lastSeen: [], profilePhoto: [], calls: [], forwarding: [] },
        dataStorage: { keepMedia: 30, maxCacheSize: 2048 }
    },
    telegramComprehensive: {
        messageTextSize: 16, chatBackgroundId: 'default', autoNightMode: true, inAppBrowser: true, directShare: true, enableAnimations: true, largeEmojis: true, raiseToSpeak: false, sendByEnter: true, saveToGallery: false, distanceUnits: 'mi', suggestStickers: true, loopAnimatedStickers: true, maskStickers: true, quickReaction: '❤️',
        blockedUsers: [], phoneNumberPrivacy: 'contacts', lastSeenOnlinePrivacy: 'contacts', profilePhotosPrivacy: 'everyone', forwardedMessagesPrivacy: 'everyone', callsPrivacy: 'everyone', groupsChannelsPrivacy: 'everyone', passcodeLock: false, twoStepAuth: true, activeSessions: 2, deleteAccountIfAway: 12, syncContacts: true, suggestFrequentContacts: true, mapPreviewProvider: 'google', voiceMessagesPrivacy: 'everyone',
        storageUsage: 1240, dataUsage: 4500, autoDownloadMobile: false, autoDownloadWiFi: true, autoDownloadRoaming: false, autoPlayGifs: true, autoPlayVideos: true, streamingEnabled: true, saveToGalleryPrivate: false, saveToGalleryGroups: false, saveToGalleryChannels: false,
        privateChatsNotify: true, groupsNotify: true, channelsNotify: false, badgeCounter: true, inAppSounds: true, inAppVibrate: true, inAppPreview: true, contactJoinedNotify: true, pinnedMessagesNotify: true
    },
    creatorSettings: {
        analyticsEnabled: true, creatorPortalAccess: true, qaFeature: true, adAuthorization: false, brandedContentToggle: false,
        videoGifts: true, liveGifts: true, shopFeature: true, soundCopyrightCheck: true,
        allowDuet: 'everyone', allowStitch: 'everyone', allowDownloads: true, whoCanDM: 'friends', whoCanComment: 'everyone', whoCanTag: 'everyone', whoCanMention: 'everyone', storyReplies: 'friends',
        filterComments: true, filterKeywords: ['spam', 'fake'],
        privateAccount: false, suggestAccountToContacts: true, suggestAccountToFacebook: true, syncContacts: true, syncFacebookFriends: true, activityStatus: true,
        autoplayVideos: true, openInMute: false, captionsEnabled: true, autoVolumeAdjustment: true, hdUploads: true, saveToDevice: false, pipMode: true, backgroundPlay: true, animatedThumbnail: true, removePhotosensitive: false,
        screenTimeManagement: false, restrictedMode: false, familyPairing: false,
        dataSaver: false, clearCacheOnExit: false,
        notifyLikes: true, notifyComments: true, notifyMentions: true, notifyFollows: true, notifyDirectMessages: true, notifyVideoSuggestions: true, notifyLivestreams: true,
        liveReplays: true, liveSubscription: false,
        appLanguage: 'English', translationLanguage: 'English', alwaysTranslate: false
    },
    systemSettings: {
        adaptiveBrightness: true, blueLightFilter: true, grayscaleMode: false, refreshRate: '120hz', hdrPlayback: true, uiScaling: 1.0, fontType: 'Aura Sans', emojiStyle: '3D', iconShape: 'Squircle', backdropBlur: 16, animationDuration: 'normal', oledBlack: true,
        masterVolume: 100, ambienceVolume: 60, sfxVolume: 80, spatialAudio: true, dolbyAtmos: true, equalizerPreset: 'Vocal', noiseSuppression: true, highFidelityMusic: true, typingSounds: true, sentSound: 'pop',
        dataSaver: false, imageCompression: 'Original', videoCompression: '4k', autoDownloadWiFi: true, autoDownloadCellular: true, proxyHost: '', customDNS: '1.1.1.1', p2pUpdates: true,
        maxCacheSize: 4096, autoClearCache: true, keepMediaDays: 90, localDatabaseBackup: true, exportHistory: true, clearGifCache: false, databaseOptimization: true,
        appLockTimeout: 30, screenCaptureBlock: false, incognitoKeyboard: true, linkPreviews: true, readClipboard: false, biometricAuth: true, scramblePin: false,
        gpuAcceleration: true, fpsOverlay: false, debugLogging: false, betaChannel: true, godModeTrigger: true, experimentalGestures: true
    },
    facebookSettings: {
        workplace: 'Freelance Designer', education: 'Rhode Island School of Design', currentCity: 'San Francisco, CA', hometown: 'Seattle, WA', relationshipStatus: 'Single', namePronunciation: 'Riv-air-ah', bio: 'Designing experiences.', hobbies: ['Photography', 'Coding', 'Hiking'], featuredPhotos: true, musicOnProfile: true,
        profileLock: false, whoCanSeeFuturePosts: 'public', whoCanSendFriendRequests: 'everyone', whoCanLookUpByEmail: 'everyone', whoCanLookUpByPhone: 'everyone', searchEngineIndexing: true, activityLogAccess: true, downloadInformation: true, legacyContact: '', deactivationStatus: false,
        whoCanPostOnTimeline: 'friends', whoCanSeeOthersPosts: 'public', reviewTagsBeforeAppearing: true, reviewPostsTaggedIn: true, autoTaggingSuggestions: true, faceRecognition: false, locationHistory: true, nearbyFriends: false, offFacebookActivity: true, adPreferences: 'personalized'
    },
    marketplaceSettings: {
        searchRadius: 50, currency: 'USD', savedItems: ['p1'], alertKeywords: ['camera', 'lens'], browsingHistory: true, autoPlayVideos: true, meetupPreferences: 'public', secureCheckout: true, purchaseProtection: true, showSoldListings: true,
        sellerDashboard: true, vacationMode: false, autoRenewListings: true, hideFromFriends: false, syncToGroups: true, quickReplies: ['Is this available?', 'When can we meet?'], sellerRatingVisible: true, shippingEnabled: true, localDelivery: true, boostListings: true
    }
};

export const INITIAL_CHAT_HISTORY: Record<string, Message[]> = {
    'c1': [
        { id: 'm1', text: "Are you still shooting with that old Canon?", sender: 'them', timestamp: Date.now() - 172800000, status: 'read', isCrystallized: false, type: 'text', sentiment: 'neutral', reactions: [] },
        { id: 'm2', text: "Yeah, I love the grain on it. Why?", sender: 'me', timestamp: Date.now() - 172700000, status: 'read', isCrystallized: false, type: 'text', sentiment: 'neutral', reactions: [] },
        { id: 'm3', text: "Just curious. I'm selling my Leica if you're interested.", sender: 'them', timestamp: Date.now() - 172600000, status: 'read', isCrystallized: false, type: 'text', sentiment: 'neutral', reactions: [] },
        { id: 'm4', text: "The exhibition opens tonight at 8. You coming?", sender: 'them', timestamp: Date.now() - 3600000, status: 'delivered', isCrystallized: false, type: 'text', sentiment: 'positive', reactions: [] }
    ],
    'c2': [
        { id: 'm5', text: "Project update: Client loved the render.", sender: 'them', timestamp: Date.now() - 86400000, status: 'read', isCrystallized: false, type: 'text', sentiment: 'positive', reactions: [{emoji: '🔥', count: 1, me: true}] },
        { id: 'm6', text: "That's huge news! Congrats Marcus.", sender: 'me', timestamp: Date.now() - 86300000, status: 'read', isCrystallized: false, type: 'text', sentiment: 'positive', reactions: [] },
        { id: 'm7', text: "Just sent over the blueprints. Let me know what you think.", sender: 'them', timestamp: Date.now() - 1200000, status: 'received_with_love', isCrystallized: false, type: 'text', sentiment: 'neutral', reactions: [] }
    ],
    'c3': [
        { id: 'm8', text: "Hey...", sender: 'them', timestamp: Date.now() - 259200000, status: 'read', isCrystallized: false, type: 'text', sentiment: 'neutral', reactions: [] },
        { id: 'm9', text: "Are we still on for the concert?", sender: 'me', timestamp: Date.now() - 259100000, status: 'read', isCrystallized: false, type: 'text', sentiment: 'neutral', reactions: [] },
        { id: 'm10', text: "I need some space to think about this.", sender: 'them', timestamp: Date.now() - 259000000, status: 'read', isCrystallized: true, type: 'text', sentiment: 'negative', reactions: [] }
    ],
    'c4': [
        { id: 'm11', text: "Meeting in 5 mins.", sender: 'them', timestamp: Date.now() - 400000, status: 'read', isCrystallized: false, type: 'text', sentiment: 'neutral', reactions: [] },
        { id: 'm12', text: "Sarah: Updated the Figma file.", sender: 'them', timestamp: Date.now() - 300000, status: 'read', isCrystallized: false, type: 'text', sentiment: 'neutral', reactions: [] }
    ]
};

export const INITIAL_POSTS: Post[] = [
    { 
        id: 'po1', 
        authorId: 'c1', 
        content: 'Morning light in the studio. There is something magical about 6am silence.', 
        type: 'image', 
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop', 
        likes: 342, 
        comments: [
            { id: 'co1', authorId: 'c2', authorName: 'Marcus Thorne', text: 'Stunning lighting.', timestamp: Date.now() - 50000 },
            { id: 'co2', authorId: 'c5', authorName: 'Hiroshi Tanaka', text: 'Is that the new studio?', timestamp: Date.now() - 40000 }
        ], 
        timestamp: Date.now() - 3600000, 
        likedByMe: true,
        location: 'Brooklyn Arts District',
        filter: 'ethereal'
    },
    { 
        id: 'po2', 
        authorId: 'c2', 
        content: 'Final walkthrough of the glass pavilion project. It’s been a long 2 years.', 
        type: 'video', 
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
        likes: 890, 
        comments: [], 
        timestamp: Date.now() - 7200000, 
        likedByMe: false, 
        musicTrack: { title: 'Architecture of Sound', artist: 'Modernist', cover: 'https://picsum.photos/50' },
        location: 'Seattle, WA'
    },
    { 
        id: 'po3', 
        authorId: 'c5', 
        content: 'Best ramen in the city. No contest.', 
        type: 'image', 
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop', 
        likes: 120, 
        comments: [], 
        timestamp: Date.now() - 10800000, 
        likedByMe: false,
        location: 'Ichiraku Ramen'
    }
];

export const INITIAL_STORIES: Story[] = [
    { id: 's1', authorId: 'c3', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&h=800&auto=format&fit=crop', isViewed: false, timestamp: Date.now() - 1800000 },
    { id: 's2', authorId: 'c1', image: 'https://images.unsplash.com/photo-1517816428103-7dc43843d1d0?q=80&w=400&h=800&auto=format&fit=crop', isViewed: false, timestamp: Date.now() - 3600000 }
];

export const INITIAL_NOTIFICATIONS: SocialNotification[] = [
    { id: 'n1', type: 'like', actorId: 'c1', timestamp: Date.now() - 300000, read: false, previewImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=100&h=100&auto=format&fit=crop' },
    { id: 'n2', type: 'comment', actorId: 'c2', text: "Stunning lighting.", timestamp: Date.now() - 600000, read: false, previewImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=100&h=100&auto=format&fit=crop' },
    { id: 'n3', type: 'follow', actorId: 'c5', timestamp: Date.now() - 86400000, read: true }
];