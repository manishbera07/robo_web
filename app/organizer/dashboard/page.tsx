"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Edit2, Calendar, Package, Eye, EyeOff, LogOut } from "lucide-react"
import Link from "next/link"
import { getOrganizerSession, logoutOrganizer } from "@/lib/organizer-auth"

export default function OrganizerDashboard() {
  const { accentColor, secondaryColor } = useTheme()
  const router = useRouter()
  const [organizer, setOrganizer] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"events" | "merch">("events")
  const [events, setEvents] = useState<any[]>([])
  const [merch, setMerch] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false)
  const [showMerchModal, setShowMerchModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Form states for event
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    deadline: "",
  })

  // Form states for merch
  const [merchForm, setMerchForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
    stock: "",
  })

  // Check authentication and load data on mount
  useEffect(() => {
    const session = getOrganizerSession()
    if (!session || !session.isAuthenticated) {
      router.push("/auth/login?type=organizer")
      return
    }
    setOrganizer(session)

    // Load from localStorage
    const savedEvents = localStorage.getItem("organizer_events")
    const savedMerch = localStorage.getItem("organizer_merch")

    if (savedEvents) setEvents(JSON.parse(savedEvents))
    if (savedMerch) setMerch(JSON.parse(savedMerch))
  }, [router])

  // Save events to localStorage
  const saveEvents = (newEvents: any[]) => {
    setEvents(newEvents)
    localStorage.setItem("organizer_events", JSON.stringify(newEvents))
  }

  // Save merch to localStorage
  const saveMerch = (newMerch: any[]) => {
    setMerch(newMerch)
    localStorage.setItem("organizer_merch", JSON.stringify(newMerch))
  }

  // Add/Edit Event
  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.time) {
      alert("Please fill in required fields")
      return
    }

    if (editingItem) {
      const updated = events.map((e) => (e.id === editingItem.id ? { ...editingItem, ...eventForm } : e))
      saveEvents(updated)
    } else {
      const newEvent = {
        id: Date.now(),
        ...eventForm,
        dateTime: `${eventForm.date}T${eventForm.time}`,
        isPublished: false,
      }
      saveEvents([...events, newEvent])
    }

    resetEventForm()
    setShowEventModal(false)
  }

  // Add/Edit Merch
  const handleSaveMerch = async () => {
    if (!merchForm.name || !merchForm.price) {
      alert("Please fill in required fields")
      return
    }

    if (merchForm.image) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string

        if (editingItem) {
          const updated = merch.map((m) =>
            m.id === editingItem.id ? { ...editingItem, ...merchForm, image: base64 } : m,
          )
          saveMerch(updated)
        } else {
          const newItem = {
            id: Date.now(),
            ...merchForm,
            image: base64,
            isPublished: false,
          }
          saveMerch([...merch, newItem])
        }

        resetMerchForm()
        setShowMerchModal(false)
      }
      reader.readAsDataURL(merchForm.image)
    } else {
      if (editingItem) {
        const updated = merch.map((m) => (m.id === editingItem.id ? { ...editingItem, ...merchForm } : m))
        saveMerch(updated)
      } else {
        const newItem = {
          id: Date.now(),
          ...merchForm,
          isPublished: false,
        }
        saveMerch([...merch, newItem])
      }

      resetMerchForm()
      setShowMerchModal(false)
    }
  }

  // Delete Event
  const handleDeleteEvent = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      saveEvents(events.filter((e) => e.id !== id))
    }
  }

  // Delete Merch
  const handleDeleteMerch = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      saveMerch(merch.filter((m) => m.id !== id))
    }
  }

  // Toggle event visibility
  const toggleEventVisibility = (id: number) => {
    const updated = events.map((e) => (e.id === id ? { ...e, isPublished: !e.isPublished } : e))
    saveEvents(updated)
  }

  // Toggle merch visibility
  const toggleMerchVisibility = (id: number) => {
    const updated = merch.map((m) => (m.id === id ? { ...m, isPublished: !m.isPublished } : m))
    saveMerch(updated)
  }

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
      deadline: "",
    })
    setEditingItem(null)
  }

  const resetMerchForm = () => {
    setMerchForm({
      name: "",
      description: "",
      price: "",
      image: null,
      stock: "",
    })
    setEditingItem(null)
  }

  const openEventEditor = (event: any) => {
    setEditingItem(event)
    setEventForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      capacity: event.capacity || "",
      deadline: event.deadline || "",
    })
    setShowEventModal(true)
  }

  const openMerchEditor = (item: any) => {
    setEditingItem(item)
    setMerchForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      image: null,
      stock: item.stock || "",
    })
    setShowMerchModal(true)
  }

  const handleLogout = () => {
    logoutOrganizer()
    router.push("/")
  }

  if (!organizer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center opacity-50">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen" style={{ background: "var(--background)" }}>
      <div className="noise-overlay" />

      {/* Header */}
      <header className="glass border-b sticky top-0 z-40" style={{ borderColor: `${accentColor}20` }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.button
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: accentColor }}>
                Command Center
              </h1>
              <p className="text-xs opacity-50 uppercase tracking-wider">{organizer.full_name}</p>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: "rgba(255,68,68,0.1)", color: "#ff4444" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <motion.button
            onClick={() => setActiveTab("events")}
            className="px-6 py-3 rounded-xl text-sm uppercase tracking-wider font-bold transition-all flex items-center gap-2"
            style={{
              background: activeTab === "events" ? `${accentColor}` : `${accentColor}15`,
              color: activeTab === "events" ? "#030303" : accentColor,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar size={18} />
            Events
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("merch")}
            className="px-6 py-3 rounded-xl text-sm uppercase tracking-wider font-bold transition-all flex items-center gap-2"
            style={{
              background: activeTab === "merch" ? `${secondaryColor}` : `${secondaryColor}15`,
              color: activeTab === "merch" ? "#030303" : secondaryColor,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Package size={18} />
            Merchandise
          </motion.button>
        </div>

        {/* Add Button */}
        <motion.button
          onClick={() => {
            if (activeTab === "events") {
              resetEventForm()
              setShowEventModal(true)
            } else {
              resetMerchForm()
              setShowMerchModal(true)
            }
          }}
          className="mb-8 px-6 py-3 rounded-xl text-sm uppercase tracking-wider font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
            color: "#030303",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Add {activeTab === "events" ? "Event" : "Item"}
        </motion.button>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="grid gap-4">
            {events.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                <p className="opacity-50">No events created yet. Start by adding your first event!</p>
              </div>
            ) : (
              events.map((event) => (
                <motion.div
                  key={event.id}
                  className="glass rounded-2xl p-6 flex items-start justify-between hover:bg-white/5 transition-colors"
                  style={{ borderLeft: `4px solid ${accentColor}` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      {event.isPublished && (
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: `${accentColor}20`, color: accentColor }}
                        >
                          Published
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm opacity-70">
                      <p>
                        📅 {event.date} at {event.time}
                      </p>
                      <p>📍 {event.location || "No location specified"}</p>
                      <p>⏰ Deadline: {event.deadline || "No deadline set"}</p>
                      <p>👥 Capacity: {event.capacity || "Unlimited"}</p>
                      {event.description && <p>📝 {event.description}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => toggleEventVisibility(event.id)}
                      className="p-2 rounded-lg hover:bg-white/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={event.isPublished ? "Hide event" : "Publish event"}
                    >
                      {event.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                    </motion.button>
                    <motion.button
                      onClick={() => openEventEditor(event)}
                      className="p-2 rounded-lg hover:bg-white/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Merch Tab */}
        {activeTab === "merch" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {merch.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center md:col-span-2">
                <Package size={48} className="mx-auto mb-4 opacity-30" />
                <p className="opacity-50">No merchandise items yet. Add your first item!</p>
              </div>
            ) : (
              merch.map((item) => (
                <motion.div
                  key={item.id}
                  className="glass rounded-2xl overflow-hidden hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {item.image && (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      {item.isPublished && (
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: `${secondaryColor}20`, color: secondaryColor }}
                        >
                          Published
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-70 mb-4">{item.description}</p>
                    <div className="space-y-2 text-sm mb-4">
                      <p>💰 Price: ₹{item.price}</p>
                      <p>📦 Stock: {item.stock} units</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => toggleMerchVisibility(item.id)}
                        className="flex-1 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title={item.isPublished ? "Hide item" : "Publish item"}
                      >
                        {item.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                      </motion.button>
                      <motion.button
                        onClick={() => openMerchEditor(item)}
                        className="flex-1 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteMerch(item.id)}
                        className="flex-1 py-2 rounded-lg hover:bg-red-500/10 text-red-500 text-sm flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowEventModal(false)}
        >
          <motion.div
            className="glass rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: accentColor }}>
              {editingItem ? "Edit Event" : "Create Event"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Title *"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${accentColor}20` }}
              />
              <textarea
                placeholder="Event Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none resize-none"
                style={{ border: `1px solid ${accentColor}20` }}
                rows={3}
              />
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${accentColor}20` }}
              />
              <input
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${accentColor}20` }}
              />
              <input
                type="text"
                placeholder="Location"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${accentColor}20` }}
              />
              <input
                type="number"
                placeholder="Capacity (leave empty for unlimited)"
                value={eventForm.capacity}
                onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${accentColor}20` }}
              />
              <input
                type="date"
                placeholder="Registration Deadline"
                value={eventForm.deadline}
                onChange={(e) => setEventForm({ ...eventForm, deadline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${accentColor}20` }}
              />
            </div>

            <div className="flex gap-3 mt-8">
              <motion.button
                onClick={() => setShowEventModal(false)}
                className="flex-1 py-3 rounded-xl text-sm uppercase tracking-wider font-bold opacity-50 hover:opacity-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSaveEvent}
                className="flex-1 py-3 rounded-xl text-sm uppercase tracking-wider font-bold"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                  color: "#030303",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {editingItem ? "Update" : "Create"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Merch Modal */}
      {showMerchModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowMerchModal(false)}
        >
          <motion.div
            className="glass rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: secondaryColor }}>
              {editingItem ? "Edit Item" : "Add Item"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Item Name *"
                value={merchForm.name}
                onChange={(e) => setMerchForm({ ...merchForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${secondaryColor}20` }}
              />
              <textarea
                placeholder="Item Description"
                value={merchForm.description}
                onChange={(e) => setMerchForm({ ...merchForm, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none resize-none"
                style={{ border: `1px solid ${secondaryColor}20` }}
                rows={3}
              />
              <input
                type="number"
                placeholder="Price (₹) *"
                value={merchForm.price}
                onChange={(e) => setMerchForm({ ...merchForm, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${secondaryColor}20` }}
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={merchForm.stock}
                onChange={(e) => setMerchForm({ ...merchForm, stock: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${secondaryColor}20` }}
              />
              <label className="block">
                <span className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Product Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMerchForm({ ...merchForm, image: e.target.files?.[0] || null })}
                  className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${secondaryColor}20` }}
                />
              </label>
              {merchForm.image && <p className="text-xs opacity-70">✓ {merchForm.image.name}</p>}
            </div>

            <div className="flex gap-3 mt-8">
              <motion.button
                onClick={() => setShowMerchModal(false)}
                className="flex-1 py-3 rounded-xl text-sm uppercase tracking-wider font-bold opacity-50 hover:opacity-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSaveMerch}
                className="flex-1 py-3 rounded-xl text-sm uppercase tracking-wider font-bold"
                style={{
                  background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
                  color: "#030303",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {editingItem ? "Update" : "Add"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
