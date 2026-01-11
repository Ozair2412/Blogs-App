'use client';

import { useState } from 'react';

export default function CategoryFilter({ categories, items, renderItem, emptyMessage }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter items based on selected category
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === selectedCategory);

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <select
          className="form-input"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ maxWidth: '300px' }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid">
        {filteredItems.length > 0 ? (
          filteredItems.map(renderItem)
        ) : (
          <p className="empty-state">{emptyMessage}</p>
        )}
      </div>
    </>
  );
}
