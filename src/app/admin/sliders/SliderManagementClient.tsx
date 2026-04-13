'use client';

import { useState, useEffect } from 'react';
import { adminSupabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';
import { ImageCropper } from '@/components/admin/ImageCropper';
import { 
  Loader2, 
  Image as ImageIcon, 
  Plus,
  Trash2,
  UploadCloud,
  GripVertical
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';

export interface SliderImage {
  id: string;
  image_url: string;
  mobile_image_url?: string;
  title: string;
  subtitle: string;
  link: string;
  order_index: number;
  is_active: boolean;
}

interface SortableSliderCardProps {
  slider: SliderImage;
  saving: string | null;
  onDelete: (id: string) => void;
  onFileChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleStatus: (slider: SliderImage) => void;
}

function SortableSliderCard({ slider, saving, onDelete, onFileChange, onToggleStatus }: SortableSliderCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: slider.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const isUploading = saving === slider.id;
  const isToggling = saving === slider.id + '-toggle';

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 flex flex-col group relative transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${isDragging ? 'opacity-50 ring-2 ring-black/5 scale-[0.98]' : ''}`}
    >
      {/* Redesigned Top Controls */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
        {/* Grip Handle (6 Dots) */}
        <div 
          {...attributes} 
          {...listeners} 
          className="p-2 bg-white/90 backdrop-blur-sm text-gray-400 rounded-full shadow-sm hover:text-black hover:bg-white cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </div>
        {/* Delete Button - Fixed Z-Index */}
        <button 
          onClick={() => onDelete(slider.id)}
          className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-sm hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="w-full aspect-[4/3] bg-[#F8F9FA] rounded-2xl overflow-hidden mb-4 relative cursor-pointer group/img">
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => onFileChange(slider.id, e)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          disabled={isUploading}
        />
        
        {slider.image_url ? (
          <img src={slider.image_url} alt="Slider" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <ImageIcon size={32} className="opacity-50" />
            <span className="text-xs font-semibold uppercase tracking-widest">Upload Image</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#FDBA74] mb-2" size={24} />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Saving...</span>
          </div>
        )}
        
        {!isUploading && slider.image_url && (
          <div className="absolute inset-0 bg-black/40 z-10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <UploadCloud size={14} /> Change
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto px-1">
        <button
          onClick={() => onToggleStatus(slider)}
          disabled={isToggling}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${
            slider.is_active 
              ? "bg-green-100 text-green-700 hover:bg-green-200" 
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {isToggling && <Loader2 size={10} className="animate-spin" />}
          {slider.is_active ? 'Visible' : 'Hidden'}
        </button>
      </div>
    </div>
  );
}

export default function SliderManagementClient({ initialData }: { initialData: SliderImage[] }) {
  const [sliders, setSliders] = useState<SliderImage[]>(initialData);
  const [saving, setSaving] = useState<string | null>(null);
  const [croppingAsset, setCroppingAsset] = useState<{ sliderId: string; file: File; preview: string } | null>(null);
  const router = useRouter();

  // Sync state and force a server-side refresh when initialData changes (e.g., after navigation/tab switch)
  useEffect(() => {
    setSliders(initialData);
    router.refresh();
  }, [initialData, router]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileChange = async (sliderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setCroppingAsset({ sliderId, file, preview });
    e.target.value = '';
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSliders((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order_index for all items locally
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order_index: index
        }));

        // Persist to Supabase
        updateOrderInDB(updatedItems);
        
        return updatedItems;
      });
    }
  };

  const updateOrderInDB = async (updatedItems: SliderImage[]) => {
    try {
      // Small optimization: only update non-temp items
      const persistentItems = updatedItems.filter(s => !s.id.startsWith('temp-'));
      
      const updates = persistentItems.map(item => 
        adminSupabase
          .from('slider_images')
          .update({ order_index: item.order_index })
          .eq('id', item.id)
      );

      await Promise.all(updates);
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const handleCropComplete = async (desktopFile: File, mobileFile: File) => {
    if (!croppingAsset) return;
    const sliderId = croppingAsset.sliderId;
    URL.revokeObjectURL(croppingAsset.preview);
    setCroppingAsset(null);
    setSaving(sliderId);

    try {
      const url = await uploadImage(desktopFile, 'products');
      const slider = sliders.find(s => s.id === sliderId);
      if (!slider) return;

      const isNew = slider.id.startsWith('temp-');
      let res;

      if (isNew) {
        res = await adminSupabase
          .from('slider_images')
          .insert({
            title: '',
            subtitle: '',
            link: '',
            image_url: url,
            mobile_image_url: url,
            order_index: slider.order_index,
            is_active: slider.is_active,
          })
          .select()
          .single();
      } else {
        res = await adminSupabase
          .from('slider_images')
          .update({ image_url: url, mobile_image_url: url })
          .match({ id: slider.id })
          .select()
          .single();
      }

      if (res.error) throw res.error;
      setSliders(prev => prev.map(s => s.id === sliderId ? res.data : s));
    } catch (err) {
      console.error('Error saving image:', err);
      alert('Failed to upload image.');
    } finally {
      setSaving(null);
    }
  };

  async function handleToggleStatus(slider: SliderImage) {
    if (slider.id.startsWith('temp-')) {
      setSliders(prev => prev.map(s => s.id === slider.id ? { ...s, is_active: !s.is_active } : s));
      return;
    }

    setSaving(slider.id + '-toggle');
    try {
      const { data, error } = await adminSupabase
        .from('slider_images')
        .update({ is_active: !slider.is_active })
        .eq('id', slider.id)
        .select()
        .single();
        
      if (error) throw error;
      setSliders(prev => prev.map(s => s.id === slider.id ? data : s));
    } catch (err) {
      console.error('Error toggling:', err);
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image?')) return;
    if (!id.startsWith('temp-')) {
      const { error } = await adminSupabase.from('slider_images').delete().match({ id });
      if (error) {
        console.error('Error deleting:', error);
        return;
      }
    }
    setSliders(prev => prev.filter(s => s.id !== id));
  }

  const addNewSlider = () => {
    setSliders(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        title: '',
        subtitle: '',
        link: '',
        image_url: '',
        order_index: prev.length,
        is_active: true
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tighter italic uppercase">Banner Grid</h1>
          <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Manage grid images displayed seamlessly below the hero section.</p>
        </div>
        <button 
          onClick={addNewSlider}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-none text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
        >
          <Plus size={16} />
          Add Image
        </button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement, restrictToWindowEdges]}
      >
        <SortableContext 
          items={sliders.map(s => s.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sliders.map((slider) => (
              <SortableSliderCard 
                key={slider.id}
                slider={slider}
                saving={saving}
                onDelete={handleDelete}
                onFileChange={handleFileChange}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {croppingAsset && (
        <ImageCropper 
          imageSrc={croppingAsset.preview}
          originalFile={croppingAsset.file}
          singleStep={true}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            URL.revokeObjectURL(croppingAsset.preview);
            setCroppingAsset(null);
          }}
        />
      )}
    </div>
  );
}


