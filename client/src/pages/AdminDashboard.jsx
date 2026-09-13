import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Utensils,
  Layers,
  Settings,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  Sparkles,
  Flame,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';
import { VegIndicator } from '../components/ui/Badge';

export const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'items' | 'categories' | 'settings' | 'orders'

  // Data States
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals States
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isPopular: false,
    isTodaysSpecial: false,
    isAvailable: true,
    spiceLevel: 'NONE',
    isVeg: true,
    preparationTime: '15 min',
    calories: 350,
  });

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catFormData, setCatFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'item' | 'category', id, name }

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      showToast('Admin privilege required to access this portal.', 'error');
      navigate('/login?redirect=admin');
    }
  }, [user, isAdmin, authLoading, navigate, showToast]);

  // Load All Admin Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [items, cats, ords, sets] = await Promise.all([
        api.getFoodItems(),
        api.getCategories(),
        api.getAllOrders(),
        api.getSettings(),
      ]);
      setFoodItems(items);
      setCategories(cats);
      setOrders(ords);
      setSiteSettings(sets);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('Failed to load admin data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // --- Food Item Handlers ---
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemFormData({
      name: '',
      description: '',
      price: '',
      category: categories[0]?._id || '',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
      isPopular: false,
      isTodaysSpecial: false,
      isAvailable: true,
      spiceLevel: 'NONE',
      isVeg: true,
      preparationTime: '15-20 min',
      calories: 400,
    });
    setItemModalOpen(true);
  };

  const handleOpenEditItem = (item) => {
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category?._id || item.category,
      imageUrl: item.imageUrl,
      isPopular: item.isPopular,
      isTodaysSpecial: item.isTodaysSpecial,
      isAvailable: item.isAvailable,
      spiceLevel: item.spiceLevel || 'NONE',
      isVeg: item.isVeg,
      preparationTime: item.preparationTime || '15 min',
      calories: item.calories || 0,
    });
    setItemModalOpen(true);
  };

  const handleItemImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadImage(file, 'food-court-dishes');
      setItemFormData((prev) => ({ ...prev, imageUrl: res.url }));
      showToast('Image uploaded to Cloudinary successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Cloudinary upload failed.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateFoodItem(editingItem._id, itemFormData);
        showToast(`"${itemFormData.name}" updated successfully.`, 'success');
      } else {
        await api.createFoodItem(itemFormData);
        showToast(`"${itemFormData.name}" added to menu.`, 'success');
      }
      setItemModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save food item.', 'error');
    }
  };

  const handleToggleItemField = async (id, field) => {
    try {
      await api.toggleFoodStatus(id, field);
      setFoodItems((prev) =>
        prev.map((i) => (i._id === id ? { ...i, [field]: !i[field] } : i))
      );
      showToast(`Item status updated.`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to toggle status.', 'error');
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteConfirm || deleteConfirm.type !== 'item') return;
    try {
      await api.deleteFoodItem(deleteConfirm.id);
      showToast(`Dish deleted.`, 'info');
      setDeleteConfirm(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete dish.', 'error');
    }
  };

  // --- Category Handlers ---
  const handleOpenAddCat = () => {
    setEditingCategory(null);
    setCatFormData({
      name: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop',
      displayOrder: categories.length + 1,
    });
    setCatModalOpen(true);
  };

  const handleOpenEditCat = (cat) => {
    setEditingCategory(cat);
    setCatFormData({
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      displayOrder: cat.displayOrder || 0,
    });
    setCatModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory._id, catFormData);
        showToast(`Category "${catFormData.name}" updated.`, 'success');
      } else {
        await api.createCategory(catFormData);
        showToast(`Category "${catFormData.name}" created.`, 'success');
      }
      setCatModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save category.', 'error');
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteConfirm || deleteConfirm.type !== 'category') return;
    try {
      await api.deleteCategory(deleteConfirm.id);
      showToast('Category deleted.', 'info');
      setDeleteConfirm(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete category.', 'error');
    }
  };

  // --- Site Settings Handlers ---
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const res = await api.uploadImage(file, 'food-court-brand');
      const updated = await api.updateSettings({ logoUrl: res.url });
      setSiteSettings(updated);
      showToast('Brand logo uploaded and updated!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to upload logo.', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAddHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingHero(true);
      const res = await api.uploadImage(file, 'food-court-hero');
      const newHeroes = [...(siteSettings.heroImages || []), res.url];
      const updated = await api.updateSettings({ heroImages: newHeroes });
      setSiteSettings(updated);
      showToast('Hero slide image added!', 'success');
    } catch (err) {
      showToast(err.message || 'Hero upload failed.', 'error');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleRemoveHeroImage = async (indexToRemove) => {
    try {
      const newHeroes = siteSettings.heroImages.filter((_, idx) => idx !== indexToRemove);
      const updated = await api.updateSettings({ heroImages: newHeroes });
      setSiteSettings(updated);
      showToast('Hero image removed.', 'info');
    } catch (err) {
      showToast('Failed to update hero images.', 'error');
    }
  };

  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings(siteSettings);
      setSiteSettings(updated);
      showToast('Restaurant details updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save settings.', 'error');
    }
  };

  // --- Order Status Handler ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Order status updated to ${newStatus}.`, 'success');
    } catch (err) {
      showToast('Failed to update order status.', 'error');
    }
  };

  if (authLoading || (!user && !isAdmin)) {
    return <div className="p-12 text-center text-warm-gray">Verifying credentials...</div>;
  }

  const specialsCount = foodItems.filter((i) => i.isTodaysSpecial).length;
  const popularCount = foodItems.filter((i) => i.isPopular).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-base pb-24 text-left">
      {/* Top Header */}
      <div className="bg-charcoal text-white border-b border-charcoal/80 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold border border-gold/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-medium tracking-tight">
                {siteSettings?.siteName || 'Food Court'} — Management Portal
              </h1>
              <span className="text-[11px] text-stone-300 font-light block">
                Logged in as: {user?.email} (Administrator)
              </span>
            </div>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors"
          >
            <span>Preview Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-soft-border mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'items', label: `Food Items (${foodItems.length})`, icon: Utensils },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'settings', label: 'Site Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-charcoal text-white shadow-sm font-semibold'
                    : 'bg-surface text-charcoal border border-soft-border hover:border-terracotta/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-warm-gray'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-surface border border-soft-border shadow-subtle space-y-2">
                <span className="text-xs uppercase tracking-wider text-warm-gray font-medium">Total Menu Items</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-charcoal">{foodItems.length}</span>
                  <span className="text-xs text-olive font-medium">{specialsCount} Chef's Specials</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-soft-border shadow-subtle space-y-2">
                <span className="text-xs uppercase tracking-wider text-warm-gray font-medium">Menu Categories</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-charcoal">{categories.length}</span>
                  <span className="text-xs text-warm-gray font-medium">Active Courses</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-soft-border shadow-subtle space-y-2">
                <span className="text-xs uppercase tracking-wider text-warm-gray font-medium">Customer Orders</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-charcoal">{orders.length}</span>
                  <span className="text-xs text-terracotta font-medium">{popularCount} Popular Items</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-soft-border shadow-subtle space-y-2">
                <span className="text-xs uppercase tracking-wider text-warm-gray font-medium">Revenue Snapshot</span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-terracotta">${totalRevenue.toFixed(2)}</span>
                  <span className="text-xs text-olive font-semibold">Live Mongo Data</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-soft-border shadow-subtle space-y-4">
              <h2 className="font-serif text-xl font-medium text-charcoal">Quick Operations</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleOpenAddItem}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
                <button
                  onClick={handleOpenAddCat}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-soft-border bg-base hover:border-terracotta text-xs font-semibold tracking-wider uppercase text-charcoal transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-soft-border bg-base hover:border-gold text-xs font-semibold tracking-wider uppercase text-charcoal transition-all shadow-sm"
                >
                  <Settings className="w-4 h-4 text-gold" />
                  <span>Edit Site Brand & Hero</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FOOD ITEMS CRUD */}
        {activeTab === 'items' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-medium text-charcoal">Manage Dishes</h2>
                <p className="text-xs text-warm-gray mt-0.5">
                  Update pricing, toggle specials, or add new dishes with Cloudinary imagery.
                </p>
              </div>

              <button
                onClick={handleOpenAddItem}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish</span>
              </button>
            </div>

            {/* Food Items Table */}
            <div className="bg-surface rounded-2xl border border-soft-border overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-base border-b border-soft-border text-warm-gray uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Dish</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4 text-center">Chef's Special</th>
                      <th className="py-3.5 px-4 text-center">Popular</th>
                      <th className="py-3.5 px-4 text-center">Available</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-border/70 text-charcoal">
                    {foodItems.map((dish) => (
                      <tr key={dish._id} className="hover:bg-base/40 transition-colors">
                        {/* Dish & Image */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-12 h-12 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <VegIndicator isVeg={dish.isVeg} />
                                <span className="font-serif text-sm font-medium text-charcoal">
                                  {dish.name}
                                </span>
                              </div>
                              <p className="text-[11px] text-warm-gray line-clamp-1 max-w-xs font-light">
                                {dish.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 text-warm-gray">
                          {dish.category?.name || 'Unassigned'}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-serif font-bold text-terracotta text-sm">
                          ${dish.price.toFixed(2)}
                        </td>

                        {/* Special Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleItemField(dish._id, 'isTodaysSpecial')}
                            className={`p-1.5 rounded-full border transition-all ${
                              dish.isTodaysSpecial
                                ? 'bg-gold/20 text-gold border-gold'
                                : 'bg-base text-warm-gray/40 border-soft-border hover:border-warm-gray'
                            }`}
                            title="Toggle Today's Special"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </td>

                        {/* Popular Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleItemField(dish._id, 'isPopular')}
                            className={`p-1.5 rounded-full border transition-all ${
                              dish.isPopular
                                ? 'bg-terracotta/20 text-terracotta border-terracotta'
                                : 'bg-base text-warm-gray/40 border-soft-border hover:border-warm-gray'
                            }`}
                            title="Toggle Most Popular"
                          >
                            ★
                          </button>
                        </td>

                        {/* Available Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleItemField(dish._id, 'isAvailable')}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border transition-all ${
                              dish.isAvailable
                                ? 'bg-olive/15 text-olive border-olive/30'
                                : 'bg-stone-200 text-stone-500 border-stone-300'
                            }`}
                          >
                            {dish.isAvailable ? 'In Stock' : 'Out'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditItem(dish)}
                              className="p-1.5 rounded-lg border border-soft-border text-warm-gray hover:text-charcoal hover:border-charcoal transition-colors"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'item', id: dish._id, name: dish.name })}
                              className="p-1.5 rounded-lg border border-soft-border text-warm-gray hover:text-red-700 hover:border-red-300 transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES CRUD */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-charcoal">Menu Categories</h2>
                <p className="text-xs text-warm-gray mt-0.5">
                  Organize culinary courses, add cover photos, and define display order.
                </p>
              </div>

              <button
                onClick={handleOpenAddCat}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-surface rounded-xl border border-soft-border overflow-hidden shadow-subtle p-5 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={cat.imageUrl || 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=300&auto=format&fit=crop'}
                      alt={cat.name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] text-gold font-bold uppercase tracking-wider">
                        Order #{cat.displayOrder || 0}
                      </span>
                      <h3 className="font-serif text-lg font-medium text-charcoal">{cat.name}</h3>
                      <p className="text-xs text-warm-gray line-clamp-2 mt-1 font-light">
                        {cat.description || 'No description set.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-soft-border flex items-center justify-between">
                    <span className="text-xs text-warm-gray">Slug: /{cat.slug}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCat(cat)}
                        className="p-1.5 rounded-lg border border-soft-border text-warm-gray hover:text-charcoal transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'category', id: cat._id, name: cat.name })}
                        className="p-1.5 rounded-lg border border-soft-border text-warm-gray hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="font-serif text-2xl font-medium text-charcoal">Orders Management</h2>

            <div className="bg-surface rounded-2xl border border-soft-border overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-base border-b border-soft-border text-warm-gray uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Recipient</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Address & Phone</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-border/70 text-charcoal">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-base/40">
                        <td className="py-3.5 px-4 font-mono font-bold">
                          #{ord._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3.5 px-4 font-medium">
                          {ord.customerName || ord.user?.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5 max-w-xs">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="truncate">
                                {it.quantity} × {it.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-warm-gray">
                          <div>{ord.deliveryAddress}</div>
                          <div className="text-[11px] text-charcoal">{ord.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-terracotta">
                          ${ord.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="text-xs font-semibold py-1 px-2 rounded-lg border border-soft-border bg-base text-charcoal focus:border-terracotta"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SITE SETTINGS & BRAND */}
        {activeTab === 'settings' && siteSettings && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="font-serif text-2xl font-medium text-charcoal">Site Brand & Settings</h2>
              <p className="text-xs text-warm-gray mt-0.5">
                Customize site name, Cloudinary logo, and landing page hero carousel images.
              </p>
            </div>

            {/* Cloudinary Logo & Wordmark Section */}
            <div className="bg-surface rounded-2xl border border-soft-border p-6 sm:p-8 shadow-subtle space-y-6">
              <h3 className="font-serif text-lg font-medium text-charcoal">Brand Logo & Wordmark</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-36 h-20 rounded-xl bg-base border border-dashed border-soft-border flex items-center justify-center p-2 text-center">
                  {siteSettings.logoUrl ? (
                    <img src={siteSettings.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-serif text-xl text-charcoal">{siteSettings.siteName}</span>
                  )}
                </div>

                <div className="space-y-2 text-left">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingLogo ? 'Uploading to Cloudinary...' : 'Upload Brand Logo'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <p className="text-xs text-warm-gray">
                    Uploaded directly to your Cloudinary cloud (<code className="text-terracotta font-mono">dojrorkrb</code>). Falls back to text if empty.
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Carousel Manager */}
            <div className="bg-surface rounded-2xl border border-soft-border p-6 sm:p-8 shadow-subtle space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-charcoal">Landing Hero Carousel Photos</h3>
                  <p className="text-xs text-warm-gray mt-0.5">
                    Images displayed in the dynamic 5s rotating landing header.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal hover:bg-charcoal/90 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm cursor-pointer">
                  <Plus className="w-3.5 h-3.5 text-gold" />
                  <span>{uploadingHero ? 'Uploading...' : 'Add Hero Slide'}</span>
                  <input type="file" accept="image/*" onChange={handleAddHeroImageUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {(siteSettings.heroImages || []).map((img, idx) => (
                  <div key={idx} className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-soft-border bg-stone-100">
                    <img src={img} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveHeroImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-700/80 hover:bg-red-700 text-white flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
                      title="Remove hero image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                      Slide #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* General Info Form */}
            <div className="bg-surface rounded-2xl border border-soft-border p-6 sm:p-8 shadow-subtle">
              <h3 className="font-serif text-lg font-medium text-charcoal mb-4">Restaurant Information</h3>
              <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">Site Title</label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={siteSettings.contactPhone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Editorial Tagline</label>
                  <input
                    type="text"
                    value={siteSettings.tagline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Subheadline</label>
                  <textarea
                    rows={2}
                    value={siteSettings.subheadline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, subheadline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={siteSettings.contactAddress}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactAddress: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={siteSettings.openingHours}
                      onChange={(e) => setSiteSettings({ ...siteSettings, openingHours: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-soft-border bg-base/40 text-sm text-charcoal focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
                >
                  Save Restaurant Information
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT DISH MODAL --- */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setItemModalOpen(false)} />
          <div className="relative bg-surface rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-elevated border border-soft-border z-10 animate-scale-in my-8 text-left">
            <button
              onClick={() => setItemModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-warm-gray hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-medium text-charcoal mb-4">
              {editingItem ? `Edit: ${editingItem.name}` : 'Add New Culinary Dish'}
            </h2>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={itemFormData.name}
                    onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={itemFormData.price}
                    onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Category</label>
                <select
                  required
                  value={itemFormData.category}
                  onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white resize-none"
                />
              </div>

              {/* Image Input & Cloudinary Upload */}
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Dish Photography</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={itemFormData.imageUrl}
                    onChange={(e) => setItemFormData({ ...itemFormData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white font-mono text-xs"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-charcoal text-white text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-charcoal/90 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-gold" />
                    <span>{uploadingImage ? 'Uploading...' : 'Cloudinary'}</span>
                    <input type="file" accept="image/*" onChange={handleItemImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Badges & Dietary Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2 rounded-lg border border-soft-border bg-base/30 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemFormData.isTodaysSpecial}
                    onChange={(e) => setItemFormData({ ...itemFormData, isTodaysSpecial: e.target.checked })}
                    className="rounded text-gold focus:ring-gold"
                  />
                  <span>Today's Special</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-soft-border bg-base/30 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemFormData.isPopular}
                    onChange={(e) => setItemFormData({ ...itemFormData, isPopular: e.target.checked })}
                    className="rounded text-terracotta focus:ring-terracotta"
                  />
                  <span>Most Popular</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-soft-border bg-base/30 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemFormData.isVeg}
                    onChange={(e) => setItemFormData({ ...itemFormData, isVeg: e.target.checked })}
                    className="rounded text-olive focus:ring-olive"
                  />
                  <span>Vegetarian</span>
                </label>

                <div>
                  <select
                    value={itemFormData.spiceLevel}
                    onChange={(e) => setItemFormData({ ...itemFormData, spiceLevel: e.target.value })}
                    className="w-full p-2 rounded-lg border border-soft-border bg-base/30 text-xs font-medium"
                  >
                    <option value="NONE">No Spice</option>
                    <option value="MILD">Mild Spice</option>
                    <option value="MEDIUM">Medium Spice</option>
                    <option value="HOT">Hot & Spicy</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-soft-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-soft-border text-xs font-medium hover:bg-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase shadow-sm"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT CATEGORY MODAL --- */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setCatModalOpen(false)} />
          <div className="relative bg-surface rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-elevated border border-soft-border z-10 animate-scale-in text-left">
            <button
              onClick={() => setCatModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-warm-gray hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-medium text-charcoal mb-4">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catFormData.name}
                  onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                  placeholder="e.g. Woodfired Pizzas"
                  className="w-full px-3 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Image URL</label>
                <input
                  type="url"
                  value={catFormData.imageUrl}
                  onChange={(e) => setCatFormData({ ...catFormData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Display Order</label>
                <input
                  type="number"
                  value={catFormData.displayOrder}
                  onChange={(e) => setCatFormData({ ...catFormData, displayOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-soft-border text-sm text-charcoal bg-base/40 focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-soft-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-soft-border text-xs font-medium hover:bg-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-surface rounded-2xl max-w-sm w-full p-6 shadow-elevated border border-soft-border z-10 animate-scale-in text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-charcoal">Are you sure?</h3>
            <p className="text-xs text-warm-gray leading-relaxed">
              Do you really want to delete <strong className="text-charcoal">"{deleteConfirm.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-soft-border text-xs font-medium hover:bg-base"
              >
                Cancel
              </button>
              <button
                onClick={deleteConfirm.type === 'item' ? handleDeleteItem : handleDeleteCategory}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-semibold tracking-wider uppercase shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
