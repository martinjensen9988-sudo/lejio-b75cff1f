import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RatingStars } from './RatingStars';
import { useLessorRatings } from '@/hooks/useLessorRatings';
import { Loader2 } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  lessorId: string;
  lessorName: string;
}

export const RatingModal = ({
  isOpen,
  onClose,
  bookingId,
  lessorId,
  lessorName,
}: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitRating } = useLessorRatings();

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    const success = await submitRating(bookingId, lessorId, rating, reviewText);
    setIsSubmitting(false);

    if (success) {
      onClose();
      setRating(0);
      setReviewText('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vurder din udlejer</DialogTitle>
          <DialogDescription>
            Hvordan var din oplevelse med {lessorName}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <Label className="text-base">Din vurdering</Label>
            <RatingStars
              rating={rating}
              size="lg"
              interactive
              onRatingChange={setRating}
            />
            <span className="text-sm text-muted-foreground">
              {rating === 0 && 'Klik på stjernerne for at vurdere'}
              {rating === 1 && 'Meget dårlig'}
              {rating === 2 && 'Dårlig'}
              {rating === 3 && 'Okay'}
              {rating === 4 && 'God'}
              {rating === 5 && 'Fremragende'}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Din anmeldelse (valgfri)</Label>
            <Textarea
              id="review"
              placeholder="Fortæl andre om din oplevelse..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Annuller
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Send vurdering
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
