
import React from 'react';
import { X, Play, Pause, Volume2, Maximize } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black rounded-lg overflow-hidden">
        <div className="relative">
          {/* Video Container */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black aspect-video">
            {/* Placeholder for video - you can replace this with actual video element */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Démonstration AfriKassa</h3>
                <p className="text-gray-300">Découvrez comment gérer votre bar/restaurant</p>
              </div>
            </div>
            
            {/* Video Element - Replace src with your actual video URL */}
            <video 
              className="w-full h-full object-cover opacity-20"
              poster="/placeholder.svg"
              controls
              preload="metadata"
            >
              <source src="#" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>

          {/* Custom Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors">
                  <Play className="h-5 w-5 ml-1" />
                </button>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5" />
                  <div className="w-20 h-1 bg-gray-600 rounded-full">
                    <div className="w-3/4 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="text-sm">0:00 / 5:32</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-white/20 rounded transition-colors">
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full h-1 bg-gray-600 rounded-full cursor-pointer">
                <div className="w-1/4 h-1 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Info */}
        <div className="p-6 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Découvrez AfriKassa en Action
          </h2>
          <p className="text-gray-600 mb-4">
            Cette démonstration vous montre comment utiliser toutes les fonctionnalités 
            d'AfriKassa pour gérer efficacement votre bar ou restaurant.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Gestion de Stock
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Suivi des Ventes
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Rapports Détaillés
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Interface Intuitive
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
