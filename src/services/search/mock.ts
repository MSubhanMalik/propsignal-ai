import type { SearchResult } from '@/types'

const MOCK_DATA: Record<string, SearchResult[]> = {
  'dha valley': [
    {
      title: 'DHA Valley Islamabad: Buyers demand refunds after 10-year delay',
      url: 'https://www.dawn.com/news/dha-valley-delay-2024',
      snippet: 'Hundreds of allottees of DHA Valley Islamabad have filed complaints with the Federal Ombudsman after the project, promised for delivery in 2014, remains incomplete. Buyers report paying full amounts with no possession in sight.',
    },
    {
      title: 'Court orders DHA Valley to refund defaulting buyers — The News',
      url: 'https://www.thenews.com.pk/dha-valley-court-order',
      snippet: 'The Islamabad High Court has directed DHA Valley management to process refunds for buyers who opted out, following a class action suit filed by over 200 allottees alleging fraud and misrepresentation.',
    },
    {
      title: 'FIA launches inquiry into DHA Valley Islamabad marketing claims',
      url: 'https://arynews.tv/fia-dha-valley-inquiry',
      snippet: 'The Federal Investigation Agency has initiated a probe into alleged fraudulent marketing materials used by DHA Valley Islamabad, which promised amenities and possession dates that were not honored.',
    },
    {
      title: 'Social media flooded with DHA Valley complaints — Propspace Forum',
      url: 'https://www.propspace.pk/forum/dha-valley-complaints',
      snippet: 'A Facebook group with over 15,000 members documents ongoing grievances of DHA Valley buyers, including unresponsive management, no development updates, and bounced cheques from the developer.',
    },
  ],

  'park lane': [
    {
      title: 'Park Lane Residences Lahore: Handover delayed by 18 months',
      url: 'https://propbazaar.com/news/park-lane-residences-delay',
      snippet: 'Buyers of Park Lane Residences in DHA Lahore Phase 9 have been notified that handover will be delayed by approximately 18 months due to import restrictions on construction materials. Developer has offered penalty compensation per contract terms.',
    },
    {
      title: 'Park Lane Residences awarded Best Mid-Rise Project 2023 — ARY Laghari',
      url: 'https://arylaghari.com/awards/park-lane-2023',
      snippet: 'Park Lane Residences received the Best Mid-Rise Project award at the Pakistan Real Estate Summit 2023, recognized for its architectural quality and adherence to RERA registration requirements.',
    },
    {
      title: 'RERA confirms Park Lane Residences registration in Punjab — Tribune',
      url: 'https://tribune.com.pk/rera-park-lane-registration',
      snippet: 'Punjab Real Estate Regulatory Authority has confirmed that Park Lane Residences is a RERA-registered project. The developer, Crescent Properties, is listed in good standing with no outstanding complaints on record as of Q1 2024.',
    },
    {
      title: 'Mixed reviews: Park Lane buyers frustrated by delay but praise build quality',
      url: 'https://zameen.com/blog/park-lane-residences-review',
      snippet: 'Zameen.com user reviews for Park Lane Residences present a mixed picture: buyers acknowledge the delay is frustrating, but those who have received possession report the construction quality exceeds expectations.',
    },
  ],

  'bahria orchard': [
    {
      title: 'Bahria Orchard Lahore: Fastest-selling gated community in Punjab — Business Recorder',
      url: 'https://www.brecorder.com/bahria-orchard-lahore-2024',
      snippet: 'Bahria Orchard Lahore has recorded over 12,000 plot sales in 2024 alone, making it the fastest-selling gated community in Punjab. Infrastructure completion has reached 94% across all phases.',
    },
    {
      title: 'Bahria Orchard wins "Most Trusted Developer" — Propforce Summit 2024',
      url: 'https://propforce.pk/summit-2024-awards',
      snippet: 'Bahria Town was recognized as the Most Trusted Developer at the Propforce Summit 2024, with Bahria Orchard cited specifically for on-time possession delivery across Phase 1 and 2.',
    },
    {
      title: 'No legal cases found against Bahria Orchard Lahore — Legal Database',
      url: 'https://pakistanlegaldb.com/search/bahria-orchard',
      snippet: 'A search of the Punjab courts database returns no active civil or criminal cases specifically against Bahria Orchard Lahore as a project entity. Bahria Town Ltd has historical disputes in other projects but Orchard has a clean record.',
    },
    {
      title: 'Bahria Orchard buyer testimonials — Zameen.com',
      url: 'https://zameen.com/blog/bahria-orchard-testimonials-2024',
      snippet: 'Over 400 verified buyer testimonials on Zameen.com rate Bahria Orchard Lahore 4.3/5 on average. Key positives cited: security, maintained roads, consistent utility supply, and responsive management.',
    },
  ],
}

export function getMockSearchResults(query: string): SearchResult[] {
  const q = query.toLowerCase()
  for (const [key, results] of Object.entries(MOCK_DATA)) {
    if (q.includes(key)) return results
  }
  return [
    {
      title: `No significant public records found for "${query}"`,
      url: 'https://propbazaar.com/search',
      snippet: `A search for "${query}" returned no significant news, legal, or review content from public sources. This may indicate a new project with limited public presence, or a very localized development.`,
    },
  ]
}
