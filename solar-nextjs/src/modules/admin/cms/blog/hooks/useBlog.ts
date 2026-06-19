'use client';

import { useState, useMemo } from 'react';
import type { BlogCMS } from '@/modules/admin/types';

const MOCK_POSTS: BlogCMS[] = [
  {
    id: 'b1',
    title: 'How Solar Energy Can Save Your Electricity Bill by 90%',
    slug: 'solar-energy-save-electricity-bill',
    excerpt:
      'Discover how rooftop solar panels can drastically cut your monthly electricity costs.',
    category: 'Savings & Finance',
    tags: ['solar', 'savings', 'electricity'],
    locale: 'en',
    published: true,
    featured: true,
    author: 'Admin',
    readTimeMinutes: 5,
    createdAt: Date.now() - 604800000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'b2',
    title: 'Government Solar Subsidies in 2024: Complete Guide',
    slug: 'government-solar-subsidies-2024',
    excerpt: 'Everything you need to know about PM Surya Ghar Muft Bijli Yojana and state schemes.',
    category: 'Government Schemes',
    tags: ['subsidy', 'government', 'guide'],
    locale: 'en',
    published: true,
    featured: false,
    author: 'Admin',
    readTimeMinutes: 8,
    createdAt: Date.now() - 1209600000,
    updatedAt: Date.now() - 172800000,
  },
  {
    id: 'b3',
    title: 'Monocrystalline vs Bifacial Solar Panels: Which is Better?',
    slug: 'monocrystalline-vs-bifacial-solar-panels',
    excerpt: 'A detailed comparison to help you choose the right solar panel for your home.',
    category: 'Technology',
    tags: ['panels', 'comparison', 'technology'],
    locale: 'en',
    published: false,
    featured: false,
    author: 'Admin',
    readTimeMinutes: 6,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
  },
];

export function useBlog() {
  const [posts, setPosts] = useState<BlogCMS[]>(MOCK_POSTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (filter === 'published') result = result.filter((p) => p.published);
    if (filter === 'draft') result = result.filter((p) => !p.published);
    return result.sort((a, b) => b.createdAt - a.createdAt);
  }, [posts, search, filter]);

  const togglePublish = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published, updatedAt: Date.now() } : p))
    );
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    posts: filtered,
    allPosts: posts,
    search,
    setSearch,
    filter,
    setFilter,
    togglePublish,
    deletePost,
    counts: {
      all: posts.length,
      published: posts.filter((p) => p.published).length,
      draft: posts.filter((p) => !p.published).length,
    },
  };
}
