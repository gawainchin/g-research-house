'use client'

import { useEffect, useMemo, useRef } from 'react'
import cytoscape, { type Core, type ElementDefinition } from 'cytoscape'

export interface CytoscapeGraphNode {
  id: string
  label: string
  kind: 'article' | 'keyword'
  href?: string
  section?: string
  weight?: number
}

export interface CytoscapeGraphEdge {
  id: string
  source: string
  target: string
  kind: 'keyword' | 'related'
}

export default function CytoscapeResearchGraph({ nodes, edges }: { nodes: CytoscapeGraphNode[]; edges: CytoscapeGraphEdge[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cyRef = useRef<Core | null>(null)
  const elements = useMemo<ElementDefinition[]>(() => [
    ...nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        kind: node.kind,
        href: node.href,
        section: node.section,
        weight: node.weight ?? 1,
      },
    })),
    ...edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        kind: edge.kind,
      },
    })),
  ], [nodes, edges])

  useEffect(() => {
    if (!containerRef.current) return

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      layout: {
        name: 'cose',
        animate: false,
        fit: true,
        padding: 36,
        nodeRepulsion: 9000,
        idealEdgeLength: 105,
      },
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'background-color': '#f7f5f0',
            'border-color': '#cbbfae',
            'border-width': 1.5,
            color: '#403a34',
            'font-family': 'Helvetica Neue, sans-serif',
            'font-size': '9px',
            'text-wrap': 'wrap',
            'text-max-width': '92px',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 'mapData(weight, 1, 5, 34, 58)',
            height: 'mapData(weight, 1, 5, 34, 58)',
          },
        },
        {
          selector: 'node[kind = "article"]',
          style: {
            'background-color': '#fffdfa',
            'border-color': '#3d6b5e',
            'border-width': 2,
            color: '#171717',
            'font-weight': 700,
            width: '72px',
            height: '72px',
          },
        },
        {
          selector: 'node[section = "ai-research"]',
          style: {
            'border-color': '#4a5568',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.2,
            'line-color': '#ddd5c5',
            'target-arrow-color': '#ddd5c5',
            'target-arrow-shape': 'none',
            'curve-style': 'bezier',
          },
        },
        {
          selector: 'edge[kind = "related"]',
          style: {
            width: 2,
            'line-color': '#9fbfb5',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#2f4f46',
          },
        },
        {
          selector: 'edge:selected',
          style: {
            width: 3,
            'line-color': '#3d6b5e',
          },
        },
      ],
      minZoom: 0.45,
      maxZoom: 2.2,
    })

    cy.on('tap', 'node', (event) => {
      const href = event.target.data('href') as string | undefined
      if (href) window.location.href = href
    })

    cyRef.current = cy

    return () => {
      cy.destroy()
      cyRef.current = null
    }
  }, [elements])

  return (
    <div>
      <div
        ref={containerRef}
        aria-label="Interactive research graph"
        style={{
          height: 620,
          minHeight: 420,
          border: '1px solid #e6e0d6',
          borderRadius: 8,
          background: '#faf8f5',
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', marginTop: '0.85rem', color: '#5a544d', fontFamily: 'Helvetica Neue, sans-serif', fontSize: '0.82rem' }}>
        <span style={{ padding: '0.2rem 0.45rem', border: '1px solid #ddd5c5', borderRadius: 999, background: '#fffdfa' }}>Drag nodes</span>
        <span style={{ padding: '0.2rem 0.45rem', border: '1px solid #ddd5c5', borderRadius: 999, background: '#fffdfa' }}>Scroll to zoom</span>
        <span style={{ padding: '0.2rem 0.45rem', border: '1px solid #ddd5c5', borderRadius: 999, background: '#fffdfa' }}>Tap article nodes to open</span>
      </div>
    </div>
  )
}
