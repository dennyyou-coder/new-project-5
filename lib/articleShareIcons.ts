import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter
} from "react-icons/fa6";
import { FiCopy, FiShare2 } from "react-icons/fi";
import type { ArticleShareLink } from "@/lib/articleSharing";

export const ARTICLE_SHARE_ICONS: Record<ArticleShareLink["id"], IconType> = {
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  facebook: FaFacebookF,
  whatsapp: FaWhatsapp
};

export const ARTICLE_COPY_ICON: IconType = FiCopy;
export const ARTICLE_NATIVE_SHARE_ICON: IconType = FiShare2;
