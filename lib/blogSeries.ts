type SeriesArticle = {
  series?: string;
  seriesEpisode?: string;
  sortDate: string;
};

type FeaturedArticle = {
  slug: string;
  series?: string;
};

type SeriesPageArticle = SeriesArticle & {
  seriesTitle?: string;
  publishedAt?: string;
  date?: string;
};

export function getSeriesArticles<T extends SeriesArticle>(
  articles: T[],
  series: string
): T[] {
  return articles
    .filter((article) => article.series === series)
    .sort((a, b) => {
      const episodeA = Number.parseInt(a.seriesEpisode || "", 10);
      const episodeB = Number.parseInt(b.seriesEpisode || "", 10);

      if (
        Number.isFinite(episodeA) &&
        Number.isFinite(episodeB) &&
        episodeA !== episodeB
      ) {
        return episodeA - episodeB;
      }

      return a.sortDate.localeCompare(b.sortDate);
    });
}

export function getBlogSeriesSlugs<T extends Pick<SeriesArticle, "series">>(
  articles: T[]
): string[] {
  return [
    ...new Set(
      articles
        .map((article) => article.series)
        .filter((series): series is string => Boolean(series))
    )
  ];
}

export function getFeaturedSeriesLinks(article: FeaturedArticle) {
  return {
    articleHref: `/blog/${article.slug}`,
    seriesHref: article.series ? `/blog/series/${article.series}` : undefined
  };
}

export function getBlogSeriesPageData<T extends SeriesPageArticle>(
  articles: T[],
  series: string
) {
  const episodes = getSeriesArticles(articles, series);

  if (!episodes.length) {
    return undefined;
  }

  const latestEpisode = [...episodes].sort((a, b) =>
    b.sortDate.localeCompare(a.sortDate)
  )[0];

  return {
    title: episodes.find((episode) => episode.seriesTitle)?.seriesTitle || series,
    episodes,
    latestPublishedAt:
      latestEpisode.publishedAt || latestEpisode.date || latestEpisode.sortDate
  };
}
