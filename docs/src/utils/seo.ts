export function generateSocialImage({
  title,
  tagline,
  cloudName = 'logaretm',
  imagePublicID,
  cloudinaryUrlBase = 'https://res.cloudinary.com',
  version = null,
  titleFont = 'montserrat',
  titleExtraConfig = 'bold',
  taglineExtraConfig = '',
  taglineFont = 'montserrat',
  imageWidth = 1280,
  imageHeight = 669,
  textAreaWidth = 760,
  textLeftOffset = 70,
  titleBottomOffset = 350,
  taglineTopOffset = 360,
  textColor = '09a884',
  taglineColor = 'ffffff',
  titleFontSize = 64,
  taglineFontSize = 48,
}) {
  // configure social media image dimensions, quality, and format
  const imageConfig = [`w_${imageWidth}`, `h_${imageHeight}`, 'c_fill', 'q_auto', 'f_auto'].join(',');
  // configure the title text
  const titleConfig = [
    `w_${textAreaWidth}`,
    'c_fit',
    `co_rgb:${textColor}`,
    'g_south_west',
    `x_${textLeftOffset}`,
    `y_${titleBottomOffset}`,
    `l_text:${titleFont}_${titleFontSize}${titleExtraConfig}:${encodeURIComponent(title)}`,
  ].join(',');
  // configure the tagline text
  const taglineConfig = [
    `w_${textAreaWidth}`,
    'c_fit',
    `co_rgb:${taglineColor}`,
    'g_north_west',
    `x_${textLeftOffset}`,
    `y_${taglineTopOffset}`,
    `l_text:${taglineFont}_${taglineFontSize}${taglineExtraConfig}:${encodeURIComponent(tagline)}`,
  ].join(',');
  // combine all the pieces required to generate a Cloudinary URL
  const urlParts = [
    cloudinaryUrlBase,
    cloudName,
    'image',
    'upload',
    imageConfig,
    titleConfig,
    taglineConfig,
    version,
    imagePublicID,
  ];

  // remove any falsy sections of the URL (e.g. an undefined version)
  const validParts = urlParts.filter(Boolean);

  // join all the parts into a valid URL to the generated image
  return validParts.join('/');
}

export function generateMetaTags({ title, description, image, url, keywords }: any) {
  return [
    {
      name: 'description',
      hid: 'description',
      content: description,
    },
    {
      name: 'og:description',
      property: 'og:description',
      hid: 'og:description',
      content: description,
    },
    {
      name: 'og:title',
      hid: 'og:title',
      property: 'og:title',
      content: title,
    },
    url
      ? {
          hid: 'og:url',
          name: 'og:url',
          property: 'og:url',
          content: url,
        }
      : undefined,
    image
      ? {
          name: 'og:image',
          hid: 'og:image',
          property: 'og:image',
          content: image,
        }
      : undefined,
    image
      ? {
          name: 'image',
          hid: 'image',
          property: 'image',
          content: image,
        }
      : undefined,
    {
      name: 'twitter:card',
      hid: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      property: 'twitter:title',
      content: title,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      property: 'twitter:description',
      content: description,
    },
    image
      ? {
          hid: 'twitter:image',
          name: 'twitter:image',
          property: 'twitter:image',
          content: image,
        }
      : undefined,
    keywords
      ? {
          hid: 'keywords',
          name: 'keywords',
          property: 'keywords',
          content: Array.isArray(keywords) ? keywords.join(', ') : keywords,
        }
      : undefined,
  ].filter(Boolean);
}

export function generateLinks({ url }) {
  return [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: url,
    },
  ];
}

export interface Frontmatter {
  title: string;
  menuTitle?: string;
  order: number;
  next?: {
    title: string;
    description: string;
    path: string;
    intro: string;
  };
  description?: string;
  path?: string;
}

export function buildMenu(pages: { url?: string; frontmatter: Frontmatter; children?: any[]; icon?: string }[]) {
  return [
    ...pages.sort((a, b) => {
      return a.frontmatter.order - b.frontmatter.order;
    }),
  ].map(p => {
    return {
      title: p.frontmatter.title,
      menuTitle: p.frontmatter.menuTitle,
      order: p.frontmatter.order,
      description: p.frontmatter.description,
      next: p.frontmatter.next,
      path: p.url || '',
      children: p.children ? buildMenu(p.children) : undefined,
      icon: p.icon || undefined,
    };
  });
}
