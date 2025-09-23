import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    Video,
    X,
    ChevronLeft,
    ChevronRight,
    Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Gallery = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState("all");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const savedMedia = localStorage.getItem("ghgambit_media");
        if (savedMedia) {
            setMediaItems(JSON.parse(savedMedia));
        } else {
            const mockMedia = [
                {
                    id: 1,
                    type: "photo",
                    title: "Championship Victory",
                    description: "Team celebrating after winning the championship",
                    thumbnail:
                        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
                    url: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
                    date: "2024-01-10",
                },
                {
                    id: 2,
                    type: "video",
                    title: "Game Highlights",
                    description: "Best moments from last game",
                    thumbnail:
                        "https://images.unsplash.com/photo-1505842465776-3d90f616310d",
                    url: "https://images.unsplash.com/photo-1505842465776-3d90f616310d",
                    date: "2024-01-08",
                },
                {
                    id: 3,
                    type: "photo",
                    title: "Team Training",
                    description: "Behind the scenes training session",
                    thumbnail:
                        "https://images.unsplash.com/photo-1586880244406-556ebe35f282",
                    url: "https://images.unsplash.com/photo-1586880244406-556ebe35f282",
                    date: "2024-01-05",
                },
            ];
            setMediaItems(mockMedia);
            localStorage.setItem("ghgambit_media", JSON.stringify(mockMedia));
        }
    }, []);

    const filteredItems = mediaItems
        .filter(
            (item) =>
                filter === "all" || item.type === filter.slice(0, -1) // "photos" → "photo"
        )
        .filter(
            (item) =>
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase())
        );

    const openLightbox = (item, index) => {
        setSelectedItem(item);
        setCurrentIndex(index);
    };

    const closeLightbox = () => {
        setSelectedItem(null);
    };

    const navigateMedia = (direction) => {
        const newIndex =
            direction === "next"
                ? (currentIndex + 1) % filteredItems.length
                : (currentIndex - 1 + filteredItems.length) % filteredItems.length;

        setCurrentIndex(newIndex);
        setSelectedItem(filteredItems[newIndex]);
    };

    const filterButtons = [
        { id: "all", label: "All Media", icon: Camera },
        { id: "photos", label: "Photos", icon: Camera },
        { id: "videos", label: "Videos", icon: Video },
    ];

    return (
        <section className="py-16 px-4 md:px-8">
            <div className="container mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent">
                        Gallery
                    </h1>
                    <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
                        Relive the best <span className="text-primary">GH GAMBIT</span>{" "}
                        moments. Exclusive photos & videos from games, training, and events.
                    </p>
                </motion.div>

                {/* Search + Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
                    <div className="flex space-x-3">
                        {filterButtons.map((button) => {
                            const IconComponent = button.icon;
                            return (
                                <button
                                    key={button.id}
                                    onClick={() => setFilter(button.id)}
                                    className={`btn-glass flex items-center gap-2 text-sm md:text-base ${filter === button.id
                                            ? "bg-primary text-primary-foreground shadow-liquid"
                                            : "hover:bg-overlay-light"
                                        }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span className="hidden sm:inline">{button.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <Input
                        placeholder="Search moments..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                                    .replace(/<[^>]*>?/gm, "") // remove tags
                                    .replace(/https?:\/\/\S+/g, "") // remove links
                            )
                        }
                        className="input-glass w-full md:w-64"
                    />
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * index, duration: 0.4 }}
                            className="glass-base rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-300"
                            onClick={() => openLightbox(item, index)}
                        >
                            <div className="aspect-square relative">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />

                                {item.type === "video" && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center shadow-liquid">
                                            <Play className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground ml-1" />
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`badge-glass flex items-center gap-1 ${item.type === "video"
                                                ? "text-error border-error/40"
                                                : "text-info border-info/40"
                                            }`}
                                    >
                                        {item.type === "video" ? (
                                            <>
                                                <Video className="w-3 h-3" /> Video
                                            </>
                                        ) : (
                                            <>
                                                <Camera className="w-3 h-3" /> Photo
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                                <p className="text-muted text-xs md:text-sm mb-1 line-clamp-2">
                                    {item.description}
                                </p>
                                <p className="text-xs text-muted/80">
                                    {new Date(item.date).toLocaleDateString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                            onClick={closeLightbox}
                        >
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="relative max-w-4xl w-full glass-base rounded-2xl overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={closeLightbox}
                                    className="absolute top-4 right-4 z-10 btn-glass p-2 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Navigation */}
                                {filteredItems.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => navigateMedia("prev")}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 btn-glass p-2 rounded-full"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => navigateMedia("next")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 btn-glass p-2 rounded-full"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                <div className="aspect-video">
                                    <img
                                        src={selectedItem.url}
                                        alt={selectedItem.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                                        {selectedItem.title}
                                    </h3>
                                    <p className="text-muted mb-3">{selectedItem.description}</p>
                                    <p className="text-xs text-muted/70">
                                        {new Date(selectedItem.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Gallery;
