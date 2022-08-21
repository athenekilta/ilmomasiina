export type Branding = {
  headerTitle: string;
  footerGdprText: string;
  footerGdprLink: string;
  footerHomeText: string;
  footerHomeLink: string;
  headerLogoUrl: string;
};

const branding: Branding = {
  headerTitle: BRANDING_HEADER_TITLE_TEXT,
  footerGdprText: BRANDING_FOOTER_GDPR_TEXT,
  footerGdprLink: BRANDING_FOOTER_GDPR_LINK,
  footerHomeText: BRANDING_FOOTER_HOME_TEXT,
  footerHomeLink: BRANDING_FOOTER_HOME_LINK,
  headerLogoUrl: BRANDING_LOGO_URL,
};

export default branding;
