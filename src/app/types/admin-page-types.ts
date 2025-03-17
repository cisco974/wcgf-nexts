// types/admin-page-types.ts
import { SupportedLocale } from "./gamePages";

// Type for the page type
export interface PageType {
  id: number;
  key: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for the game data
export interface GameData {
  id: number;
  key: string;
  title: string;
  subtitle: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Type for localized meta data
export interface LocalizedMeta {
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

// Type for localized content
export interface LocalizedContent {
  page_header?: {
    title?: string;
  };
  introduction?: {
    title?: string;
    text?: string;
  };
  main_sections?: Array<{
    title: string;
    text: string;
    cta?: {
      link: string;
      text: string;
    };
  }>;
  sidebar?: {
    cta_title?: string;
    cta_subtitle?: string;
    buttons?: string[];
    partner_text?: string;
  };
  learn_more?: {
    title?: string;
    introduction?: string;
  };
  history?: {
    title?: string;
    sections: Array<{
      title: string;
      text: string;
    }>;
  };
  glossary?: {
    title?: string;
    terms: Array<{
      term: string;
      definition: string;
    }>;
  };
  play_free?: {
    title?: string;
    text?: string;
  };
  [key: string]: unknown;
}

// Type for the content structure by language
export interface GamePageContent {
  [locale: string]: LocalizedContent;
}

// Type for the metadata structure by language
export interface GamePageMeta {
  [locale: string]: LocalizedMeta;
}

// Type for game page data in admin
export interface AdminGamePageData {
  id: number;
  gameId: number;
  pageTypeId: number;
  content: GamePageContent;
  meta: GamePageMeta;
  isPublished: boolean;
  pageType: PageType;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for form field values that can be modified in the editor
export type FormFieldValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<unknown>;

// Type for save data structure
export interface SaveGamePageData {
  content: GamePageContent;
  meta: GamePageMeta;
  isPublished: boolean;
}

// Type for initial data loading return value
export interface InitialDataResult {
  game: GameData;
  pageType: PageType;
  gamePage: AdminGamePageData;
}

// Type for language definition
export interface LanguageOption {
  code: SupportedLocale;
  name: string;
}

// Type for meta field definition
export interface MetaField {
  key: keyof LocalizedMeta;
  label: string;
}
