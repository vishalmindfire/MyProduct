import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import HomePage from '@/app/page'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

jest.mock('@/app/components/FeatureGrid', () => ({
  __esModule: true,
  default: ({ features }: { features: unknown[] }) => (
    <div data-testid="feature-grid" data-count={features.length} />
  ),
}))

jest.mock('@/app/components/PlanGrid', () => ({
  __esModule: true,
  default: () => <div data-testid="plan-grid" />,
}))

global.fetch = jest.fn()
const mockFetch = jest.mocked(global.fetch)

const MOCK_HOME_DATA = {
  data: {
    title: {
      heading: 'Everything your assets need.',
      subheading: 'One place to find them.',
    },
    description: 'Organize and distribute every file your team creates.',
    blocks: [
      {
        image: { url: '/uploads/hero.png', alternativeText: 'Hero screenshot' },
        link: {},
      },
      {
        feature: [
          { feature: { id: 1, title: 'Smart Search', description: 'Find files fast.', icon: 'CLOCK_ICON' } },
          { feature: { id: 2, title: 'Version History', description: 'Roll back anytime.', icon: 'CLICK_ICON' } },
        ],
      },
    ],
  },
}

beforeEach(() => {
  process.env.STRAPI_URL = 'http://localhost:1337'
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => MOCK_HOME_DATA,
  } as Response)
})

afterEach(() => {
  jest.clearAllMocks()
})

async function renderPage() {
  render(await HomePage())
}

describe('HomePage', () => {
  describe('hero section', () => {
    it('renders the main heading from CMS', async () => {
      await renderPage()
      expect(screen.getByText('Everything your assets need.')).toBeInTheDocument()
    })

    it('renders the subheading from CMS', async () => {
      await renderPage()
      expect(screen.getByText('One place to find them.')).toBeInTheDocument()
    })

    it('renders the description from CMS', async () => {
      await renderPage()
      expect(screen.getByText('Organize and distribute every file your team creates.')).toBeInTheDocument()
    })

    it('renders "Start for free" CTA', async () => {
      await renderPage()
      expect(screen.getByRole('link', { name: /start for free/i })).toBeInTheDocument()
    })

    it('renders "See all features" link pointing to /features', async () => {
      await renderPage()
      expect(screen.getByRole('link', { name: /see all features/i })).toHaveAttribute('href', '/features')
    })

    it('renders the hero image with correct alt text', async () => {
      await renderPage()
      expect(screen.getByAltText('Hero screenshot')).toBeInTheDocument()
    })

    it('renders the hero image with the Strapi URL', async () => {
      await renderPage()
      expect(screen.getByAltText('Hero screenshot')).toHaveAttribute(
        'src',
        'http://localhost:1337/uploads/hero.png'
      )
    })

    it('renders the free trial disclaimer', async () => {
      await renderPage()
      expect(screen.getByText(/free plan available/i)).toBeInTheDocument()
    })
  })

  describe('social proof section', () => {
    it('shows "Trusted by teams at" label', async () => {
      await renderPage()
      expect(screen.getByText(/trusted by teams at/i)).toBeInTheDocument()
    })

    it.each(['Luminary', 'Foundry Co.', 'Scope Agency', 'Vertex Labs', 'Meridian'])(
      'shows company "%s"',
      async (name) => {
        await renderPage()
        expect(screen.getByText(name)).toBeInTheDocument()
      }
    )
  })

  describe('features section', () => {
    it('renders the "Built for the full asset lifecycle" heading', async () => {
      await renderPage()
      expect(screen.getByText('Built for the full asset lifecycle')).toBeInTheDocument()
    })

    it('passes CMS feature data to FeatureGrid', async () => {
      await renderPage()
      expect(screen.getByTestId('feature-grid')).toHaveAttribute('data-count', '2')
    })

    it('renders "Explore all features" link pointing to /features', async () => {
      await renderPage()
      expect(screen.getByRole('link', { name: /explore all features/i })).toHaveAttribute('href', '/features')
    })
  })

  describe('pricing section', () => {
    it('renders "Simple, transparent pricing" heading', async () => {
      await renderPage()
      expect(screen.getByText('Simple, transparent pricing')).toBeInTheDocument()
    })

    it('renders PlanGrid', async () => {
      await renderPage()
      expect(screen.getByTestId('plan-grid')).toBeInTheDocument()
    })

    it('renders "See full plan comparison" link pointing to /pricing', async () => {
      await renderPage()
      expect(screen.getByRole('link', { name: /see full plan comparison/i })).toHaveAttribute('href', '/pricing')
    })
  })

  describe('testimonials section', () => {
    it('renders "Teams that made the switch" heading', async () => {
      await renderPage()
      expect(screen.getByText('Teams that made the switch')).toBeInTheDocument()
    })

    it.each([
      ['Sarah Chen', 'Head of Brand, Luminary Studio'],
      ['Marcus Williams', 'Creative Director, Foundry Commerce'],
      ['Priya Anand', 'Operations Lead, Scope Agency'],
    ])('renders testimonial from %s with their title', async (name, title) => {
      await renderPage()
      expect(screen.getByText(name)).toBeInTheDocument()
      expect(screen.getByText(title)).toBeInTheDocument()
    })

    it('renders 3 testimonial cards', async () => {
      await renderPage()
      expect(screen.getAllByRole('figure')).toHaveLength(3)
    })
  })

  describe('data fetching', () => {
    it('fetches home page data from the Strapi /api/home endpoint', async () => {
      await renderPage()
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/home'),
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('calls fetch exactly once', async () => {
      await renderPage()
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })
})
