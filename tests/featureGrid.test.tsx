import { render, screen } from '@testing-library/react'
import FeatureGrid from '@/app/components/FeatureGrid'
import type { Feature } from '@/app/data/features'

function makeFeature(overrides?: Partial<Feature['feature']>): Feature {
  return {
    id: 'feat-1',
    feature: {
      id: 1,
      title: 'Smart Search',
      description: 'Find files fast.',
      icon: 'CLOCK_ICON',
      ...overrides,
    },
  }
}

describe('FeatureGrid', () => {
  describe('rendering', () => {
    it('renders a card for each feature', () => {
      const features = [
        makeFeature({ id: 1, title: 'Feature A' }),
        makeFeature({ id: 2, title: 'Feature B' }),
        makeFeature({ id: 3, title: 'Feature C' }),
      ]
      render(<FeatureGrid features={features} />)
      expect(screen.getByText('Feature A')).toBeInTheDocument()
      expect(screen.getByText('Feature B')).toBeInTheDocument()
      expect(screen.getByText('Feature C')).toBeInTheDocument()
    })

    it('renders exactly one card per feature', () => {
      const features = [
        makeFeature({ id: 1 }),
        makeFeature({ id: 2 }),
      ]
      const { container } = render(<FeatureGrid features={features} />)
      expect(container.querySelectorAll('h3')).toHaveLength(2)
    })

    it('renders the feature title as an h3 heading', () => {
      render(<FeatureGrid features={[makeFeature({ title: 'Smart Search' })]} />)
      expect(screen.getByRole('heading', { level: 3, name: 'Smart Search' })).toBeInTheDocument()
    })

    it('renders the feature description', () => {
      render(<FeatureGrid features={[makeFeature({ description: 'Find files fast.' })]} />)
      expect(screen.getByText('Find files fast.')).toBeInTheDocument()
    })

    it('renders an empty grid when given no features', () => {
      const { container } = render(<FeatureGrid features={[]} />)
      expect(container.querySelector('.grid')).toBeEmptyDOMElement()
    })
  })

  describe('icon rendering', () => {
    it.each([
      ['CLOCK_ICON'],
      ['CLICK_ICON'],
      ['CLOUD_ICON'],
    ])('renders an SVG for the named icon "%s"', (icon) => {
      const { container } = render(<FeatureGrid features={[makeFeature({ icon })]} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('renders a fallback SVG for an unrecognised icon name', () => {
      const { container } = render(<FeatureGrid features={[makeFeature({ icon: 'UNKNOWN_ICON' })]} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('renders a different SVG path for each named icon', () => {
      const icons = ['CLOCK_ICON', 'CLICK_ICON', 'CLOUD_ICON']
      const paths = icons.map((icon) => {
        const { container } = render(<FeatureGrid features={[makeFeature({ icon })]} />)
        return container.querySelector('svg path')?.getAttribute('d')
      })
      const unique = new Set(paths)
      expect(unique.size).toBe(3)
    })
  })

  describe('cols prop', () => {
    it('applies lg:grid-cols-3 by default', () => {
      const { container } = render(<FeatureGrid features={[makeFeature()]} />)
      expect(container.firstChild).toHaveClass('lg:grid-cols-3')
    })

    it('applies lg:grid-cols-3 when cols={3}', () => {
      const { container } = render(<FeatureGrid features={[makeFeature()]} cols={3} />)
      expect(container.firstChild).toHaveClass('lg:grid-cols-3')
    })

    it('applies lg:grid-cols-4 when cols={4}', () => {
      const { container } = render(<FeatureGrid features={[makeFeature()]} cols={4} />)
      expect(container.firstChild).toHaveClass('lg:grid-cols-4')
    })

    it('does not apply lg:grid-cols-4 when cols={3}', () => {
      const { container } = render(<FeatureGrid features={[makeFeature()]} cols={3} />)
      expect(container.firstChild).not.toHaveClass('lg:grid-cols-4')
    })
  })

  describe('iconSize prop', () => {
    it('applies size-9 to the icon container by default', () => {
      const { container } = render(<FeatureGrid features={[makeFeature()]} />)
      expect(container.querySelector('span')).toHaveClass('size-9')
    })

    it('applies size-9 to the icon container when iconSize="sm"', () => {
      const { container } = render(<FeatureGrid features={[makeFeature()]} iconSize="sm" />)
      expect(container.querySelector('span')).toHaveClass('size-9')
    })

    it('applies size-10 to the icon container when iconSize="md"', () => {
      const { container } = render(<FeatureGrid features={[makeFeature()]} iconSize="md" />)
      expect(container.querySelector('span')).toHaveClass('size-10')
    })

    it('does not apply size-10 when iconSize="sm"', () => {
      const { container } = render(<FeatureGrid features={[makeFeature()]} iconSize="sm" />)
      expect(container.querySelector('span')).not.toHaveClass('size-10')
    })
  })
})