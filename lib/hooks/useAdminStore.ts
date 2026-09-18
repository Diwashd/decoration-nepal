'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  getDestinations, saveDestinations,
  getServices, saveServices,
  getBlogPosts, saveBlogPosts, getBlogPostBySlug,
  getPackages, savePackages,
  type AdminStoreDestination,
  type AdminStoreService,
  type AdminStoreBlog,
  type AdminStorePackage,
} from '@/lib/store/admin-store';

// Hook that listens to localStorage changes for cross-tab/cross-component sync
function useStorageKey(key: string) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) setTick(t => t + 1);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return () => setTick(t => t + 1);
}

// Force re-render trigger
let globalTick = 0;
function useForceUpdate() {
  const [, setTick] = useState(0);
  return useCallback(() => {
    globalTick++;
    setTick(globalTick);
  }, []);
}

// ---- DESTINATIONS HOOK ----

export function useDestinations() {
  const [destinations, setDestinations] = useState<AdminStoreDestination[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDestinations(getDestinations());
    setLoaded(true);
  }, []);

  const updateDestinations = useCallback((updater: AdminStoreDestination[] | ((prev: AdminStoreDestination[]) => AdminStoreDestination[])) => {
    setDestinations(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveDestinations(next);
      return next;
    });
  }, []);

  return { destinations, setDestinations: updateDestinations, loaded };
}

// ---- SERVICES HOOK ----

export function useServices() {
  const [services, setServices] = useState<AdminStoreService[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setServices(getServices());
    setLoaded(true);
  }, []);

  const updateServices = useCallback((updater: AdminStoreService[] | ((prev: AdminStoreService[]) => AdminStoreService[])) => {
    setServices(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveServices(next);
      return next;
    });
  }, []);

  return { services, setServices: updateServices, loaded };
}

// ---- BLOG HOOK ----

export function useBlogPosts() {
  const [posts, setPosts] = useState<AdminStoreBlog[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPosts(getBlogPosts());
    setLoaded(true);
  }, []);

  const updatePosts = useCallback((updater: AdminStoreBlog[] | ((prev: AdminStoreBlog[]) => AdminStoreBlog[])) => {
    setPosts(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveBlogPosts(next);
      return next;
    });
  }, []);

  return { posts, setPosts: updatePosts, loaded };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<AdminStoreBlog | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPost(getBlogPostBySlug(slug) || null);
    setLoaded(true);
  }, [slug]);

  return { post, loaded };
}

// ---- PACKAGES HOOK ----

export function usePackages() {
  const [packages, setPackages] = useState<AdminStorePackage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPackages(getPackages());
    setLoaded(true);
  }, []);

  const updatePackages = useCallback((updater: AdminStorePackage[] | ((prev: AdminStorePackage[]) => AdminStorePackage[])) => {
    setPackages(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      savePackages(next);
      return next;
    });
  }, []);

  return { packages, setPackages: updatePackages, loaded };
}
