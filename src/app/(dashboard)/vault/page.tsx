// src/app/(dashboard)/vault/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCrypto } from '@/contexts/CryptoContext';
import { useAuth } from '@/contexts/AuthContext';
import { VaultItemResponse } from '@/types/vault.types';
import { API_ROUTES } from '@/config/constants';
import VaultItemCard from '@/components/vault/VaultItemCard';
import VaultItemModal from '@/components/vault/VaultItemModal';
import toast from 'react-hot-toast';

export default function VaultPage() {
  const { isUnlocked } = useCrypto();
  const { user } = useAuth();
  
  const [items, setItems] = useState<VaultItemResponse[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItemResponse | null>(null);

  // Fetch items on mount
  useEffect(() => {
    if (isUnlocked) {
      fetchItems();
    }
  }, [isUnlocked]);

  // Filter items when search changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(items);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query) ||
        item.url?.toLowerCase().includes(query) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const fetchItems = async () => {
    try {
      const response = await fetch(API_ROUTES.vault.base, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      const data = await response.json();
      setItems(data.data || []);
      setFilteredItems(data.data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load vault items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    const response = await fetch(API_ROUTES.vault.base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create item');
    }

    await fetchItems();
  };

  const handleUpdate = async (data: any) => {
    if (!editingItem) return;

    const response = await fetch(API_ROUTES.vault.byId(editingItem._id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update item');
    }

    await fetchItems();
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(API_ROUTES.vault.byId(id), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete item');
    }

    await fetchItems();
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: VaultItemResponse) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (!isUnlocked) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Vault Locked
            </h2>
            <p className="text-gray-600">
              Please refresh the page or log in again to unlock your vault.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Password Vault
              </h1>
              <p className="text-gray-600">
                {items.length} {items.length === 1 ? 'item' : 'items'} stored securely
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, username, URL, or tags..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your vault...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Vault is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start by adding your first password
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Add First Item
            </button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && items.length > 0 && filteredItems.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600 mb-4">
              Try a different search term
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <VaultItemCard
                key={item._id}
                item={item}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <VaultItemModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={editingItem ? handleUpdate : handleCreate}
          item={editingItem}
        />
      </div>
    </div>
  );
}