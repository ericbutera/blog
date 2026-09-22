export const googleAnalyticsId = import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID;

export const isGoogleAnalyticsEnabled =
  import.meta.env.PROD && Boolean(googleAnalyticsId);
