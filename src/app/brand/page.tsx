'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
    Plus,
    Palette,
    Image as ImageIcon,
    Type,
    Copy,
    Download,
    X,
    MoreHorizontal,
    Shapes,
    Check,
    Search,
    Upload,
    Trash2,
    Eye,
    Edit3,
    Pin,
    ExternalLink,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HexColorPicker } from 'react-colorful'

interface Asset {
    id: string
    name: string
    type: 'Logo' | 'Icon' | 'Color' | 'Font'
    value: string // hex for color, base64 for image, family for font
    pinned?: boolean
}

const COMMON_FONTS = [
    "Inter", "Roboto", "Open Sans", "Montserrat", "Playfair Display",
    "Lato", "Poppins", "Oswald", "Raleway", "Merriweather",
    "Nunito", "Ubuntu", "Lora", "Source Sans 3", "Quicksand",
    "Work Sans", "Fira Sans", "Rubik", "Karla", "PT Serif",
    "Noto Sans", "Crimson Text", "Barlow", "Libre Baskerville", "Mukta",
    "Dosis", "Teko", "Josefin Sans", "Bebas Neue", "Cinzel",
    "Dancing Script", "Pacifico", "Righteous", "Lobster", "Caveat",
    "Comfortaa", "Inconsolata", "Roboto Mono", "Space Grotesk", "Syne"
]

const FONT_LIBRARY = [
    ...COMMON_FONTS,
    "Abel", "Anton", "Arimo", "Assistant", "Bitter", "Cabin", "Cairo", "Catamaran", "Domine",
    "Exo 2", "Heebo", "Hind", "IBM Plex Sans", "Jost", "Kanit", "Mada", "Manrope", "Nanum Gothic",
    "Outfit", "Oxanium", "Oxygen", "Pathway Gothic One", "PT Sans", "Questrial", "Saira",
    "Signika", "Slabo 27px", "Spectral", "Titillium Web", "Varela Round", "Zilla Slab"
].sort()

export default function BrandHubPage() {
    const [assets, setAssets] = useState<Asset[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'Color' | 'Font' | 'Asset'>('Color')

    // Form states
    const [newName, setNewName] = useState('')
    const [newColor, setNewColor] = useState('#ffffff')
    const [selectedFont, setSelectedFont] = useState('Inter')
    const [fontSearch, setFontSearch] = useState('')
    const [uploadedAsset, setUploadedAsset] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('lifepath_brand')
        if (saved) {
            setAssets(JSON.parse(saved))
        } else {
            const defaults: Asset[] = [
                { id: '1', name: 'Primary Black', type: 'Color', value: '#050505', pinned: true },
                { id: '2', name: 'Accent Gold', type: 'Color', value: '#EAB308', pinned: true },
                { id: '3', name: 'Brand Serif', type: 'Font', value: 'Playfair Display' },
                { id: '4', name: 'Brand Sans', type: 'Font', value: 'Inter' },
                { id: '5', name: 'Identity Logo', type: 'Logo', value: 'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=300&h=300&fit=crop' },
            ]
            setAssets(defaults)
            localStorage.setItem('lifepath_brand', JSON.stringify(defaults))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifepath_brand', JSON.stringify(assets))
        }
    }, [assets, isLoaded])

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleAdd = (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        let value = ''
        let type: Asset['type'] = 'Color'

        if (activeTab === 'Color') {
            value = newColor
            type = 'Color'
        } else if (activeTab === 'Font') {
            value = selectedFont
            type = 'Font'
        } else if (activeTab === 'Asset') {
            if (!uploadedAsset) return
            value = uploadedAsset
            type = 'Logo'
        }

        const newEntry: Asset = {
            id: Date.now().toString(),
            name: newName || (activeTab === 'Font' ? selectedFont : activeTab === 'Color' ? 'New Color' : 'New Asset'),
            type,
            value,
            pinned: false
        }

        setAssets([newEntry, ...assets])
        closeModal()
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedAsset) return

        const updatedAssets = assets.map(a =>
            a.id === selectedAsset.id ? { ...selectedAsset, name: newName } : a
        )
        setAssets(updatedAssets)
        setIsEditModalOpen(false)
        setSelectedAsset(null)
        setNewName('')
    }

    const closeModal = () => {
        setIsAddModalOpen(false)
        setNewName('')
        setUploadedAsset(null)
    }

    const togglePin = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setAssets(assets.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a))
    }

    const deleteAsset = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setAssets(assets.filter(a => a.id !== id))
        if (selectedAsset?.id === id) {
            setIsViewModalOpen(false)
            setIsEditModalOpen(false)
            setSelectedAsset(null)
        }
    }

    const handleFileUpload = (file: File) => {
        if (!file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = (e) => {
            setUploadedAsset(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const openView = (asset: Asset) => {
        setSelectedAsset(asset)
        setIsViewModalOpen(true)
    }

    const openEdit = (asset: Asset, e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedAsset(asset)
        setNewName(asset.name)
        setIsEditModalOpen(true)
    }

    const filteredFonts = FONT_LIBRARY.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()))
    const pinnedAssets = assets.filter(a => a.pinned)

    return (
        <div className="layout-wrapper">
            <Sidebar />

            {/* Dynamic Font Loader */}
            <link
                href={`https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g, '+')}&display=swap`}
                rel="stylesheet"
            />
            {assets.filter(a => a.type === 'Font').map(f => (
                <link
                    key={f.id}
                    href={`https://fonts.googleapis.com/css2?family=${f.value.replace(/ /g, '+')}&display=swap`}
                    rel="stylesheet"
                />
            ))}

            <main className="projects-main">
                <header className="projects-header">
                    <div className="projects-title-group">
                        <h1 className="font-serif">Brand Lab</h1>
                        <p>Maintain the visual integrity of your empire.</p>
                    </div>

                    <div className="projects-top-actions">
                        <button
                            className="submit-task-btn"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Add Asset</span>
                        </button>
                    </div>
                </header>

                <div className="brand-sections" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '5rem' }}>

                    {/* Pinned Section */}
                    {pinnedAssets.length > 0 && (
                        <section>
                            <h2 className="font-serif section-title">
                                <Pin size={20} className="text-zinc-500" /> Essential Assets
                            </h2>
                            <div className="asset-grid">
                                {pinnedAssets.map(asset => (
                                    <AssetCard
                                        key={asset.id}
                                        asset={asset}
                                        onCopy={copyToClipboard}
                                        copiedId={copiedId}
                                        onDelete={deleteAsset}
                                        onPin={togglePin}
                                        onView={openView}
                                        onEdit={openEdit}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Colors Section */}
                    <section>
                        <h2 className="font-serif section-title">
                            <Palette size={20} className="text-zinc-500" /> Color Systems
                        </h2>
                        <div className="asset-grid">
                            {assets.filter(a => a.type === 'Color' && !a.pinned).map(asset => (
                                <AssetCard
                                    key={asset.id}
                                    asset={asset}
                                    onCopy={copyToClipboard}
                                    copiedId={copiedId}
                                    onDelete={deleteAsset}
                                    onPin={togglePin}
                                    onView={openView}
                                    onEdit={openEdit}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Typography Section */}
                    <section>
                        <h2 className="font-serif section-title">
                            <Type size={20} className="text-zinc-500" /> Typography
                        </h2>
                        <div className="font-grid">
                            {assets.filter(a => a.type === 'Font' && !a.pinned).map(asset => (
                                <motion.div
                                    layout
                                    key={asset.id}
                                    className="project-card group relative"
                                    style={{ padding: '1.5rem' }}
                                    onClick={() => openView(asset)}
                                >
                                    <div className="asset-hover-overlay">
                                        <button onClick={(e) => togglePin(asset.id, e)} className={asset.pinned ? "pin-btn active" : "pin-btn"}>
                                            <Pin size={16} fill={asset.pinned ? "white" : "none"} />
                                        </button>
                                        <div className="flex gap-2">
                                            <button onClick={(e) => openEdit(asset, e)} className="overlay-icon-btn">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={(e) => deleteAsset(asset.id, e)} className="overlay-icon-btn delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="font-header">
                                        <div className="asset-name">{asset.name}</div>
                                    </div>
                                    <div className="font-sample" style={{ fontFamily: asset.value }}>
                                        The quick brown fox jumps over the lazy dog.
                                    </div>
                                    <div className="font-meta">
                                        Family: {asset.value}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Visual Assets Section */}
                    <section>
                        <h2 className="font-serif section-title">
                            <Shapes size={20} className="text-zinc-500" /> Visual Assets
                        </h2>
                        <div className="asset-grid">
                            {assets.filter(a => a.type === 'Logo' && !a.pinned).map(asset => (
                                <AssetCard
                                    key={asset.id}
                                    asset={asset}
                                    onCopy={copyToClipboard}
                                    copiedId={copiedId}
                                    onDelete={deleteAsset}
                                    onPin={togglePin}
                                    onView={openView}
                                    onEdit={openEdit}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                <AnimatePresence>
                    {/* Add Modal */}
                    {isAddModalOpen && (
                        <div className="modal-overlay" onClick={closeModal}>
                            <motion.div
                                className="premium-journal-modal brand-modal"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="premium-modal-header">
                                    <div className="leaf-icon-container">
                                        <Plus size={24} />
                                    </div>
                                    <div className="header-text">
                                        <h2>Add Brand Element</h2>
                                        <p>Expand your empire's visual vocabulary.</p>
                                    </div>
                                    <button className="modal-close-x" onClick={closeModal}><X size={20} /></button>
                                </div>

                                <div className="brand-tabs">
                                    <button className={activeTab === 'Color' ? 'active' : ''} onClick={() => setActiveTab('Color')}>
                                        <Palette size={16} /> Color
                                    </button>
                                    <button className={activeTab === 'Font' ? 'active' : ''} onClick={() => setActiveTab('Font')}>
                                        <Type size={16} /> Font
                                    </button>
                                    <button className={activeTab === 'Asset' ? 'active' : ''} onClick={() => setActiveTab('Asset')}>
                                        <ImageIcon size={16} /> Image
                                    </button>
                                </div>

                                <form onSubmit={handleAdd} className="premium-modal-body">
                                    <div className="field-section">
                                        <label>ELEMENT NAME</label>
                                        <input
                                            className="premium-title-input"
                                            placeholder="e.g. Primary Background, Header Serif..."
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            autoFocus
                                        />
                                    </div>

                                    {activeTab === 'Color' && (
                                        <div className="color-picker-section">
                                            <div className="picker-container">
                                                <HexColorPicker color={newColor} onChange={setNewColor} />
                                            </div>
                                            <div className="current-color-info">
                                                <div className="color-swatch-large" style={{ background: newColor }} />
                                                <input className="premium-textarea" value={newColor} onChange={e => setNewColor(e.target.value)} style={{ minHeight: '44px', textAlign: 'center', fontSize: '1.2rem', fontFamily: 'monospace' }} />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'Font' && (
                                        <div className="font-picker-section">
                                            <div className="search-wrap">
                                                <Search size={14} className="search-icon" />
                                                <input placeholder="Search fonts..." value={fontSearch} onChange={e => setFontSearch(e.target.value)} />
                                            </div>
                                            <div className="font-list custom-scrollbar">
                                                {filteredFonts.map(font => (
                                                    <button key={font} type="button" className={selectedFont === font ? 'font-item active' : 'font-item'} onClick={() => setSelectedFont(font)} style={{ fontFamily: font }}>{font}</button>
                                                ))}
                                            </div>
                                            <div className="font-preview-card" style={{ fontFamily: selectedFont }}>Aa Bb Cc Dd 123</div>
                                        </div>
                                    )}

                                    {activeTab === 'Asset' && (
                                        <div className="dropzone-section">
                                            <div
                                                className={`dropzone ${isDragging ? 'dragging' : ''} ${uploadedAsset ? 'has-file' : ''}`}
                                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                                onDragLeave={() => setIsDragging(false)}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                    if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
                                                }}
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                            >
                                                {uploadedAsset ? <img src={uploadedAsset} alt="Preview" /> : (
                                                    <>
                                                        <Upload size={32} className="text-zinc-600 mb-2" />
                                                        <p>Drop identity asset here</p>
                                                        <span>or click to browse</span>
                                                    </>
                                                )}
                                                <input id="file-upload" type="file" hidden onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="premium-modal-footer">
                                        <button type="button" className="modal-cancel-btn" onClick={closeModal}>Cancel</button>
                                        <button type="submit" className="modal-save-btn" disabled={activeTab === 'Asset' && !uploadedAsset}>Save to Library</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {/* View Modal */}
                    {isViewModalOpen && selectedAsset && (
                        <div className="modal-overlay" onClick={() => setIsViewModalOpen(false)}>
                            <motion.div
                                className="view-asset-modal"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="view-modal-header">
                                    <div className="header-info">
                                        <h2>{selectedAsset.name}</h2>
                                        <p>{selectedAsset.type} Element</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => openEdit(selectedAsset, e)} className="icon-btn-ghost"><Edit3 size={18} /></button>
                                        <button onClick={() => setIsViewModalOpen(false)} className="icon-btn-ghost"><X size={18} /></button>
                                    </div>
                                </div>
                                <div className="view-modal-content">
                                    {selectedAsset.type === 'Color' && (
                                        <div className="view-color-display">
                                            <div className="view-color-swatch" style={{ background: selectedAsset.value }} />
                                            <div className="view-color-info" onClick={() => copyToClipboard(selectedAsset.value, selectedAsset.id)}>
                                                <span>HEX VALUE</span>
                                                <h3>{selectedAsset.value}</h3>
                                                <p>{copiedId === selectedAsset.id ? 'COPIED!' : 'CLICK TO COPY'}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedAsset.type === 'Font' && (
                                        <div className="view-font-display">
                                            <div className="view-font-preview" style={{ fontFamily: selectedAsset.value }}>
                                                The quick brown fox jumps over the lazy dog.
                                                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                                                abcdefghijklmnopqrstuvwxyz
                                                1234567890!@#$%^&*()
                                            </div>
                                            <div className="view-font-meta">
                                                <span>FAMILY</span>
                                                <h3>{selectedAsset.value}</h3>
                                            </div>
                                        </div>
                                    )}
                                    {selectedAsset.type === 'Logo' && (
                                        <div className="view-visual-display">
                                            <img src={selectedAsset.value} alt={selectedAsset.name} />
                                            <div className="view-visual-actions">
                                                <button className="download-btn-large">
                                                    <Download size={20} />
                                                    Download Original
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {isEditModalOpen && selectedAsset && (
                        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                            <motion.div
                                className="premium-journal-modal"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={e => e.stopPropagation()}
                                style={{ maxWidth: '400px' }}
                            >
                                <div className="premium-modal-header">
                                    <div className="leaf-icon-container"><Edit3 size={20} /></div>
                                    <div className="header-text">
                                        <h2>Edit Asset</h2>
                                        <p>Update identity details.</p>
                                    </div>
                                    <button className="modal-close-x" onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
                                </div>
                                <form onSubmit={handleUpdate} className="premium-modal-body">
                                    <div className="field-section">
                                        <label>ASSET NAME</label>
                                        <input
                                            className="premium-title-input"
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="premium-modal-footer">
                                        <button type="button" className="modal-cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="modal-save-btn">Update Asset</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            <style jsx global>{`
                .section-title {
                    font-size: 1.5rem;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: white;
                }

                .asset-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1.5rem;
                }

                .font-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }

                .asset-hover-overlay {
                    position: absolute;
                    inset: 0;
                    padding: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    opacity: 0;
                    background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(2px);
                    transition: all 0.2s;
                    z-index: 10;
                    border-radius: 12px;
                }

                .project-card:hover .asset-hover-overlay {
                    opacity: 1;
                }

                .pin-btn {
                    padding: 0.5rem;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.05);
                    color: white;
                    width: fit-content;
                }

                .pin-btn.active {
                    background: #eab308;
                    color: black;
                }

                .overlay-icon-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    background: rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .overlay-icon-btn.delete:hover {
                    background: #ef4444;
                }

                .color-preview {
                    width: 100%;
                    height: 120px;
                    border-radius: 10px;
                    margin-bottom: 0.75rem;
                    border: 1px solid rgba(255,255,255,0.05);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .asset-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 0.25rem;
                }

                .asset-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #e4e4e7;
                }

                .asset-value {
                    font-size: 0.75rem;
                    color: #71717a;
                    text-transform: uppercase;
                    font-family: monospace;
                }

                .font-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1.25rem;
                }

                .font-sample {
                    font-size: 1.75rem;
                    margin-bottom: 1.25rem;
                    line-height: 1.2;
                    color: white;
                }

                .font-meta {
                    font-size: 0.8rem;
                    color: #52525b;
                    letter-spacing: 0.05em;
                }

                .visual-preview {
                    width: 100%;
                    height: 180px;
                    background: rgba(255,255,255,0.02);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    position: relative;
                    overflow: hidden;
                }

                .visual-preview img {
                    max-width: 80%;
                    max-height: 80%;
                    object-fit: contain;
                }

                /* View Modal Styles */
                .view-asset-modal {
                    width: 90%;
                    max-width: 800px;
                    background: #090909;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 25px 100px -20px rgba(0,0,0,0.8);
                }

                .view-modal-header {
                    padding: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .header-info h2 { font-size: 2rem; }
                .header-info p { color: #52525b; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; }

                .view-modal-content { padding: 3rem; }

                .view-color-display { display: flex; gap: 4rem; align-items: center; }
                .view-color-swatch { width: 300px; height: 300px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                .view-color-info h3 { font-size: 3rem; font-family: monospace; margin: 0.5rem 0; }
                .view-color-info span { color: #52525b; font-size: 0.8rem; font-weight: 700; }

                .view-font-display { display: flex; flex-direction: column; gap: 3rem; }
                .view-font-preview { font-size: 3rem; line-height: 1.4; color: white; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 3rem; }
                .view-font-meta span { color: #52525b; font-size: 0.8rem; font-weight: 700; }
                .view-font-meta h3 { font-size: 2.5rem; margin-top: 0.5rem; }

                .view-visual-display { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
                .view-visual-display img { max-width: 100%; max-height: 500px; border-radius: 12px; }

                .download-btn-large {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem 2.5rem;
                    background: white;
                    color: black;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    transition: transform 0.2s;
                }

                .download-btn-large:hover { transform: scale(1.02); }

                /* Reuse Previous Styles */
                .brand-tabs { display: flex; padding: 0 1.5rem; gap: 0.5rem; margin-top: 1rem; }
                .brand-tabs button { flex: 1; padding: 0.75rem; border-radius: 10px; background: rgba(255,255,255,0.03); color: #71717a; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; border: 1px solid transparent; }
                .brand-tabs button.active { background: rgba(255,255,255,0.1); color: white; border-color: rgba(255,255,255,0.1); }
                .color-picker-section { display: flex; gap: 2rem; align-items: center; margin: 1rem 0; }
                .picker-container .react-colorful { width: 240px; height: 240px; }
                .font-picker-section { display: flex; flex-direction: column; gap: 1rem; }
                .font-list { height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; padding-right: 0.5rem; }
                .dropzone { width: 100%; height: 240px; border: 2px dashed rgba(255,255,255,0.05); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #52525b; transition: all 0.2s; cursor: pointer; }
                .dropzone:hover, .dropzone.dragging { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.02); color: white; }
                .dropzone img { max-width: 90%; max-height: 90%; object-fit: contain; }
                .icon-btn-ghost { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #52525b; transition: all 0.2s; }
                .icon-btn-ghost:hover { background: rgba(255,255,255,0.05); color: white; }
            `}</style>
        </div>
    )
}

function AssetCard({ asset, onCopy, copiedId, onDelete, onPin, onView, onEdit }: {
    asset: Asset,
    onCopy: any,
    copiedId: string | null,
    onDelete: any,
    onPin: any,
    onView: any,
    onEdit: any
}) {
    return (
        <motion.div
            layout
            className="project-card group relative cursor-pointer"
            style={{ padding: '0.75rem' }}
            onClick={() => onView(asset)}
        >
            <div className="asset-hover-overlay">
                <button onClick={(e) => onPin(asset.id, e)} className={asset.pinned ? "pin-btn active" : "pin-btn"}>
                    <Pin size={16} fill={asset.pinned ? "white" : "none"} />
                </button>
                <div className="flex gap-2">
                    <button onClick={(e) => onEdit(asset, e)} className="overlay-icon-btn">
                        <Edit3 size={16} />
                    </button>
                    <button onClick={(e) => onDelete(asset.id, e)} className="overlay-icon-btn delete">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {asset.type === 'Color' && (
                <div
                    className="color-preview"
                    style={{ background: asset.value }}
                />
            )}

            {asset.type === 'Logo' && (
                <div className="visual-preview">
                    <img src={asset.value} alt={asset.name} />
                </div>
            )}

            <div className="asset-info">
                <div>
                    <div className="asset-name">{asset.name}</div>
                    <div className="asset-value">{asset.type === 'Color' ? asset.value : asset.type}</div>
                </div>
                {asset.type === 'Color' && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onCopy(asset.value, asset.id); }}
                        style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', color: '#71717a' }}
                    >
                        {copiedId === asset.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                )}
            </div>
        </motion.div>
    )
}
