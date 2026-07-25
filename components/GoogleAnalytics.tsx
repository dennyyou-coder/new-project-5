"use client";

import { useEffect } from "react";
import {
  type GoogleAnalyticsDocument,
  type GoogleAnalyticsWindow,
  initializeGoogleAnalytics
} from "@/lib/googleAnalytics";

export function GoogleAnalytics() {
  useEffect(() => {
    initializeGoogleAnalytics(
      window as unknown as GoogleAnalyticsWindow,
      document as unknown as GoogleAnalyticsDocument
    );
  }, []);

  return null;
}
