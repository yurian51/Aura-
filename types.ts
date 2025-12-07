


export type ViewState = 'landing' | 'auth' | 'profile-setup' | 'orbit' | 'chat' | 'artifacts' | 'settings' | 'feed' | 'market' | 'events' | 'studio';

export type MoodType = 'serene' | 'joyful' | 'melancholic' | 'energetic' | 'neutral';

export type BadgeType = 'verified' | 'gold' | 'early_adopter' | 'developer' | 'nebula' | 'supernova';

export type SubscriptionTier = 'stardust' | 'nebula' | 'supernova';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

export interface Badge {
  type: BadgeType;
  label: string;
}

export interface Contact {
  id: string;
  name: string;
  mood: MoodType;
  affinity: number; // 0-1
  avatar: string;
  lastMessage?: string;
  whisper?: string;
  isGroup?: boolean;
  members?: string[];
  nickname?: string;
  customTheme?: string;
  gardenSeed?: number;
  badges?: Badge[];
  phoneNumber?: string; // WhatsApp
  about?: string; // WhatsApp
  isOnline?: boolean; // Messenger
  lastSeen?: number; // WhatsApp
  isTyping?: boolean; // Messenger
  mutualFriends?: number; // Facebook
  isCloseFriend?: boolean; // Facebook/Instagram
  storyAvailable?: boolean; // FB/Insta
  blocked?: boolean; // WhatsApp
  muted?: boolean; // WhatsApp
}

export type AttachmentType = 'image' | 'voice' | 'file' | 'sticker' | 'quantum' | 'video' | 'location' | 'contact' | 'poll' | 'event' | 'product';

export interface Reaction {
  emoji: string;
  count: number;
  me: boolean;
}

export interface QuantumLock {
    type: 'time' | 'mood';
    unlockTime?: number;
    requiredMood?: MoodType;
    isLocked: boolean;
}

export interface PollOption {
    id: string;
    text: string;
    votes: string[]; // User IDs
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'received_with_love';
  isCrystallized: boolean;
  type: 'text' | AttachmentType;
  sentiment?: 'positive' | 'negative' | 'neutral';
  replyTo?: { id: string; text: string; sender: string };
  attachmentUrl?: string;
  duration?: number; // For voice/video messages
  isPinned?: boolean;
  reactions?: Reaction[];
  fileName?: string;
  fileSize?: string;
  quantumLock?: QuantumLock;
  isForwarded?: boolean; // WhatsApp
  isStarred?: boolean; // WhatsApp
  viewOnce?: boolean; // WhatsApp
  expiresAt?: number; // WhatsApp Disappearing
  pollOptions?: PollOption[]; // Messenger
  location?: { lat: number; lng: number; name?: string }; // WhatsApp
}

export interface Plant {
    id: string;
    x: number;
    height: number;
    color: string;
    type: 'vine' | 'flower' | 'fern';
    growth: number;
}

export interface Artifact {
  id: string;
  originalMessageId: string;
  text: string;
  senderName: string;
  poeticTag: string;
  timestamp: number;
  mood: MoodType;
}

export interface CallState {
  isActive: boolean;
  status: 'ringing' | 'connected' | 'ended' | 'reconnecting';
  type: 'audio' | 'video';
  contact: Contact | null;
  isMuted: boolean;
  isVideoEnabled: boolean;
  duration?: number;
  isGroupCall?: boolean; // WhatsApp
}

export interface SystemConfiguration {
    // Display (12)
    adaptiveBrightness: boolean;
    blueLightFilter: boolean;
    grayscaleMode: boolean;
    refreshRate: '60hz' | '90hz' | '120hz';
    hdrPlayback: boolean;
    uiScaling: number; // 0.8 - 1.2
    fontType: 'System' | 'Aura Serif' | 'Aura Sans' | 'Monospace';
    emojiStyle: '3D' | 'Flat' | 'Retro';
    iconShape: 'Circle' | 'Squircle' | 'Square';
    backdropBlur: number; // 0 - 20
    animationDuration: 'fast' | 'normal' | 'slow';
    oledBlack: boolean;

    // Audio (10)
    masterVolume: number;
    ambienceVolume: number;
    sfxVolume: number;
    spatialAudio: boolean;
    dolbyAtmos: boolean;
    equalizerPreset: 'Balanced' | 'Bass Boost' | 'Vocal' | 'Treble';
    noiseSuppression: boolean;
    highFidelityMusic: boolean;
    typingSounds: boolean;
    sentSound: string;

    // Network (8)
    dataSaver: boolean;
    imageCompression: 'Low' | 'Medium' | 'High' | 'Original';
    videoCompression: '720p' | '1080p' | '4k';
    autoDownloadWiFi: boolean;
    autoDownloadCellular: boolean;
    proxyHost: string;
    customDNS: string;
    p2pUpdates: boolean;

    // Storage (7)
    maxCacheSize: number; // MB
    autoClearCache: boolean;
    keepMediaDays: number;
    localDatabaseBackup: boolean;
    exportHistory: boolean;
    clearGifCache: boolean;
    databaseOptimization: boolean;

    // Privacy/Security (7)
    appLockTimeout: number; // seconds
    screenCaptureBlock: boolean;
    incognitoKeyboard: boolean;
    linkPreviews: boolean;
    readClipboard: boolean;
    biometricAuth: boolean;
    scramblePin: boolean;

    // Experimental (6)
    gpuAcceleration: boolean;
    fpsOverlay: boolean;
    debugLogging: boolean;
    betaChannel: boolean;
    godModeTrigger: boolean;
    experimentalGestures: boolean;
}

export interface MarketAddon {
    id: string;
    name: string;
    description: string;
    category: 'theme' | 'visual' | 'audio' | 'privacy' | 'tool' | 'badge';
    price: number | 'free';
    icon: string;
    purchased: boolean;
}

export interface FacebookSettings {
    // Profile (10)
    workplace: string;
    education: string;
    currentCity: string;
    hometown: string;
    relationshipStatus: string;
    namePronunciation: string;
    bio: string;
    hobbies: string[];
    featuredPhotos: boolean;
    musicOnProfile: boolean;

    // Privacy (10)
    profileLock: boolean;
    whoCanSeeFuturePosts: 'public' | 'friends' | 'only_me';
    whoCanSendFriendRequests: 'everyone' | 'friends_of_friends';
    whoCanLookUpByEmail: 'everyone' | 'friends' | 'only_me';
    whoCanLookUpByPhone: 'everyone' | 'friends' | 'only_me';
    searchEngineIndexing: boolean;
    activityLogAccess: boolean;
    downloadInformation: boolean;
    legacyContact: string;
    deactivationStatus: boolean;

    // Timeline & Tagging (10)
    whoCanPostOnTimeline: 'friends' | 'only_me';
    whoCanSeeOthersPosts: 'public' | 'friends' | 'only_me';
    reviewTagsBeforeAppearing: boolean;
    reviewPostsTaggedIn: boolean;
    autoTaggingSuggestions: boolean;
    faceRecognition: boolean;
    locationHistory: boolean;
    nearbyFriends: boolean;
    offFacebookActivity: boolean;
    adPreferences: 'personalized' | 'generic';
}

export interface MarketplaceConfiguration {
    // Buying (10)
    searchRadius: number; // km
    currency: string;
    savedItems: string[];
    alertKeywords: string[];
    browsingHistory: boolean;
    autoPlayVideos: boolean;
    meetupPreferences: 'public' | 'door_pickup' | 'drop_off';
    secureCheckout: boolean;
    purchaseProtection: boolean;
    showSoldListings: boolean;

    // Selling (10)
    sellerDashboard: boolean;
    vacationMode: boolean;
    autoRenewListings: boolean;
    hideFromFriends: boolean;
    syncToGroups: boolean;
    quickReplies: string[];
    sellerRatingVisible: boolean;
    shippingEnabled: boolean;
    localDelivery: boolean;
    boostListings: boolean;
}

export interface UserSettings {
  // Profile
  name: string;
  email?: string; // Auth
  about: string;
  avatar: string;
  phoneNumber: string;
  username: string;
  gender?: string; // Auth
  dob?: string; // Auth
  
  isPremium: boolean;
  subscriptionTier: SubscriptionTier;
  badges: Badge[];
  
  // Economy
  auraCoins: number;

  // App - Privacy (WhatsApp/GB Styles)
  readReceipts: boolean;
  onlineStatus: boolean; 
  lastSeenPrivacy: 'everyone' | 'contacts' | 'nobody';
  profilePhotoPrivacy: 'everyone' | 'contacts' | 'nobody';
  aboutPrivacy: 'everyone' | 'contacts' | 'nobody';
  disappearingMessagesDefault?: number; // 0, 24h, 7d, 90d
  
  // GB Specific
  hideTyping?: boolean;
  hideRecording?: boolean;
  antiDelete?: boolean;
  showBlueTicksAfterReply?: boolean;
  
  // Security
  appLock?: boolean;
  twoStepVerification?: boolean;
  biometricUnlock?: boolean; // WhatsApp

  // Notifications
  notifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  groupNotifications: boolean;
  previewMessage?: boolean; // WhatsApp

  // Chat
  theme: 'dark' | 'midnight' | 'obsidian';
  wallpaper: string;
  fontSize: 'small' | 'medium' | 'large';
  mediaAutoDownload: boolean;
  enterToSend?: boolean; // WhatsApp
  archiveChats?: boolean; // WhatsApp

  // 2K/High Fidelity Features
  mediaQuality: 'standard' | 'hd' | '2k' | '4k';
  highFidelityAudio: boolean;
  hapticsStrength: number;
  renderScale: number;
  
  // Telegram Features
  telegramFeatures?: TelegramFeatures;
  telegramComprehensive?: TelegramComprehensiveSettings;

  // TikTok / Creator Features
  creatorSettings?: CreatorSettings;

  // Facebook Features (Social/Profile)
  facebookSettings: FacebookSettings;
  
  // Marketplace Features
  marketplaceSettings: MarketplaceConfiguration;

  // 50+ System Features
  systemSettings: SystemConfiguration;
}

export interface TelegramComprehensiveSettings {
    // Chat Settings
    messageTextSize: number;
    chatBackgroundId: string;
    autoNightMode: boolean;
    inAppBrowser: boolean;
    directShare: boolean;
    enableAnimations: boolean;
    largeEmojis: boolean;
    raiseToSpeak: boolean;
    sendByEnter: boolean;
    saveToGallery: boolean;
    distanceUnits: 'km' | 'mi';
    suggestStickers: boolean;
    loopAnimatedStickers: boolean;
    maskStickers: boolean;
    quickReaction: string;

    // Privacy & Security
    blockedUsers: string[];
    phoneNumberPrivacy: 'everyone' | 'contacts' | 'nobody';
    lastSeenOnlinePrivacy: 'everyone' | 'contacts' | 'nobody';
    profilePhotosPrivacy: 'everyone' | 'contacts' | 'nobody';
    forwardedMessagesPrivacy: 'everyone' | 'contacts' | 'nobody';
    callsPrivacy: 'everyone' | 'contacts' | 'nobody';
    groupsChannelsPrivacy: 'everyone' | 'contacts' | 'nobody';
    passcodeLock: boolean;
    twoStepAuth: boolean;
    activeSessions: number;
    deleteAccountIfAway: number; // months
    syncContacts: boolean;
    suggestFrequentContacts: boolean;
    mapPreviewProvider: 'google' | 'telegram' | 'none';
    voiceMessagesPrivacy: 'everyone' | 'contacts' | 'nobody';

    // Data & Storage
    storageUsage: number; // MB
    dataUsage: number; // MB
    autoDownloadMobile: boolean;
    autoDownloadWiFi: boolean;
    autoDownloadRoaming: boolean;
    autoPlayGifs: boolean;
    autoPlayVideos: boolean;
    streamingEnabled: boolean;
    saveToGalleryPrivate: boolean;
    saveToGalleryGroups: boolean;
    saveToGalleryChannels: boolean;

    // Notifications
    privateChatsNotify: boolean;
    groupsNotify: boolean;
    channelsNotify: boolean;
    badgeCounter: boolean;
    inAppSounds: boolean;
    inAppVibrate: boolean;
    inAppPreview: boolean;
    contactJoinedNotify: boolean;
    pinnedMessagesNotify: boolean;
}

export interface CreatorSettings {
    // Analytics & Tools
    analyticsEnabled: boolean;
    creatorPortalAccess: boolean;
    qaFeature: boolean; // Q&A
    adAuthorization: boolean;
    brandedContentToggle: boolean;
    videoGifts: boolean;
    liveGifts: boolean;
    shopFeature: boolean;
    soundCopyrightCheck: boolean;
    
    // Privacy (Interactions)
    allowDuet: 'everyone' | 'friends' | 'nobody';
    allowStitch: 'everyone' | 'friends' | 'nobody';
    allowDownloads: boolean;
    whoCanDM: 'everyone' | 'friends' | 'nobody';
    whoCanComment: 'everyone' | 'friends' | 'nobody';
    whoCanTag: 'everyone' | 'friends' | 'nobody';
    whoCanMention: 'everyone' | 'friends' | 'nobody';
    storyReplies: 'everyone' | 'friends' | 'nobody';
    filterComments: boolean;
    filterKeywords: string[];
    
    // Discovery
    privateAccount: boolean;
    suggestAccountToContacts: boolean;
    suggestAccountToFacebook: boolean;
    syncContacts: boolean;
    syncFacebookFriends: boolean;
    activityStatus: boolean;
    
    // Playback & Content
    autoplayVideos: boolean;
    openInMute: boolean;
    captionsEnabled: boolean;
    autoVolumeAdjustment: boolean;
    hdUploads: boolean;
    saveToDevice: boolean;
    pipMode: boolean; // Picture in Picture
    backgroundPlay: boolean;
    animatedThumbnail: boolean;
    removePhotosensitive: boolean; // Remove strobes
    
    // Digital Wellbeing
    screenTimeManagement: boolean;
    restrictedMode: boolean; // Kids mode
    familyPairing: boolean;
    
    // Data & Cache
    dataSaver: boolean;
    clearCacheOnExit: boolean;
    
    // Notifications (Granular)
    notifyLikes: boolean;
    notifyComments: boolean;
    notifyMentions: boolean;
    notifyFollows: boolean;
    notifyDirectMessages: boolean;
    notifyVideoSuggestions: boolean;
    notifyLivestreams: boolean;
    
    // Live
    liveReplays: boolean;
    liveSubscription: boolean;
    
    // Language
    appLanguage: string;
    translationLanguage: string;
    alwaysTranslate: boolean;
}

export interface TelegramFeatures {
    chatFolders: Folder[];
    autoNightMode: boolean;
    animationSpeed: number;
    stickerSets: string[];
    privacyExceptions: PrivacyExceptions;
    dataStorage: {
        keepMedia: number; // days
        maxCacheSize: number; // MB
    };
}

export interface Folder {
    id: string;
    name: string;
    icon: string;
    includedChats: string[];
    excludedChats: string[];
}

export interface PrivacyExceptions {
    lastSeen: string[];
    profilePhoto: string[];
    calls: string[];
    forwarding: string[];
}

export interface ScheduledMessage {
    id: string;
    chatId: string;
    text: string;
    scheduledFor: number;
}

export interface Channel {
    id: string;
    name: string;
    subscribers: number;
    description: string;
    isPublic: boolean;
    adminIds: string[];
}

export interface Bot {
    id: string;
    name: string;
    username: string;
    commands: { command: string; description: string }[];
    isInline: boolean;
}

// Facebook/Instagram-style Features
export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: number;
  likes?: number; // FB
  replies?: Comment[]; // FB
}

export type PostType = 'text' | 'image' | 'video' | 'memory' | 'event' | 'product';
export type FilterType = 'none' | 'ethereal' | 'noir' | 'golden' | 'neptune' | 'vintage';

export interface MusicTrack {
    title: string;
    artist: string;
    cover: string;
    duration?: number; // TikTok
    isTrending?: boolean; // TikTok
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  image?: string; 
  videoUrl?: string; 
  type: PostType;
  filter?: FilterType;
  likes: number;
  views?: number; 
  shares?: number; // TikTok
  saves?: number; // TikTok
  comments: Comment[];
  timestamp: number;
  likedByMe: boolean;
  savedByMe?: boolean; // TikTok
  myReaction?: string;
  musicTrack?: MusicTrack;
  
  // Facebook Features
  location?: string;
  feeling?: string; // "Feeling happy"
  taggedUsers?: string[];
  isMemory?: boolean; // "On this day"
}

export interface Story {
  id: string;
  authorId: string;
  image: string;
  isViewed: boolean;
  timestamp: number;
  music?: MusicTrack; // Insta/TikTok
  location?: string; // Insta
}

export interface UserProfile {
    id: string;
    contactId: string; 
    posts: Post[];
    followers: number;
    following: number;
    bio: string;
    website?: string; // Insta
    highlights?: any[]; // Insta
    mutualFriends?: number; // FB
}

export interface SocialNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'event' | 'group' | 'security';
  actorId: string;
  postId?: string; 
  previewImage?: string; 
  timestamp: number;
  read: boolean;
  text?: string;
}

// Marketplace (Facebook)
export interface Product {
    id: string;
    sellerId: string;
    title: string;
    price: number;
    currency: string;
    image: string;
    description: string;
    category: string;
    location: string;
    condition: 'new' | 'used_like_new' | 'used_good' | 'used_fair';
    rating?: number;
    reviews?: number;
    isPromoted?: boolean;
}

// Events (Facebook)
export interface CalendarEvent {
    id: string;
    organizerId: string;
    title: string;
    description: string;
    startTime: number;
    location: string;
    image: string;
    attendees: string[];
    interested: string[];
}

export interface LiveGuest {
    id: string;
    contactId: string;
    name: string;
    avatar: string;
    isAudioOn: boolean;
    isVideoOn: boolean;
}

export interface LiveGift {
    id: string;
    name: string;
    icon: string;
    value: number; // Cost in Aura Coins
    senderName: string;
    senderAvatar: string;
}

export interface CoinPackage {
    id: string;
    coins: number;
    price: string;
    bonus?: number;
}

export const MOOD_COLORS: Record<MoodType, string> = {
  serene: '#2dd4bf', 
  joyful: '#fbbf24', 
  melancholic: '#60a5fa', 
  energetic: '#f87171', 
  neutral: '#a3a3a3', 
};

export const MOOD_DESCRIPTIONS: Record<MoodType, string> = {
  serene: 'Peaceful and quiet',
  joyful: 'Happy and radiant',
  melancholic: 'Reflective and soft',
  energetic: 'Busy and intense',
  neutral: 'Present',
};

export const FILTERS: Record<FilterType, string> = {
    none: 'none',
    ethereal: 'brightness(1.1) contrast(0.9) saturate(1.2) hue-rotate(10deg)',
    noir: 'grayscale(1) contrast(1.2) brightness(0.9)',
    golden: 'sepia(0.4) saturate(1.5) contrast(1.1) brightness(1.1)',
    neptune: 'hue-rotate(180deg) saturate(1.5) brightness(0.9)',
    vintage: 'sepia(0.6) contrast(0.8) brightness(0.9) saturate(0.8)'
};